import { OpenAI } from 'openai';
import { GPT_API_KEY } from '../conf';

const openai = new OpenAI({
  apiKey: GPT_API_KEY,
});

export default openai;
