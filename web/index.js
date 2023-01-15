// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";
import shopify from "./shopify.js";
import GDPRWebhookHandlers from "./gdpr.js";
import populateProducts from "./helpers/populate-products.js";
import dotenv from "dotenv";
import cors from 'cors';
import gptGenerateProducts from "./helpers/gpt-generate-products.js";
import gptValidateProducts from "./helpers/gpt-validate-products.js";

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


app.get("/api/openai/gpt/fetch/:category/:productCount/:tagCount", async (_req, res) => {
  const category = _req.params["category"];
  const productCount = parseInt(_req.params["productCount"]);
  const tagCount = parseInt(_req.params["tagCount"]);
  const validation = {};
  let haveAllData = false;
  const productData = {
    categories: [],
    products: [],
  };

  try {
    const response = await gptGenerateProducts(category, productCount, tagCount)

    if (response.products) {
      res.status(200).send(response);
    } else {
      res.status(400).send(response)
    }
  } catch (error) {
    console.log(error)
    res.status(400).send(error)
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
