import { Whatsapp, Message } from 'venom-bot';
import { sendMessageGPT } from '../utils/gpt.utils';
import { listOfCommands } from '../utils/commands.utils';
import { numberIncludesInMessagesTemp, objectMessagesTemp } from '../temp/messages.temp';
import { verifyCommand } from '../utils/messages.utils';
import { generateUnixTime } from '../utils/time.utils';
import { initialOrientation, timeExpireChat } from '../conf';



const appStart = (client: Whatsapp) => {
  client.onMessage(async (message: Message) => {    
    if (!verifyCommand(client, message)) {
      return;
    }

    gereMessages(client, message);
  });
}


const gereMessages = async (client: Whatsapp, message: Message) => {
  if (message.body === listOfCommands.venom.command) {
    objectMessagesTemp[message.from] = [{
      content: initialOrientation,
      role: 'user',
      expireIn: generateUnixTime(timeExpireChat),
    }];

    return await client.sendText(message.from, 'Olá, eu sou o Venom🕸️, em que posso ajudar?');
  }

  if (message.body === listOfCommands.stop.command && numberIncludesInMessagesTemp(message.from)) {
    delete objectMessagesTemp[message.from];

    await client.sendText(
      message.from,
      'Dados de mensagens temporárias deletados! Obriagado por usar o Venom🕸️ e até a proxima ☺️',
    );
  }

  if (numberIncludesInMessagesTemp(message.from)) {
    objectMessagesTemp[message.from].push({
      content: message.body,
      role: 'user',
      expireIn: generateUnixTime(timeExpireChat)
    });

    await client.startTyping(message.from, true);
  
    const responseGPT = await sendMessageGPT(objectMessagesTemp[message.from]);

    if (responseGPT.choices[0].message.content === null) {
      return await client.sendText(message.from, 'Não entendi, pode repetir?');
    }
    
    objectMessagesTemp[message.from].push({
      content: responseGPT.choices[0].message.content,
      role: 'assistant',
      expireIn: generateUnixTime(timeExpireChat),
    });
    
    await client.startTyping(message.from, false);
    return await client.sendText(message.from, responseGPT.choices[0].message.content); 
  }
};

export default appStart;
