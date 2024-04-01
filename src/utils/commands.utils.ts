import { initialOrientationGPT3Turbo } from '../conf';
import { TypeCommands } from '../types/Commands.types';
import { addMessageTemp } from './messages.utils';
import { numberIncludesInMessagesTemp, objectMessagesTemp } from '../temp/messages.temp';

export const listOfCommands: TypeCommands = {
  venom: {
    command: '!venom',
    description: 'Inicia o venom 🕷️',
    configurationInitial: initialOrientationGPT3Turbo,
    model: 'gpt-3.5-turbo',
    action: async ({ message, client }) => {
      if (!numberIncludesInMessagesTemp({ from: message.from, author: message.author })) {
        addMessageTemp({
          content: initialOrientationGPT3Turbo,
          from: message.from,
          model: listOfCommands.venom.model,
          role: 'user',
          author: message.author,
          nameUser: message.sender.name,
          isGroupMsg: message.isGroupMsg,
        })
    
        return await client.sendText(message.from, 'Olá, eu sou o Venom🕸️, em que posso ajudar?');
      }

      return await client.sendText(message.from, 'O venom já está ativo 🕷️');
    }
  },

  stop: {
    command: '!stop',
    description: 'Para o venom 🛑🕷️',
    configurationInitial: '',
    model: '',
    action: async ({ message, client }) => {
      delete objectMessagesTemp[message.from];

      await client.sendText(
        message.from,
        'Dados de mensagens temporárias deletados! Obriagado por usar o Venom🕸️ e até a proxima ☺️',
      );
    }
  },

  clear: {
    command: '!clear',
    description: 'Limpa Todas as mensagens trocas com o bot 🧹',
    configurationInitial: '',
    model: '',
    action: async ({ message, client }) => {
      console.log(message);
      
      await client.sendText(message.from, "Limpando todas as mensagens... 🧹");
      await client.clearChatMessages(message.from);
    }
  },

  pause: {
    command: '!pause',
    description: 'Pausa o venom (Apenas para grupos) 🕷️',
    configurationInitial: '',
    model: '',
    action: async ({ message, client }) => {
      if (!numberIncludesInMessagesTemp({ from: message.from, author: message.author })) {
        return await client.sendText(message.from, 'O venom não está ativo 🕷️');
      }

      objectMessagesTemp[message.from].paused = true;

      await client.sendText(message.from, 'Venom pausado 🕷️');
    }
  },

  return: {
    command: '!return',
    description: 'Retorna o venom depois da pausa (Apenas para grupos) 🕷️',
    configurationInitial: '',
    model: '',
    action: async ({ message, client }) => {
      if (!numberIncludesInMessagesTemp({ from: message.from, author: message.author })) {
        return await client.sendText(message.from, 'O venom não está ativo 🕷️');
      }
      
      objectMessagesTemp[message.from].paused = false;

      await client.sendText(message.from, 'Venom retornado 🕷️');
    }
  },
};
