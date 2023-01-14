
import { Configuration, OpenAIApi } from "openai";
import gptPrompt from "./gpt-prompt.js";
import gptLogRequest from "./gpt-log-request.js";
import gptLogResponse from "./gpt-log-response.js";

export default async function gptProductRequest(category, productCount, tagCount) {
  const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
  const openai = new OpenAIApi(configuration);
  const promptTokens = 360;
  const tokensPerProduct = 150;
  const tokens = promptTokens + (productCount * tokensPerProduct);

  return new Promise((resolve, reject) => {
    gptLogRequest(category, tagCount, productCount, tokens);

    openai.createCompletion({
      model: 'text-davinci-003',
      prompt: gptPrompt(tagCount, category, productCount),
      temperature: 0.8,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 2,
      max_tokens: tokens,
    })
      .then(response => {
        gptLogResponse(response, productCount)
        resolve(response.data.choices[0].text);
      })
      .catch(error => {
        console.log(error);
        reject(error);
      })
  })  
}