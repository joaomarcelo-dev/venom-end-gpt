import { objectMessagesTemp } from "../../temp/messages.temp";
import { ActionParmsType, CommandType } from "../../types/Commands.types";

export default {
  command: "!stop",
  description: "Para a conversa com o bot.",
  action: async ({ client, message }: ActionParmsType) => {
    delete objectMessagesTemp[message.from];

    await client.sendText(
      message.from,
      'Dados de mensagens temporárias deletados! Obriagado por usar o Venom🕸️ e até a proxima ☺️',
    );
  }
} as CommandType;