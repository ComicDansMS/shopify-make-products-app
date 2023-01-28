export default function gptLogResponse(completion) {
  try {
    const responseJson = JSON.parse(completion.data.choices[0].text);
    const totalProducts = responseJson.products.length;
    const tokenPrice = 0.02 / 1000;

    const completionTokens = completion.data.usage.completion_tokens;
    const totalTokens = completion.data.usage.total_tokens;
    const tokensPerProduct = (completion.data.usage.total_tokens - completion.data.usage.prompt_tokens) / totalProducts;
    const totalPrice = (totalTokens * tokenPrice).toFixed(4);

    console.log(`== Response received ==
  Returned products: ${totalProducts}
  Completion tokens: ${completionTokens}
  Total tokens: ${totalTokens}
  Tokens per product: ${tokensPerProduct}
  Total cost: \$${totalPrice}`);
  } catch {
    console.log(`== Response received ==
  Bad response - Unable to process data.`);
  }  
}