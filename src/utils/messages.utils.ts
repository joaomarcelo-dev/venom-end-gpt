import { Message, Whatsapp } from "venom-bot";
import { listOfCommands } from "./commands.utils";
import { objectMessagesTemp } from "../temp/messages.temp";
import dayjs from "dayjs";

export const verifyCommand = async (client: Whatsapp, message: Message) => {
  const characters = message.body.split('');
  if (characters[0] === '!') {
    const command = Object.values(listOfCommands).find((command) => {
      if (command.command === message.body) {
        return command.command;
      }
    });
    
    if (!command) {
      await client.sendText(
        message.from,
        `🚨 O comando que você digitou está incorreto. Comandos disponíveis:\n\n\n${Object.values(listOfCommands).map((command, index) => {
          return `${index + 1}: ${command.command} - ${command.description}\n\n`;
        }).join('')}`
      );

      return false;
    }
  }

  return true;
};


export const deleteMessagesExpired = (client: Whatsapp) => {
  const users = Object.keys(objectMessagesTemp).filter((user) => {
    const messagesUser = objectMessagesTemp[user];

    const expired = dayjs().isAfter(dayjs.unix(messagesUser[messagesUser.length - 1].expireIn));

    if (expired) {
      return user;
    }
  });
  
  users.forEach((user) => {
    delete objectMessagesTemp[user];
    client.sendText(user, 'Devido ao seu longo tempo de inatividade, as mensagens foram deletadas. Para iniciar novamente digite !venom');
  });
}