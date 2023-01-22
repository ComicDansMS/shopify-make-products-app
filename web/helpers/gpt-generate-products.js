import gptRequest from "./gpt-request.js";
import gptPrompt from "./gpt-prompt.js";

export default async function gptGenerateProducts(reqArgs) {
  const { reqCategory, reqTagCount, reqProductCount } = reqArgs;
  const productData = {
    categories: [],
    products: [],
  };

  const paromptArgs = {
    category: reqCategory,
    tagCount: reqTagCount,
    productCount: reqProductCount,
    promptType: 'full',
    tags: [],
    partialProductCount: null,
  };

  const prompt = gptPrompt(paromptArgs);

  async function initiate() {
    try {
      await initialRequest()

      if (validateProductData() == 'ok') {
        return productData;
      }

      // if (validateProductData() == 'short') {
      //   updateReqArgs();
      //   updatePrompt();

      //   await partialRequest();
      // }

    } catch (error) {
      return error;
    }
  }


  async function initialRequest() {
    try {
      const response = await gptRequest(reqArgs, prompt);
      const responseJson = JSON.parse(response);
      productData.categories = responseJson.categories;
      productData.products = responseJson.products;

      return productData;
    } catch (error) {
      console.log(error)
      return error;
    }
  }

  async function partialRequest() {
    try {
      const response = await gptRequest(reqArgs, prompt);
      const responseJson = JSON.parse(response);
      productData.products.push(responseJson.products)

    } catch (error) {
      console.log(error)
      return error;
    }
  }

  function updateReqArgs() {

  }

  function updatePrompt() {

  }

  function validateProductData() {
    if (productData.products.length >= reqProductCount) {
      return 'ok'
    }

    if (productData.products.length > 0 && productData.products.length < reqProductCount) {
      return 'short'
    }

     return 'error'
  }
  

  return new Promise((resolve, reject) => {
    initiate()
      .then(response => resolve(response))
      .catch(error => reject(error));
  })
}