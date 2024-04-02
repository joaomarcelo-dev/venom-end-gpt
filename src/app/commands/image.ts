import { ActionParmsType, CommandType } from "../../types/Commands.types";
import fsUtils from "../../utils/fs.utills";
import { generateImageGPT } from "../../utils/gpt.utils";
import { addMessageTemp } from "../../utils/messages.utils";

export default {
  command: "!image",
  description: "Gera imagens com base na descrição feita por mensagem",
  details: "Digite todos os detalhes da imagem para que possam ser processados e gerados",
  model: 'gpt-3.5-turbo',
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
    await client.sendText(message.from, 'Agora me mande a descrição da imagem que deseja e farei o melhor para cumprir com suas expectativas! 😅😊')
  },
  action: async ({ client, message }: ActionParmsType) => {

    if (message.body.length < 25) return await client.sendText(message.from, `Poderia detalhar um pouco mais o tipo de imagm que deseja? \n\n o minimo de caracteres é 25 \n Vc mandou ${message.body.length} caracteres`)

    addMessageTemp({
      content: message.body,
      from: message.from,
      model: 'dall-e-3',
      role: 'user',
      author: message.author,
      command: message.body,
      isGroupMsg: message.isGroupMsg,
      nameUser: message.sender.pushname,
    });

    await client.sendText(message.from, 'Aguarde... ⏳')
    const { data } = await generateImageGPT(message.body);

    // URL da imagem para exemplo
    const imageUrl = data[0]?.url; 
    
    if (!imageUrl) return await client.sendText(message.from, 'Desculpe! Não consegui gerar a imagem... por favor tente novamente!')


    await client.sendText(message.from, 'Preparando a imagem! 🖼️⏳')
    const pathToFile = await fsUtils.downloadFileByLink(imageUrl);
    const imageBase64 = await fsUtils.imageToBase64(pathToFile);

    try {
      await client.sendImageFromBase64(message.from, imageBase64, 'image.png', 'Caption')
    } catch (error) {
      console.log("Erro ao enviar com o sendImage", error);
      await client.sendText(message.from, 'Desculpe! Não consegui enviar a imagem... Tente acessar o link para visualizar a imagem gerada! 🖼️🔗');
      await client.sendLinkPreview(message.from, imageUrl, 'Link da imagem gerada');
    }
  }
} as CommandType;
