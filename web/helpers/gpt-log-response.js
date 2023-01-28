export default function gptLogResponse(completion) {
  try {
    const responseJson = JSON.parse(completion.data.choices[0].text);
    const totalProducts = responseJson.products.length;
    const costPerToken = 0.02 / 1000;

    console.log(`
== RESPONSE RECEIVED ==
RETURNED PRODUCTS: ${totalProducts}
COMPLETION TOKENS: ${completion.data.usage.completion_tokens}
TOTAL TOKENS: ${completion.data.usage.total_tokens}
TOKENS PER PRODUCT: ${(completion.data.usage.total_tokens - completion.data.usage.prompt_tokens) / totalProducts}
TOTAL COST: \$${completion.data.usage.total_tokens * costPerToken}
`);
  } catch {
    console.log('== Error while logging response. Response: ==')
    console.log(`== COMPLETION.DATA: ${completion.data}`)
  }  
}