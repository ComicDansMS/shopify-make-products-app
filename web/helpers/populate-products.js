import { GraphqlQueryError } from "@shopify/shopify-api";
import shopify from "../shopify.js";

const POPULATE_PRODUCTS_MUTATION = `
  mutation populateProduct($input: ProductInput!) {
    productCreate(input: $input) {
      product {
        id,
        title
      }
    }
  }
`;

export default async function populateProducts(session, productData) {
  const client = new shopify.api.clients.Graphql({ session });
  const productDataObj = JSON.parse(productData);
  const { titles, tags } = productDataObj;
  const newProducts = [];

  try {
    for (let i = 0; i < titles.length; i++) {
      await client.query({
        data: {
          query: POPULATE_PRODUCTS_MUTATION,
          variables: {
            input: {
              title: `${titles[i]}`,
            },
          },
        },
      }).then(response => {
        console.log(`Created product: ${response.body.data.productCreate.product.title}`);

        newProducts.push({
          id: response.body.data.productCreate.product.id,
          title: response.body.data.productCreate.product.title
        });
      });

      if (i === titles.length - 1) {
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