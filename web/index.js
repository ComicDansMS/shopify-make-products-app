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


app.get("/api/openai/gpt/:category/:productCount/:tagCount", async (_req, res) => {  
  const category = _req.params["category"];
  const productCount = parseInt(_req.params["productCount"]);
  const tagCount = parseInt(_req.params["tagCount"]);
  const promptTokens = 360;
  const tokensPerProduct = 100;
  const tokens = promptTokens + (productCount * tokensPerProduct);
  const tokenCostPer1k = 0.02;
  const prompt = `Generate ${tagCount} categories relating to ${category} products.Generate ${productCount} products,with unique and obscure titles,relating to the generated categories.Make some product titles humourous, but not all.Add options if applicable to the product,such as size and colour.Have a variety of normal colour names and obscure colour names.Not all products require options.Make different products have different option counts.Don't include an option if there is only one value for the option.The price must not have any characters other than numbers and a period.Make a random selection of the products on sale.If it's on sale,label the original price as "compareAtPrice" and the sale price as "price".State whether product requires shipping as a boolean of true or false.Assign a product type.Response must be formatted as a JSON object.Example:

  {"categories":["category"],"products":[{"title":"Product Title","description":"Vivamus suscipit tortor eget felis porttitor volutpat. Nulla porttitor accumsan tincidunt. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae. Donec velit neque, auctor sit amet aliquam vel, ullamcorper sit amet ligula.","tags":["Category"],"price":"19.99","compareAtPrice":"","options":[{"name":"size","values":["s","m","l"]},{"name":"colour","values":["granite","beige","sky blue"]}],"productType":"Product Type","requiresShipping":true,"weight":600,"weightUnit":"g"}]}`;

  console.log(`
**** SENDING OPENAI REQUEST ****
CATEGORY: ${category}
TAGS: ${tagCount}
PRODUCTS: ${productCount}
TOKENS: ${tokens}
PROMPT: ${prompt}`
  );

  const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
  const openai = new OpenAIApi(configuration);

  try {
    const completion = await openai.createCompletion(
      {
        model: 'text-davinci-003',
        prompt: prompt,
        temperature: 0.8,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 2,
        max_tokens: tokens,
      }
    );

    console.log(`
**** RESPONSE RECEIVED ****
PROMPT TOKENS: ${completion.data.usage.prompt_tokens}
COMPLETION TOKENS: ${completion.data.usage.completion_tokens}
TOTAL TOKENS: ${completion.data.usage.total_tokens}
TOKENS PER PRODUCT: ${(completion.data.usage.total_tokens - completion.data.usage.prompt_tokens) / productCount}
TOTAL COST: \$${Math.round(tokenCostPer1k * (completion.data.usage.total_tokens / 1000) * 10000) / 10000}
    `);

    res.status(200).send(completion.data);
  } catch (error) {
    if (error.response.status) {
      console.log(error.response);
      res.status(error.response.status).send(error.response);
    } else {
      console.log(error);
      res.send(error);
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
