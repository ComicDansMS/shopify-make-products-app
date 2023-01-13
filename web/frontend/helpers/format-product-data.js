import buildVariants from "./build-variants";
import quantityGenerator from "./quantityGenerator";
import extractOptions from "./extractOptions";

export default function formatProductData(inputData) {
  const products = [];
  let productLoopIndex = 0;

  console.log('inputData', inputData)

  inputData.forEach(product => {
    products[productLoopIndex] = {};

    products[productLoopIndex] = {
      title: product.title,
      options: extractOptions(product.options),
      descriptionHtml: product.description,
      productType: product.productType,
      tags: ['auto-generated', ...product.tags],
      variants: buildVariants(product),
    }

    productLoopIndex++;
  })

  console.log('products', products);
}