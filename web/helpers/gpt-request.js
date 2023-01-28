import { Configuration, OpenAIApi } from "openai";
import gptLogResponse from "./gpt-log-response.js";
import gptLogRequest from "./gpt-log-request.js";

export default function gptRequest(parameters) {
  const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
  const openai = new OpenAIApi(configuration);

  return new Promise((resolve, reject) => {
    gptLogRequest(parameters);

    if (parameters.tokens >= 4000) {
      console.log(`== Tokens exceeed limit of 4000. Estimated max tokens for current request: ${parameters.tokens} ==`)
      reject(`Tokens exceeed limit of 4000. Estimated max tokens for current request: ${parameters.tokens}`)
    }

    openai.createCompletion({
      model: 'text-davinci-003',
      prompt: parameters.prompt,
      temperature: 0.8,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 2,
      max_tokens: parameters.tokens,
    })
    .then(response => {
      gptLogResponse(response);
      resolve(response.data.choices[0].text);
    })
    .catch(error => {
      reject(error)
    });
  })
}