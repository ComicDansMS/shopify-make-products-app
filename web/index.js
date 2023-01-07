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
  const tokens = productCount * 20;
  const tokenCostPer1k = 0.02;
  const requestCost = Math.round(tokenCostPer1k * (tokens / 1000) * 10000) / 10000;
  const prompt = `
    Generate ${tagCount} product categories relating to ${category}.
    With the previously generated categories, create ${productCount} products with descriptive titles. Make some a little humourous.
    Limit the products to the previously generated categories.
    Give each product a price, that reflects the real-world market, with two decimal places. When assigning sizes, only include options of 's', 'm', 'l', etc.
    If applicable, give the product options relating to the item, such as size and colour.
    Give each product a description with a maximum length of 40 words. Do not give available sizes in description.
    Format as a JSON object.
    
    Example:
    
    {
        categories: [
            'category',
        ],
        products: [
            {
              title: 'Product Title',
              description: 'Vivamus magna justo, lacinia eget consectetur sed, convallis at tellus. Pellentesque in ipsum id orci porta dapibus. Proin eget tortor risus.'
              tags: 'Category',
              options: [
                size: ['s','m','l'],
                colour: ['granite','beige','sky blue']
              ],
              price: '19.99',
              weight: 600,
              weightUnit: 'g'
            },
        ]
    }
  `;

  console.log(`
Sending request to OpenAI
CATEGORY: ${category}
TAGS: ${tagCount}
PRODUCTS: ${productCount}
MAX TOKENS: ${tokens}
MAX COST: \$${requestCost}
  `);

  const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
  const openai = new OpenAIApi(configuration);

  try {
    const completion = await openai.createCompletion(
      {
        model: 'text-davinci-003',
        prompt: prompt,
        temperature: 0.5,
        top_p: 0.5,
        frequency_penalty: 0,
        presence_penalty: 2,
        max_tokens: tokens,
      }
    );

    const completionTokensPerProduct = completion.data.usage.total_tokens / productCount;
    const completionTokensTotal = completion.data.usage.total_tokens;
    const completionCost = Math.round(tokenCostPer1k * (completionTokensTotal / 1000) * 10000) / 10000;
    const completionText = completion.data.choices[0].text;

    console.log(`TOKENS PER PRODUCT: ${completionTokensPerProduct}`);
    console.log(`TOTAL TOKENS: ${completionTokensTotal}`);
    console.log(`TOTAL COST: \$${completionCost}`);
    console.log(`COMPLETION TEXT: ${completionText}`);
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
