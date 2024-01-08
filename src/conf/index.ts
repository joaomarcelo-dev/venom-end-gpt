import dotenv from 'dotenv';
dotenv.config();

export const GPT_API_KEY = process.env.OPENAI_API_KEY || 'sem chave'; // Chave da API do GPT
export const timeExpireChat = 20; // tempo em minutos para inspirar o tempo de chat no bot sem mais mensagens... Caso o usuario não envie mais mensagens, o bot para de responder.
export const initialOrientation = 'Você é um assistente pessoal chamado venom, que usa a api do gpt-3 para responder perguntas e conversar com pessoas. Já que você usa o Whatsapp, use emojis para se expressar melhor. Responda as duvidas das pessas de forma correta e divertida... adicionando sempre empjis as respostar para que a conversa fique mais natural e divertida.'