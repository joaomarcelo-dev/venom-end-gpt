import { Whatsapp, Message } from 'venom-bot';
import { sendMessageGPT } from '../utils/gpt.utils';
import { listOfCommands } from '../utils/commands.utils';
import { numberIncludesInMessagesTemp, objectMessagesTemp, verifyVenomPaused } from '../temp/messages.temp';
import { addMessageTemp, verifyCommand } from '../utils/messages.utils';

const appStart = (client: Whatsapp) => {
  client.onMessage(async (message: Message) => {    
    if (!verifyCommand(client, message)) {
      return;
    }

    gereMessages(client, message);
  });
}


const gereMessages = async (client: Whatsapp, message: Message) => {
  const commandPlay = Object.values(listOfCommands).find(({ command }) => command === message.body);

  if (commandPlay) return commandPlay?.action({ message, client });

  if (
    numberIncludesInMessagesTemp({ from: message.from, author: message.author })
    && !verifyVenomPaused({ from: message.from })
  ) {
    addMessageTemp({
      content: message.body,
      from: message.from,
      model: objectMessagesTemp[message.from].model,
      role: 'user',
    })

    await client.startTyping(message.from, true);
    
    const responseGPT = await sendMessageGPT(
      objectMessagesTemp[message.from].messages, 
      objectMessagesTemp[message.from].model
    );

    const messageResponse = responseGPT.choices[0].message.content;
    
    if (messageResponse === null) {
      return await client.sendText(message.from, 'Não entendi, pode repetir?');
    }
    
    addMessageTemp({
      from: message.from,
      content: messageResponse,
      model: objectMessagesTemp[message.from].model,
      role: 'assistant'
    })

    const { isGroupMsg, messages } = objectMessagesTemp[message.from]; 
    
    await client.startTyping(message.from, false);

    if (isGroupMsg) {
      return await client.reply(
        message.from,
        `${messageResponse}${messages.length <=4 ? `\n\nPara pausar o venom e conversar livremente use o comando !pause para parar e !return para voltar de onde paramos. 😅`: ''}`,
        message.id, 
      ); 
    }

    return await client.sendText(message.from, messageResponse);
  }
};

export default appStart;
