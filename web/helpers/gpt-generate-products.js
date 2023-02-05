import gptRequest from "./gpt-request.js";
import gptPrompt from "./gpt-prompt.js";
import gptSampleData from "./gpt-sample-data.js";
import gptGenerateImage from "./gpt-generate-image.js";

export default async function gptGenerateProducts(reqArgs) {
  let productData = { categories: [], products: [] };

  const parameters = {
    category: reqArgs.reqCategory,
    tagCount: reqArgs.reqTagCount,
    productCountRequested: reqArgs.reqProductCount,
    productCountCurrent: 0,
    productCountRemaining: 0,
    productCountNextRequest: 0,
    tags: [],
    requestType: 'full',
    prompt: '',
    totalRequestTokens: 0,
    tokens: 0,
    tokensPerProduct: 200,
    maxTokenLimit: 3626,
    requestsRequiredInitial: 0,
    requestsRequiredRemaining: 0,
    requestsPerformed: 0,
  }

  async function getImages() {
    console.log(`== Fetching images ==`)
    const promiseArray = [];
    let delay = 0;

    try {
      for (let i = 0; i < productData.products.length; i++) {
        // promiseArray.push(gptGenerateImage(productData.products[i].dallePrompts[0], delay))
        promiseArray.push(gptGenerateImage(productData.products[i].description, delay))
        delay = delay + 1000;
      }
      
      const images = await Promise.all(promiseArray)
      
      for (let i = 0; i < productData.products.length; i++) {
        productData.products[i].image = images[i];
      }
  
      return;
    } catch (error) {
      console.log('== Error fetching images')
      console.log(error)
      return;
    }
  }

  async function getProducts() {
    setParameters();

    try {
      for (let i = 0; i < 15; i++) {
        if (parameters.requestsPerformed === 0 || validateProductData() === 'empty') {
          await fullRequest();
          parameters.requestsPerformed++
        }

        if (validateProductData() === 'short') {
          setParameters();
          await partialRequest();
          parameters.requestsPerformed++
        }

        if (validateProductData() == 'ok') {
          await getImages();

          return productData;
        }
      }
    } catch (error) {
      return error;
    }
  }


  async function fullRequest() {
    try {
      const response = await gptRequest(parameters);
      const responseJson = JSON.parse(response);

      productData.categories = responseJson.categories;
      productData.products = responseJson.products;

      return;
    } catch (error) {
      console.log('== Request failed - Data not valid ==')
      return error;
    }
  }


  async function partialRequest() {
    try {
      const response = await gptRequest(parameters);
      const responseJson = JSON.parse(response);

      if (Array.isArray(responseJson.products) && responseJson.products.length > 0) {
        responseJson.products.forEach(item => productData.products.push(item));
      }
      
      return;
    } catch (error) {
      console.log('== Request failed - Data not valid ==')
      return error;
    }
  }


  function setParameters() {
    (productData.products.length === 0) ? parameters.requestType = 'full' : parameters.requestType = 'partial';
    parameters.tags = productData.categories;
    parameters.totalRequestTokens = calculateTokens(parameters.productCountRequested);
    parameters.productCountCurrent = productData.products.length;
    parameters.productCountRemaining = parameters.productCountRequested - productData.products.length;

    // Set total required requests (as calculated on first request)
    parameters.requestsRequiredInitial = Math.ceil(calculateTokens(parameters.productCountRequested) / parameters.maxTokenLimit);

    // Set current required request count - Divide total total token cost by max token limit
    parameters.requestsRequiredRemaining = Math.ceil(calculateTokens(parameters.productCountRemaining) / parameters.maxTokenLimit);

    // Set amount of products to fetch on next request -  Divide required product count with previous value ^^ and set in parameters as next fetch
    parameters.productCountNextRequest = Math.floor(parameters.productCountRemaining / parameters.requestsRequiredRemaining);

    // Max out at 10 per request as response seems to break with too many products.
    // if (parameters.productCountRemaining > 10) {
    //   parameters.productCountNextRequest = 10
    // } else {
    //   parameters.productCountNextRequest = Math.floor(parameters.productCountRemaining / parameters.requestsRequiredRemaining);
    // }    
    
    // Set prompt
    parameters.prompt = gptPrompt(parameters);

    // Calculate total token cost
    parameters.tokens = calculateTokens(parameters.productCountNextRequest);
  }


  function calculateTokens(productCount) {
    const estimatedPromptCost = 270;
    return Math.round(productCount * parameters.tokensPerProduct) + estimatedPromptCost;;
  }
  

  function validateProductData() {
    if (productData.products.length >= parameters.productCountRequested) {
      return 'ok'
    }

    if (productData.products.length == 0) {
      return 'empty'
    }

    if (productData.products.length < parameters.productCountRequested) {
      return 'short'
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