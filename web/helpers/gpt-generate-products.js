import gptRequest from "./gpt-request.js";
import gptPrompt from "./gpt-prompt.js";
import gptSampleData from "./gpt-sample-data.js";

export default async function gptGenerateProducts(reqArgs) {
  const { reqCategory, reqTagCount, reqProductCount } = reqArgs;
  let requests = 0;
  let productData = {
    categories: [],
    products: [],
  };
  const promptArgs = {
    category: reqCategory,
    tagCount: reqTagCount,
    productCount: reqProductCount,
    promptType: 'full',
    tags: [],
  };
  let prompt = gptPrompt(promptArgs);


  async function getProducts() {   
    try {
      for (let i = 0; requests < 5; i++) {
        console.log(`== Begin forloop. Requests: ${requests} ==`);

        if (validateProductData() == 'empty') {
          await fullRequest();
        }

        if (validateProductData() == 'short') {
          await partialRequest();
        }

        if (validateProductData() == 'ok') {
          return productData;
        }
      }
    } catch (error) {
      return error;
    }
  }


  async function fullRequest() {
    console.log('== Making full request ==');
    try {
      requests++;

      const response = await gptRequest(reqArgs, prompt);
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
    console.log(`== ${productData.products.length} of ${reqProductCount} products. Making partial request ==`);
    requests++;

    updateReqArgs();
    updatePrompt();

    try {
      const response = await gptRequest(reqArgs, prompt);
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


  function updateReqArgs() {
    reqArgs.partialProductCount = reqProductCount - productData.products.length;
    promptArgs.promptType = 'partial';
    promptArgs.tags = productData.categories;
    promptArgs.productCount = reqProductCount - productData.products.length;
  }


  function updatePrompt() {
    prompt = gptPrompt(promptArgs);
  }
  

  function validateProductData() {
    if (productData.products.length >= reqProductCount) {
      console.log('== Validation ok ==');
      return 'ok'
    }

    if (productData.products.length > 0 && productData.products.length < reqProductCount) {
      console.log(`== Validation short - ${productData.products.length} of ${reqProductCount} products. ==`);
      return 'short'
    }

    if (productData.products.length == 0) {
      console.log(`== Validation empty ==`);
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