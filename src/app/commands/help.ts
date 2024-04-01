import { ActionParmsType } from "../../types/Commands.types";
import path from 'node:path';
import fs from 'node:fs';

export default {
  command: "!help",
  description: "Mostra todos os comandos disponíveis",
  action: async ({ client, message }: ActionParmsType) => {
    const commandsPath = path.resolve(__dirname);
    const commands = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.ts'));

    const commandsList = commands.map((command) => {
      const { default: commandPlay } = require(`./${command}`);
      return `${commandPlay.command} - ${commandPlay.description}`;
    });

    await client.startTyping(message.from, true);

    await client.sendText(
      message.from,
      `🚨 Comandos disponíveis:\n\n\n${commandsList.join('\n')}`
    );

    await client.startTyping(message.from, false);
  }
}