import { Whatsapp, Message } from 'venom-bot';
import { sendMessageGPT } from '../utils/gpt.utils';
import { listOfCommands } from '../utils/commands.utils';
import { numberIncludesInMessagesTemp, objectMessagesTemp } from '../temp/messages.temp';
import { addMessageTemp, verifyCommand } from '../utils/messages.utils';
import { generateUnixTime } from '../utils/time.utils';
import { initialOrientationGPT3Turbo, timeExpireChat } from '../conf';
import { saveImgBase64 } from '../utils/base64.utils';



const appStart = (client: Whatsapp) => {
  client.onMessage(async (message: Message) => {    
    if (!verifyCommand(client, message)) {
      return;
    }

    gereMessages(client, message);
  });
}


const gereMessages = async (client: Whatsapp, message: Message) => {
  console.log(message);

  if (message.content) saveImgBase64(message.content,);
  
  
  if (message.body === listOfCommands.venom.command) {
    addMessageTemp({
      content: initialOrientationGPT3Turbo,
      from: message.from,
      model: listOfCommands.venom.model,
      role: 'user',
    })

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

    console.log(objectMessagesTemp);
    
    await client.startTyping(message.from, false);
    return await client.sendText(message.from, messageResponse); 
  }
};

export default appStart;
