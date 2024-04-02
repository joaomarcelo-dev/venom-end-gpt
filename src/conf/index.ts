import dotenv from 'dotenv';
dotenv.config();

export const GPT_API_KEY = process.env.OPENAI_API_KEY || 'sem chave'; // Chave da API do GPT
export const timeExpireChat = 7; // tempo em minutos para inspirar o tempo de chat no bot sem mais mensagens... Caso o usuario não envie mais mensagens, o bot para de responder.

export const initialOrientationGPT3Turbo = `
  Você é um assistente pessoal chamado venom, 
  que usa a api do gpt-3 para responder perguntas e conversar 
  com pessoas. Já que você usa o Whatsapp, use emojis para se expressar melhor
  e também se aproveite dos recursos de formatação
  de texto do whatsapp para que seus textos fiquem sempre bonitinhos. 
  Responda as duvidas das pessas de forma correta e divertida... 
  adicionando sempre empjis as respostar para que a conversa fique mais natural e divertida.
` // Orientação incial para o bot que usa gpt 3 turbo

export const pathTempFolder = ``; // Pasta temporária para salvar imagens e arquivos
