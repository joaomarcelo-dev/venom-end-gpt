import { Whatsapp, Message } from 'venom-bot';
import { numberIncludesInMessagesTemp, objectMessagesTemp } from '../temp/messages.temp';
import path from 'node:path';
import fs from 'node:fs';
import { CommandType } from '../types/Commands.types';

const appStart = (client: Whatsapp) => {
  client.onMessage(async (message: Message) => {    
    generateMessages(client, message);
  });
}


const generateMessages = async (client: Whatsapp, message: Message) => {
  const isMessageOfCommand = message.body.startsWith('!');
  
  if (numberIncludesInMessagesTemp({ from: message.from })) {
    const command = objectMessagesTemp[message.from].command?.replace('!', '');
    
    const { default: commandPlay } = await import(`./commands/${command}.ts`);
    return commandPlay.action({ message, client });
  }

  const commandsPath = path.resolve(__dirname, 'commands');
  const commands = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.ts'));
  

  for (const command of commands) {
    const { default: commandPlay }: {default: CommandType} = await import(`./commands/${command}`);

    if (commandPlay.command === message.body) {
      await commandPlay.initialAction({ client, message }) 
    }
  }
}

export default appStart;
