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

export const verifyExpirationSession = (message: MessageType[]) => {};