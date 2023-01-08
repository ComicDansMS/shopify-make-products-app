import quantityGenerator from "./quantityGenerator";

export default function formatProductData(inputData) {
  const products = [];
  let productLoopIndex = 0;

  console.log('inputData: ', inputData)

  inputData.forEach(product => {
    products[productLoopIndex] = {};

    products[productLoopIndex] = {
      title: product.title,
      descriptionHtml: product.description,
      productType: product.productType,
      tags: product.tags,
      options: [],
      variants: [],
    }

    // Assign options
    for (const [key] of Object.entries(product.options)) {
      products[productLoopIndex].options.push(key)
    }

    productLoopIndex++;
  })

  console.log('products', products);
}