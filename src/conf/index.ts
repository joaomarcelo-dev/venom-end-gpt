import dotenv from 'dotenv';
dotenv.config();

export const GPT_API_KEY = process.env.OPENAI_API_KEY || 'sem chave';

export const timeExpireChat = (1000 * 60) * 20; // 20 minutos para inspirar o tempo de chat no bot sem mais mensagens... Caso o usuario não envie mais mensagens, o bot para de responder.
