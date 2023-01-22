export default function gptPrompt(promptArgs) {
  const { tagCount, category, productCount, promptType, tags, partialProductCount } = promptArgs;

  if (promptType === 'full') {
    const prompt = `Generate ${tagCount} categories relating to ${category} products.Generate ${productCount} products,with unique and obscure titles,relating to the generated categories.Make some product titles humourous, but not all.Product titles must be at least 5 words long. Some titles are up to 8 words long.Add options if applicable to the product,such as size and colour.Dont limit options to size and colour.Have a variety of normal and obscure option names.If defining sizes, keep it to the same value - All 's, m, l' or 'small, medium, large'.Not all products require options.Different products have different option counts.Don't include an option if there is only one value for the option.State the brand of the product as the vendor.The price must not have any characters other than numbers and a period.Make a random selection of the products on sale.If it's on sale,label the original price as "compareAtPrice" and the sale price as "price".State whether product requires shipping as a boolean of true or false.Assign a product type.Response must be formatted as a JSON object.Example:

    {"categories":["category"],"products":[{"title":"Product Title","description":"Vivamus suscipit tortor eget felis porttitor volutpat. Nulla porttitor accumsan tincidunt. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae. Donec velit neque, auctor sit amet aliquam vel, ullamcorper sit amet ligula.","tags":["Category"],"price":"19.99","compareAtPrice":"","options":[{"name":"size","values":["s","m","l"]},{"name":"colour","values":["granite","beige","sky blue"]}],"vendor":"Brand","productType":"Product Type","requiresShipping":true,"weight":600,"weightUnit":"g"}]}`;

    console.log('prompt', prompt)

    return prompt;
  }

  if (promptType === 'partial') {
    const prompt =  `Generate ${partialProductCount} products,with unique and obscure titles,relating to ${category}.Assign the following tags to the products:${tags.join(', ')}.Make some product titles humourous, but not all.Product titles must be at least 5 words long. Some titles are up to 8 words long.Add options if applicable to the product,such as size and colour.Dont limit options to size and colour.Have a variety of normal and obscure option names.If defining sizes, keep it to the same value - All 's, m, l' or 'small, medium, large'.Not all products require options.Different products have different option counts.Don't include an option if there is only one value for the option.State the brand of the product as the vendor.The price must not have any characters other than numbers and a period.Make a random selection of the products on sale.If it's on sale,label the original price as "compareAtPrice" and the sale price as "price".State whether product requires shipping as a boolean of true or false.Assign a product type.Response must be formatted as a JSON object.Example:

    {"categories":["category"],"products":[{"title":"Product Title","description":"Vivamus suscipit tortor eget felis porttitor volutpat. Nulla porttitor accumsan tincidunt. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae. Donec velit neque, auctor sit amet aliquam vel, ullamcorper sit amet ligula.","tags":["tag"],"price":"19.99","compareAtPrice":"","options":[{"name":"size","values":["s","m","l"]},{"name":"colour","values":["granite","beige","sky blue"]}],"vendor":"Brand","productType":"Product Type","requiresShipping":true,"weight":600,"weightUnit":"g"}]}`;

    console.log('prompt', prompt)

    return prompt;
  }
}