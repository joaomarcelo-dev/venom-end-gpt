import { OpenAI } from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.OPENAI_API_KEY || "sem chave";

console.log(apiKey);
const openai = new OpenAI({
  apiKey,
});

export default openai;
