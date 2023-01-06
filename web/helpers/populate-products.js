import { GraphqlQueryError } from "@shopify/shopify-api";
import toArray from "../frontend/helpers/to-array.js";
import shopify from "../shopify.js";

const POPULATE_PRODUCTS_MUTATION = `
  mutation populateProduct($input: ProductInput!) {
    productCreate(input: $input) {
      product {
        id,
        title,
        tags
      }
    }
  }
`;

export default async function populateProducts(session, products) {
  const client = new shopify.api.clients.Graphql({ session });
  const newProducts = [];

  // Split products string into array
  const productsArray = products.split(new RegExp(',(?!")'))
  
  try {
    for (let i = 0; i < productsArray.length; i++) {

      // Convert to JSON object for ease of property assignment
      const product = JSON.parse(productsArray[i]);

      await client.query({
        data: {
          query: POPULATE_PRODUCTS_MUTATION,
          variables: {
            input: {
              title: `${product.title}`,
              tags: [`${product.tag}`],
            },
          },
        },
      }).then(response => {
        console.log(`Created product: ${response.body.data.productCreate.product.title}`);

        newProducts.push({
          id: response.body.data.productCreate.product.id,
          title: response.body.data.productCreate.product.title,
          tags: response.body.data.productCreate.product.tags
        });
      });

      if (i === productsArray.length - 1) {
        console.log('Product creation complete');
        return newProducts;
      }
    }
  } catch (error) {
    if (error instanceof GraphqlQueryError) {
      throw new Error(
        `${error.message}\n${JSON.stringify(error.response, null, 2)}`
      );
    } else {
      throw error;
    }
  }
}