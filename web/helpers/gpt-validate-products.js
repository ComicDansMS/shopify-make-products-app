export default function gptValidateProducts(data, requestedProductCount) {  
  const validationObj = {
    passed: true,
    message: null,
    refetch: null,
    refetchCount: null,
  }

  // data.products.forEach(product => {
  //   if (product.description === '') {
  //     validationObj.passed = false;
  //     validationObj.message = 'descriptions empty';
  //     validationObj.refetch = 'all';
  //   }
  // })

  // if (data.products.length < requestedProductCount) {
  //   validationObj.passed = false;
  //   validationObj.message = 'not enough products';
  //   validationObj.refetch = 'partial';
  //   validationObj.refetchCount = requestedProductCount - data.products.length;
  // }

  return validationObj;
}