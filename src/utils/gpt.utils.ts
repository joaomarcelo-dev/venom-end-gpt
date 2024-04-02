import { Uploadable, isUploadable, toFile } from "openai/uploads";
import openai from "../providers/gpt.provider";
import { MessageType } from '../types/GPT.types';
import fs from 'fs';

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
    quality: 'standard',
    model: 'dall-e-3',
    // size: '512x512',
  });

  return imageUrl;  
}

export const editImageGPT = async (prompt: string, imagePath: string) => {
  const imageContent = fs.readFileSync(imagePath);

  let uploadableImage: Uploadable;

  if (isUploadable(imageContent)) {
    uploadableImage = imageContent;
  } else {
    uploadableImage = await toFile(imageContent);
  }

  const imageUrl = await openai.images.edit({
    image: uploadableImage,
    prompt,
    // model: 'dall-e-3',
  });

  return imageUrl;
};

export const verifyExpirationSession = (message: MessageType[]) => {};
