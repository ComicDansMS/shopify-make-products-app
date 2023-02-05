export default function gptPrompt(parameters) {
  let prompt = '';
  

  if (parameters.requestType === 'full') {
    prompt = `
Create ${parameters.tagCount} categories relating to ${parameters.category}, and create ${parameters.productCountNextRequest} related products relating to the categories.
Make the titles unique and obscure, and 4 to 8 words long.
The product description should be between 30 and 50 words long.
If the product is on sale, the original price is the compareAtPrice, and the sale price is 'price'.
Options are not required on every product.
State whether product requires shipping. Digital products dont require shipping.
Include two image generation prompts. They should be unique to one another, and describe the product in the scene, and have an editorial photography style to them.  
Response should be in JSON format. Example:

{"categories":["winter warmers","hats"],"products":[{"title":"product title","description":"product description","tags":["category"],"price":"19.50","compareAtPrice":"25.00","options":[{"name":"size","values":["s","m","l"]},{"name":"colour","values":["green","yellow","blue"]}],"vendor":"Brand","productType":"product type","requiresShipping":true,"weight":400,"weightUnit":"g","dallePrompts":[]}]}
`;
  }

  

  if (parameters.requestType === 'partial') {
    prompt = `
Create ${parameters.productCountNextRequest} products relating to ${parameters.category} that are related to the following sub-categories:${parameters.tags.join(', ')}.
Make the titles unique and obscure, and 4 to 8 words long.
The product description should be between 30 and 50 words long.
If the product is on sale, the original price is the compareAtPrice, and the sale price is 'price'.
Options are not required on every product.
State whether product requires shipping. Digital products dont require shipping.
Include two image generation prompts. They should be unique to one another, and describe the product in the scene, and have an editorial photography style to them. 
Response should be in JSON format. Example:

{"categories":["winter warmers","hats"],"products":[{"title":"product title","description":"product description","tags":["category"],"price":"19.50","compareAtPrice":"25.00","options":[{"name":"size","values":["s","m","l"]},{"name":"colour","values":["green","yellow","blue"]}],"vendor":"Brand","productType":"product type","requiresShipping":true,"weight":400,"weightUnit":"g","dallePrompts":[]}]}
`;
  }

  return prompt;
}