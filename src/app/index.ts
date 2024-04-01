import { Whatsapp, Message } from 'venom-bot';
import { addMessageTemp, verifyCommand } from '../utils/messages.utils';
import path from 'node:path';
import fs from 'node:fs';
import { numberIncludesInMessagesTemp, objectMessagesTemp } from '../temp/messages.temp';

const appStart = (client: Whatsapp) => {
  client.onMessage(async (message: Message) => {    
    generateMessages(client, message);
  });
}


const generateMessages = async (client: Whatsapp, message: Message) => {
  const commandsPath = path.resolve(__dirname, 'commands');
  const commands = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.ts'));

  console.log(commands);
  

  for (const command of commands) {
    const { default: commandPlay } = await import(`./commands/${command}`);
    
    console.log(commandPlay.command, message.body);
    

    if (commandPlay.command === message.body) {
      addMessageTemp({
        content: message.body,
        from: message.from,
        model: commandPlay.model,
        role: 'user',
        author: message.author,
        command: message.body,
        isGroupMsg: message.isGroupMsg,
        nameUser: message.sender.pushname,
      });

      await client.sendText(message.from, `O comando ${message.body} foi executado com sucesso!\n\n${commandPlay.details || ''}`);
    }
  }

  if (numberIncludesInMessagesTemp({ from: message.from })) {
    const command = objectMessagesTemp[message.from].command?.replace('!', '');

    const { default: commandPlay } = await import(`./commands/${command}.ts`);
    return commandPlay.action({ message, client });
  }
}

// const gereMessages = async (client: Whatsapp, message: Message) => {
//   const commandPlay = Object.values(listOfCommands).find(({ command }) => command === message.body);

//   if (commandPlay) return commandPlay?.action({ message, client });

//   if (
//     numberIncludesInMessagesTemp({ from: message.from, author: message.author })
//     && !verifyVenomPaused({ from: message.from })
//   ) {
//     addMessageTemp({
//       content: message.body,
//       from: message.from,
//       model: objectMessagesTemp[message.from].model,
//       role: 'user',
//     })

//     await client.startTyping(message.from, true);
    
//     const responseGPT = await sendMessageGPT(
//       objectMessagesTemp[message.from].messages, 
//       objectMessagesTemp[message.from].model
//     );

//     const messageResponse = responseGPT.choices[0].message.content;
    
//     if (messageResponse === null) {
//       return await client.sendText(message.from, 'Não entendi, pode repetir?');
//     }
    
//     addMessageTemp({
//       from: message.from,
//       content: messageResponse,
//       model: objectMessagesTemp[message.from].model,
//       role: 'assistant'
//     })

//     const { isGroupMsg, messages } = objectMessagesTemp[message.from]; 
    
//     await client.startTyping(message.from, false);

//     if (isGroupMsg) {
//       return await client.reply(
//         message.from,
//         `${messageResponse}${messages.length <=4 ? `\n\nPara pausar o venom e conversar livremente use o comando !pause para parar e !return para voltar de onde paramos. 😅`: ''}`,
//         message.id, 
//       ); 
//     }

//     return await client.sendText(message.from, messageResponse);
//   }
// };

export default appStart;
