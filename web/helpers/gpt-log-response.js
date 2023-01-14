export default function gptLogResponse(completion, productCount) {
  console.log(`
== RESPONSE RECEIVED ==
PROMPT TOKENS: ${completion.data.usage.prompt_tokens}
COMPLETION TOKENS: ${completion.data.usage.completion_tokens}
TOTAL TOKENS: ${completion.data.usage.total_tokens}
TOKENS PER PRODUCT: ${(completion.data.usage.total_tokens - completion.data.usage.prompt_tokens) / productCount}
`);
}