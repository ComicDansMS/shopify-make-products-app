import gptRequest from "./gpt-request.js";
import gptPrompt from "./gpt-prompt.js";
import gptSampleData from "./gpt-sample-data.js";

export default async function gptGenerateProducts(reqArgs) {
  let productData = { categories: [], products: [] };

  const parameters = {
    category: reqArgs.reqCategory,
    tagCount: reqArgs.reqTagCount,
    productCount: reqArgs.reqProductCount,
    tags: [],
    requestType: 'full',
    prompt: '',
    tokens: 0,
  }


  async function getProducts() {
    parameters.prompt = gptPrompt(parameters);
    parameters.tokens = calculateTokens(parameters);

    try {
      for (let i = 0; i < 2; i++) {
        console.log(`== Begin forloop. Loop count: ${i} ==`);

        if (validateProductData() == 'empty') {
          console.log(`== Product list empty ==`);
          await fullRequest();
        }

        if (validateProductData() == 'short') {
          console.log(`== Product list short - ${productData.products.length} of ${parameters.productCount} products. ==`);
          await partialRequest();
        }

        if (validateProductData() == 'ok') {
          console.log('== Product list ok ==');
          return productData;
        }
      }
    } catch (error) {
      return error;
    }
  }

  function calculateTokens(parameters) {
    const promptTokens = parameters.prompt.length / 4;
    const tokensPerProduct = 120;
    const tokens = promptTokens + (parameters.productCount * tokensPerProduct);

    return Math.round(tokens);
  }


  async function fullRequest() {
    console.log('== Making full request ==');
    try {
      const response = await gptRequest(parameters);
      const responseJson = JSON.parse(response);

      productData.categories = responseJson.categories;
      productData.products = responseJson.products;

      return;
    } catch (error) {
      console.log(error)
      return error;
    }
  }


  async function partialRequest() {
    console.log(`== ${productData.products.length} of ${parameters.productCount} products. Making partial request ==`);

    updateParameters();

    try {
      const response = await gptRequest(parameters);
      const responseJson = JSON.parse(response);

      if (Array.isArray(responseJson.products) && responseJson.products.length > 0) {
        responseJson.products.forEach(item => productData.products.push(item));
      }
      
      return;
    } catch (error) {
      console.log(error)
      return error;
    }
  }


  function updateParameters() {
    parameters.productCount = parameters.productCount - productData.products.length;
    parameters.requestType = 'partial';
    parameters.tags = productData.categories;
    parameters.prompt = gptPrompt(parameters);
    parameters.tokens = calculateTokens(parameters);
  }
  

  function validateProductData() {
    if (productData.products.length >= parameters.productCount) {
      return 'ok'
    }

    if (productData.products.length > 0 && productData.products.length < parameters.productCount) {
      return 'short'
    }

    if (productData.products.length == 0) {
      return 'empty'
    }

    console.log(`== Validation error ==`);
     return 'error'
  }

  // For testing purposes
  // function removeProduct() {
  //   if (requests <= 4) {
  //     console.log(`== Removing 2 products (Requests: ${requests}) ==`);
  //     productData.products.splice(0,2);
  //   }
  // }
  

  return new Promise((resolve, reject) => {
    getProducts()
      .then(response => {
        console.log('== Resolving ==')
        resolve(response)
      })
      .catch(error => reject(error));
  })
}