import { Configuration, OpenAIApi } from "openai";
import gptLogResponse from "./gpt-log-response.js";
import gptLogRequest from "./gpt-log-request.js";

export default function gptRequest(reqArgs, prompt) {
  let { reqCategory, reqTagCount, reqProductCount } = reqArgs;
  const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
  const openai = new OpenAIApi(configuration);
  const promptTokens = 360;
  const tokensPerProduct = 150;
  const tokens = promptTokens + (reqProductCount * tokensPerProduct);

  if (reqArgs.partialProductCount) {
    reqProductCount = reqArgs.partialProductCount;
  }

  return new Promise((resolve, reject) => {
    gptLogRequest(reqCategory, reqTagCount, reqProductCount, tokens);

    if (tokens >= 4000) {
      console.log(`== Tokens exceeed limit of 4000. Estimated max tokens for current request: ${tokens} ==`)
      reject(`Tokens exceeed limit of 4000. Estimated max tokens for current request: ${tokens}`)
    }

    openai.createCompletion({
      model: 'text-davinci-003',
      prompt: prompt,
      temperature: 0.8,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 2,
      max_tokens: tokens,
    })
    .then(response => {
      gptLogResponse(response, reqProductCount);
      resolve(response.data.choices[0].text);
    })
    .catch(error => {
      reject(error)
    });
  })
}