export default function gptPrompt(parameters) {
  let prompt = '';
  if (parameters.requestType === 'full') {
    prompt = `
Generate ${parameters.tagCount} categories relating to ${parameters.category} products.

Generate ${parameters.productCountNextRequest} products, with unique and obscure titles, relating to the generated categories.

Insert the following values into a JSON object, as per the example provided. Variables are denoted by the following: {% variable %}

{% categories %} (array) = Categories - An array of categories. Example: ["Shirts","Pants","Footwear"]{% product_title %} (string) = Product Title - Make some product titles humourous. Product titles must be 4 to 8 words long. Example: "Taquila Swirl Maxi Dress", "Cotton Blouse With Ruffles", "Knitted Vintage Casablanca Scarf"{% description %} (string) = Product Description - A product description between 30 and 50 words. Example: "Luxuriously crafted with a unique blend of wool and cashmere, this vintage Casablanca scarf is perfect for any occasion. With its stylish stripes and subtle sheen, this scarf will add a touch of sophistication to any outfit"{% category %} (array) = Product category - The category must be a string within an array. Example: [ "Shirts" ]{% price %} (integer) = Product price - The produce price in cents. Example: "2950"{% compare_at_price %} (integer) = Original product price when the product is on sale - If the product is on sale, make{% price %} the sale price. Example: "3800"{% options %} (array) = Product Options - If applicable to the product, create product options such as (but not limited to), colour, size, material. Options are not required on every product. Don't include an option if there is only one value for the option. The option values must be an array of values. Example: [ { "name":"% colour %", "values":["sandstone","ocean blue","cosmos black","green"] }, { "name":"size", "values":["xs","s","m","l","xl"] } ]{% brand %} (string) = Product brand. Example: "Nike"{% product_type %} (string) = Product type - The products product type as per the Google Product Category list.{% requires_shipping %} (boolean) = States whether product requires shipping. Digital products, such as digital downloads or online courses, do not require shipping. Physical goods do require shipping. Example: true{% weight %} (integer) = Product weight - The total weight of the product. Example: 2600{% weight_unit %} (string) = The unit of measure for the product weight. Example: "g"{% dalle_prompt %} (string) = A prompt to generate a product image which will be displayed on an e-commerce store. Give a thorough descriptive prompt relating to the product. The image must be professionally photographed in a studio with a white background.The response must be a correctly formatted JSON object, with quotes around both keys and values, and commas where required. Example:

{
"categories":{% categories %},
"products":[
{
"title":{% product_title %},
"description":{% description %},
"tags":{% category %},
"price":{% price %},
"compareAtPrice":{% compare_at_price %},
"options":{% options %},
"vendor":{% brand %},
"productType":{% product_type %},
"requiresShipping":{% requires_shipping %},
"weight":{% weight %},
"weightUnit":{% weight_unit %},
"dallePrompt":{% dalle_prompt %}
},
{
"title":{% product_title %},
"description":{% description %},
"tags":{% category %},
"price":{% price %},
"compareAtPrice":{% compare_at_price %},
"options":{% options %},
"vendor":{% brand %},
"productType":{% product_type %},
"requiresShipping":{% requires_shipping %},
"weight":{% weight %},
"weightUnit":{% weight_unit %},
"dallePrompt":{% dalle_prompt %}
}
]
}
`;
  }

  

  if (parameters.requestType === 'partial') {
    prompt = `
Generate ${parameters.productCountNextRequest} products relating to ${parameters.category} that fall into the following sub-categories:${parameters.tags.join(', ')}.

Insert the following values into a JSON object, as per the example provided. Variables are denoted by the following: {% variable %}

{% categories %} (array) = Categories - An array of categories. Example: ["Shirts","Pants","Footwear"]{% product_title %} (string) = Product Title - Make some product titles humourous. Product titles must be 4 to 8 words long. Example: "Taquila Swirl Maxi Dress", "Cotton Blouse With Ruffles", "Knitted Vintage Casablanca Scarf"{% description %} (string) = Product Description - A product description between 30 and 50 words. Example: "Luxuriously crafted with a unique blend of wool and cashmere, this vintage Casablanca scarf is perfect for any occasion. With its stylish stripes and subtle sheen, this scarf will add a touch of sophistication to any outfit"{% category %} (array) = Product category - The category must be a string within an array. Example: [ "Shirts" ]{% price %} (integer) = Product price - The produce price in cents. Example: "2950"{% compare_at_price %} (integer) = Original product price when the product is on sale - If the product is on sale, make{% price %} the sale price. Example: "3800"{% options %} (array) = Product Options - If applicable to the product, create product options such as (but not limited to), colour, size, material. Options are not required on every product. Don't include an option if there is only one value for the option. The option values must be an array of values. Example: [ { "name":$"colour", "values":["sandstone","ocean blue","cosmos black","green"] }, { "name":"size", "values":["xs","s","m","l","xl"] } ]{% brand %} (string) = Product brand. Example: "Nike"{% product_type %} (string) = Product type - The products product type as per the Google Product Category list.{% requires_shipping %} (boolean) = States whether product requires shipping. Digital products, such as digital downloads or online courses, do not require shipping. Physical goods do require shipping. Example: true{% weight %} (integer) = Product weight - The total weight of the product. Example: 2600{% weight_unit %} (string) = The unit of measure for the product weight. Example: "g"{% dalle_prompt %} (string) = A prompt to generate a product image which will be displayed on an e-commerce store. Give a thorough descriptive prompt relating to the product. The image must be professionally photographed in a studio with a white background.The response must be a correctly formatted JSON object, with quotes around both keys and values, and commas where required. Example:

{
"categories":{% categories %},
"products":[
{
"title":{% product_title %},
"description":{% description %},
"tags":{% category %},
"price":{% price %},
"compareAtPrice":{% compare_at_price %},
"options":{% options %},
"vendor":{% brand %},
"productType":{% product_type %},
"requiresShipping":{% requires_shipping %},
"weight":{% weight %},
"weightUnit":{% weight_unit %},
"dallePrompt":{% dalle_prompt %}
},
{
"title":{% product_title %},
"description":{% description %},
"tags":{% category %},
"price":{% price %},
"compareAtPrice":{% compare_at_price %},
"options":{% options %},
"vendor":{% brand %},
"productType":{% product_type %},
"requiresShipping":{% requires_shipping %},
"weight":{% weight %},
"weightUnit":{% weight_unit %},
"dallePrompt":{% dalle_prompt %}
}
]
}
`;

console.log(prompt)
  }

  return prompt;
}