import { ActionParmsType } from './../../types/Commands.types';
import { CommandType } from "../../types/Commands.types";
import { addMessageTemp } from '../../utils/messages.utils';
import fsUtils from '../../utils/fs.utills';
import { editImageGPT } from '../../utils/gpt.utils';

export default {
  command: "!edit",
  description: "Edita uma imagem com base em uma descrição",
  initialAction: async ({ client, message }: ActionParmsType) => {
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

    await client.sendText(message.from, 'Envie a imagem que deseja editar e a descrição da edição que deseja fazer');
  },
  action: async ({client, message}: ActionParmsType) => {
    if (!message.caption) return await client.sendText(message.from, 'Envie a descrição da edição que deseja fazer');
    
    const pathFileSaved = await fsUtils.saveMidiaReceived({ client, message });

    console.log('pathFileSaved', pathFileSaved);

    if (!pathFileSaved) return await client.sendText(message.from, 'Erro ao salvar a imagem');

    try {
      await client.sendText(message.from, 'Editando a imagem! 🖼️⏳')
      const { data } = await editImageGPT(message.caption, pathFileSaved);

      const imageUrl = data[0].url;

      if (!imageUrl) return await client.sendText(message.from, 'Desculpe! Não consegui gerar a imagem... por favor tente novamente!');

      await client.sendText(message.from, 'Preparando a imagem! 🖼️⏳')
      const pathToFile = await fsUtils.downloadFileByLink(imageUrl);
      const imageBase64 = await fsUtils.imageToBase64(pathToFile);

      await client.sendImageFromBase64(message.from, imageBase64, 'image.png', 'Resultado... 🖼️🎉');

    } catch (error) {
      console.log('error', error);
      await client.sendText(message.from, 'Erro ao editar a imagem'); 
    }

    
  },
} as CommandType;