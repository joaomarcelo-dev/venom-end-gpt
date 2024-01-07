import { create, Whatsapp } from 'venom-bot';
import { MessageType } from './types/GPT.types';
import { sendMessageGPT } from './utils/messagens.gpt';



create({
  session: 'venom-end-gpt',

})
.then((client) => start(client))
.catch((error) => {
  console.log(error);
});

let messages: MessageType = [];
let numberStart = '';
let activeGPT = false;

const listOfCommands = {
  venom: {
    command: '!venom',
    description: 'Inicia o venom',
  },
  stop: {
    command: '!stop',
    description: 'Para o venom',
  },
};

const verifyCommand = (message: string) => {
  const characters = message.split('');
  if (characters[0] === '!') {
    const command = Object.values(listOfCommands).find((command) => {
      if (command.command === message) {
        return command.command;
      }
    });
    
    return command;
  }

  return true;
};


function start(client: Whatsapp) {
  client.onMessage(async (message) => {    
    if (!verifyCommand(message.body)) {
      return await client.sendText(
        message.from,
        `O comando que você digitou está incorreto. Comandos disponiveis: 
        ${Object.values(listOfCommands).map((command) => {
          return `${command.command} - ${command.description}`;
        })}
        `
      );
    };
    
    if (message.body === listOfCommands.venom.command && !activeGPT) {
      activeGPT = true;
      numberStart = message.from;

      messages.push({
        content: message.body,
        role: 'user',
      });

      return await client.sendText(message.from, 'Olá, eu sou o vemon, em que posso ajudar?');
    } else if (message.body === "!venom" && message.from !== numberStart) {
      return await client.sendText(message.from, 'Desculpe, estou ocupado com outro usuário.');
    }

    if (message.body === listOfCommands.stop.command && message.from === numberStart) {
      activeGPT = false;
      numberStart = '';
      messages = [{ content: '', role: 'user' }];

      await client.sendText(
        message.from,
        'Muito obrigado por utilizar o venom, até a próxima!'
      );
    }

    if (activeGPT && message.from === numberStart) {
      messages.push({
        content: message.body,
        role: 'user',
      });

      const responseGPT = await sendMessageGPT(messages);

      if (responseGPT.choices[0].message.content === null) {
        return await client.sendText(message.from, 'Não entendi, pode repetir?');
      }

      messages.push({
        content: responseGPT.choices[0].message.content,
        role: 'assistant',
      });

      return await client.sendText(message.from, responseGPT.choices[0].message.content);
    }

  });
}
