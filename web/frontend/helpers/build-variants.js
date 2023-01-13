export default function buildVariants(product) {
  const variants = [];
  let productVariant = {};
  const variantOptions = [];
  let sku = Math.floor(Math.random() * 999999999999)

  function createVariantOptions(options, variant = []) {
    if (options.length === 0) {
        variantOptions.push(variant);
        return;
    }

    const option = options[0];

    for (let i = 0; i < option.values.length; i++) {
        const value = option.values[i];
        createVariantOptions(options.slice(1), variant.concat(value));
    }
  }

  if (product.options > 0) {
    createVariantOptions(product.options);

    variantOptions.forEach(options => {
      productVariant.compareAtPrice = product.compareAtPrice,
      productVariant.options = options
      productVariant.price = product.price,
      productVariant.requiresShipping = product.requiresShipping,
      productVariant.sku = sku,
      productVariant.weight = product.weight,
      productVariant.weightUnit = product.weightUnit
  
      variants.push(productVariant)
      productVariant = {};
      sku++;
    })

    return variants;
  } else {
    productVariant.compareAtPrice = product.compareAtPrice,
    productVariant.options = "",
    productVariant.price = product.price,
    productVariant.requiresShipping = product.requiresShipping,
    productVariant.sku = sku,
    productVariant.weight = product.weight,
    productVariant.weightUnit = product.weightUnit

    return productVariant;
  }

}




