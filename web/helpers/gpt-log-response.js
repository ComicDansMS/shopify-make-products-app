export default function gptLogResponse(completion, reqProductCount) {
  try {
    const responseJson = JSON.parse(completion.data.choices[0].text);
    const totalProducts = responseJson.products.length;

    console.log(`
== RESPONSE RECEIVED ==
PROMPT TOKENS: ${completion.data.usage.prompt_tokens}
COMPLETION TOKENS: ${completion.data.usage.completion_tokens}
TOTAL TOKENS: ${completion.data.usage.total_tokens}
TOKENS PER PRODUCT: ${(completion.data.usage.total_tokens - completion.data.usage.prompt_tokens) / reqProductCount}
TOTAL PRODUCTS: ${totalProducts}
    `);
  } catch {
    console.log('== Error while logging response. Response: ==')
    console.log(`== COMPLETION.DATA: ${completion.data}`)
  }  
}