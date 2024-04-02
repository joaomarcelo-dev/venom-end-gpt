import { Whatsapp, Message } from 'venom-bot';
import { numberIncludesInMessagesTemp, objectMessagesTemp } from '../temp/messages.temp';
import path from 'node:path';
import fs from 'node:fs';

const appStart = (client: Whatsapp) => {
  client.onMessage(async (message: Message) => {    
    generateMessages(client, message);
  });
}


const generateMessages = async (client: Whatsapp, message: Message) => {

  const commandsPath = path.resolve(__dirname, 'commands');
  const commands = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.ts'));

  if (numberIncludesInMessagesTemp({ from: message.from })) {
    const command = objectMessagesTemp[message.from].command?.replace('!', '');

    const { default: commandPlay } = await import(`./commands/${command}.ts`);
    return commandPlay.action({ message, client });
  }

  for (const command of commands) {
    const { default: commandPlay } = await import(`./commands/${command}`);

    if (commandPlay.command === message.body) {
      await commandPlay.initialAction({ client, message })
    }
  }
}

export default appStart;
