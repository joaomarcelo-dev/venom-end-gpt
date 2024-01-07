import openai from "../providers/gpt.provider";
import { MessageType } from '../types/GPT.types';



export const sendMessageGPT = async (messages: MessageType) => {
  const response = openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages,
  });

  return response;
};