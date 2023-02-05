import { Configuration, OpenAIApi } from "openai";
import fs from 'fs';

export default async function gptGenerateImage(prompt, delay) {
  const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
  const openai = new OpenAIApi(configuration);

  return new Promise((resolve, reject) => {

    try {
      openai.createImageEdit(
        fs.createReadStream("./helpers/dalle-image.png"),
        fs.createReadStream("./helpers/dalle-mask.png"),
        prompt,
        1,
        "256x256"
      )
      .then(response => {
        console.log('== Image Gen Response ==')
        console.log(response.data)
        if (response.data.error) {
          resolve(response.data.error)
        }
        resolve(response.data.data[0].url)
      })
      .catch(error => {
        console.log('== Error ==')
        console.log(error)
        reject(error)
      })
    } catch (error) {
      console.log('== Image Gen Response Error ==')
      console.log(error)
      reject(error)
    }
    }, delay);
}