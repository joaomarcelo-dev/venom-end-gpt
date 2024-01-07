import { Message, Whatsapp } from "venom-bot";
import { listOfCommands } from "./commands.utils";

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