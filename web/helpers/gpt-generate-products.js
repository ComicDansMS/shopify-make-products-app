import gptLogRequest from "./gpt-log-request.js";
import gptRequest from "./gpt-request.js";
import gptValidateProducts from "./gpt-validate-products.js";

export default async function gptGenerateProducts(category, productCount, tagCount) {
  let responseData;
  let validationPass = false;

  function checkResponseData(data) {
    const validation = gptValidateProducts(data);

    if (validation.passed) {
      console.log('Validation passed');
      validationPass = true;
    }
  }

  return new Promise((resolve, reject) => {
    function makeRequest() {
      gptRequest(category, productCount, tagCount)
      .then(response => {
        responseData = JSON.parse(response);
        checkResponseData(responseData);
  
        if (validationPass) {
          resolve(responseData);
        } else {
          makeRequest();
        }
      })
      .catch(error => {
        console.log('ERROR');
        console.log(error);
        reject(error);
      })
    }

    makeRequest();
  })
}