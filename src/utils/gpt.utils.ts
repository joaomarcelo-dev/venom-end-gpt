import openai from "../providers/gpt.provider";
import { MessageType } from '../types/GPT.types';

export const sendMessageGPT = async (messages: MessageType[]) => {
  const messagesFormatted = messages.map((message) => {
    return {
      role: message.role,
      content: message.content,
    }
  });

  const response = openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: messagesFormatted,
  });

  return response;
};

export const verifyExpirationSession = (message: MessageType[]) => {};