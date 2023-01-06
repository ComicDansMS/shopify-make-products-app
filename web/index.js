// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";
import shopify from "./shopify.js";
import GDPRWebhookHandlers from "./gdpr.js";
import populateProducts from "./helpers/populate-products.js";
import dotenv from "dotenv";
import { Configuration, OpenAIApi } from "openai";
import cors from 'cors';

dotenv.config();

const PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT, 10);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

app.use(cors());

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: GDPRWebhookHandlers })
);

// All endpoints after this point will require an active session
app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json());

app.get("/api/products/create/:productData", async (_req, res) => {
  const productData = _req.params["productData"];

  const products = await populateProducts(res.locals.shopify.session, productData);

  res.send(products);
});

app.get("/api/openai/gpt/:item/:category/:count", async (_req, res) => {  
  const item = _req.params["item"];
  const category = _req.params["category"];
  const count = parseInt(_req.params["count"]);
  const tokens = count * 15;
  const tokenCostPer1k = 0.02;
  const requestCost = tokenCostPer1k * (tokens / 1000);

  console.log(`Sending request to OpenAI API for ${count} ${item} with a category of ${category} at a maximum cost of \$${requestCost}`);

  const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
  const openai = new OpenAIApi(configuration);
  let prompt;
  
  if (item === 'products') {
    prompt = `List ${count} descriptive, unique product titles in the category of ${category}. Seperate each item with a | character, no numbers.`;
  } else if (item === 'tags') {
    prompt = `List ${count} categories relating to ${category}. Seperate each item with a | character, no numbers.`;
  }

  try {
    const completion = await openai.createCompletion(
      {
        model: 'text-davinci-003',
        prompt: prompt,
        max_tokens: tokens
      }
    );
    console.log('Prompt text:', prompt)
    console.log('Completion text:', completion.data.choices[0].text)
    res.send(completion.data);
  } catch (error) {
    if (error.response) {
      res.send(error.response.status);
      res.send(error.response.data);
    } else {
      res.send(error.message);
    }
  }
})

app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);
