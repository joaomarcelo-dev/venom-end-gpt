import { objectMessagesTemp } from '../../temp/messages.temp';
import { ActionParmsType } from '../../types/Commands.types';
import { sendMessageGPT } from '../../utils/gpt.utils';
import { addMessageTemp } from '../../utils/messages.utils';


export default {
  command: "!venom",
  description: "Inicia a conversa com o assistente virtual",
  details: "Este comando inicia a conversa com o assistente virtual Venom. Vc pode digitar qualquer coisa para iniciar a conversa.",
  model: 'gpt-3.5-turbo',
  action: async ({ message, client }: ActionParmsType) => {
    addMessageTemp({
      content: message.body,
      from: message.from,
      model: 'gpt-3.5-turbo',
      role: 'user',
      author: message.author,
      command: message.body,
      isGroupMsg: message.isGroupMsg,
      nameUser: message.sender.pushname,
    });

    await client.startTyping(message.from, true);

    const { choices } = await sendMessageGPT(objectMessagesTemp[message.from].messages, 'gpt-3.5-turbo')

    choices.forEach(async (choice) => {
      const textResponse = choice.message.content || 'Não entendi, pode repetir?';

      await client.sendText(message.from, textResponse);

      addMessageTemp({
        content: textResponse,
        from: message.from,
        model: 'gpt-3.5-turbo',
        role: 'assistant',
      });
    });

    await client.startTyping(message.from, false);
  }
};