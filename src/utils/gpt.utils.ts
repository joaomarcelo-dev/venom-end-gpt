import openai from "../providers/gpt.provider";
import { MessageType } from '../types/GPT.types';

export const sendMessageGPT = async (messages: MessageType[], model: string) => {
  const messagesFormatted = messages.map((message) => {
    return {
      role: message.role,
      content: message.content,
    }
  });

  const response = openai.chat.completions.create({
    model,
    messages: messagesFormatted,
  });

  return response;
};

export const generateImageGPT = async (prompt: string) => {
  const imageUrl = await openai.images.generate({
    prompt,
    model: 'dall-e-2',
    size: '512x512',
  });

  return imageUrl;  
}

export const verifyExpirationSession = (message: MessageType[]) => {};