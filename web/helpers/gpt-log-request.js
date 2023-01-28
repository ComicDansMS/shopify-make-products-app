export default function gptLogRequest(parameters) {

  if (parameters.requestType == 'full') {
    console.log(`== Sending full request ==
  Category: ${parameters.category}
  Tag count: ${parameters.tagCount}
  Product count: ${parameters.productCount}
  Max tokens: ${parameters.tokens}`);
  }

  if (parameters.requestType == 'partial') {
    console.log(`== Sending partial request ==
  Category: ${parameters.category}
  Tags: ${parameters.tags.join(', ')}
  Product count: ${parameters.productCount}
  Max tokens: ${parameters.tokens}`);
  }
  
}