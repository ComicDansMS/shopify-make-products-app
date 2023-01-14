export default function gptLogRequest(category, tagCount, productCount, tokens) {
  console.log(`
== SENDING OPENAI REQUEST ==
CATEGORY: ${category}
TAGS: ${tagCount}
PRODUCTS: ${productCount}
TOKENS: ${tokens}`
);
}