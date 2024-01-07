import { MessageHistory } from "../types/GPT.types";

export const objectMessagesTemp: MessageHistory = {} // Objeto que armazena as mensagens temporárias para uso do GPT
export const numberIncludesInMessagesTemp = (number: string) => Object.keys(objectMessagesTemp).includes(number); // Verifica se o número está ativo no objeto de mensagens temporárias
