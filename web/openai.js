import dotenv from "dotenv";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

export default async function openApiRequest() {
  const configuration = new Configuration({
    organization: process.env.OPENAI_ORGANIZATION_ID,
    apiKey: process.env.OPENAI_API_KEY
  })
  
  const openai = new OpenAIApi(configuration);
  const response = await openai.listEngines();

  return response;
}