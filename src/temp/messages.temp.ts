import { MessageHistory } from "../types/GPT.types";

export const objectMessagesTemp: MessageHistory = {} // Objeto que armazena as mensagens temporárias para uso do GPT

type VerifycationsType = {
  from: string,
  author?: string,
}

export const numberIncludesInMessagesTemp = ({ from, author }: VerifycationsType) => {
  const verifyFromMsg = Object.keys(objectMessagesTemp).includes(from); 
  const verifyAuthorMsg = Object.values(objectMessagesTemp).find((message) => message.author === author);

  return verifyFromMsg && verifyAuthorMsg;
} // Verifica se o número está ativo no objeto de mensagens temporárias


export const verifyVenomPaused = ({ from }: VerifycationsType) => objectMessagesTemp[from].paused;// Verifica se o venom está pausado