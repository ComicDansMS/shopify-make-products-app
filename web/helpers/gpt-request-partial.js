import { Configuration, OpenAIApi } from "openai";
import gptLogResponse from "./gpt-log-response.js";
import gptLogRequest from "./gpt-log-request.js";

export default function gptRequestPartial(reqArgs) {
  const { productCount, prompt } = reqArgs;
  const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
  const openai = new OpenAIApi(configuration);
  const promptTokens = 360;
  const tokensPerProduct = 150;
  const tokens = promptTokens + (productCount * tokensPerProduct);

  return new Promise((resolve, reject) => {
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
      resolve(response.data.choices[0].text);
    })
    .catch(error => {
      reject(error)
    });
  })
}