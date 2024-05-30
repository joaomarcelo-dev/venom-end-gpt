// import { ActionParmsType, CommandType } from "../../types/Commands.types";
// import { addMessageTemp } from "../../utils/messages.utils";
// import { exec } from 'child_process';
// import { validateURL, getBasicInfo } from 'ytdl-core';
// import path from 'node:path';
// import fs from 'node:fs';

// export default {
//   command: "!download",
//   description: "Baixa e envia arquivos de áudio baixados através de links do YouTube",
//   details: "Envie o link do vídeo que deseja baixar e ele lhe enviará o arquivo de áudio",
//   initialAction: async ({ client, message }: ActionParmsType) => {
//     addMessageTemp({
//       content: message.body,
//       from: message.from,
//       model: 'gpt-3.5-turbo',
//       role: 'user',
//       author: message.author,
//       command: message.body,
//       isGroupMsg: message.isGroupMsg,
//       nameUser: message.sender.pushname,
//     });

//     await client.sendText(message.from, 'Por favor me envie o link da música que deseja baixar! 😅😊')
//   },
//   action: async ({ client, message }: ActionParmsType) => {
//     addMessageTemp({
//       content: message.body,
//       from: message.from,
//       model: 'dall-e-3',
//       role: 'user',
//       author: message.author,
//       command: message.body,
//       isGroupMsg: message.isGroupMsg,
//       nameUser: message.sender.pushname,
//     });

//     const messageContent = message.body;

//     if (!validateURL(messageContent)){
//       return client.sendText(message.from, 'Por favor envie um link válido do YouTube! 😅😊')
//     }

//     await client.sendText(message.from, 'Aguarde... ⏳')

//     const { videoDetails: { title } } = await getBasicInfo(messageContent);
    
//     const pythonScriptPath = path.join(__dirname, '../scripts', 'download-youtube-audio.py');
//     const pythonCommand = `python3 ${pythonScriptPath} download_video "${messageContent}" "${`${title}.mp3`}"`;
    
//     exec(pythonCommand, async (error, stdout, stderr) => {
//       if (error) {
//           const pathMusic = path.join(`./src/temp/downloads/${title}.mp3`);
          
//           // Verifica se o arquivo existe antes de tentar enviar
//           if (fs.existsSync(pathMusic)) {
//             await client.sendText(message.from, `Enviando: ${title} 🎵🎶`);
//             await client.sendFile(message.from, pathMusic, title, `Aqui está a música: ${title} 🎵🎶`)
//             .then(() => {
//               // Após enviar o arquivo, exclui-o
//               fs.unlinkSync(pathMusic);
//             });
//           } else {
//             await client.sendText(message.from, `Erro ao baixar a música: ${title} 🎵🥲☠️`);
//           }
//       }
//   });
  
    
//   }
// } as CommandType;



import { ActionParmsType, CommandType } from "../../types/Commands.types";
import { addMessageTemp } from "../../utils/messages.utils";
import { exec } from 'child_process';
import { validateURL, getBasicInfo } from 'ytdl-core';
import path from 'node:path';
import fs from 'node:fs';
import { Whatsapp } from "venom-bot";

// Array para armazenar os links de download
const downloadQueue: { url: string, senderNumber: string }[] = [];

export default {
  command: "!download",
  description: "Baixa e envia arquivos de áudio baixados através de links do YouTube",
  details: "Envie o link do vídeo que deseja baixar e ele lhe enviará o arquivo de áudio",
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

    await client.sendText(message.from, 'Por favor me envie o link da música que deseja baixar! 😅😊')
  },
  action: async ({ client, message }: ActionParmsType) => {
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

    const messageContent = message.body;

    if (!validateURL(messageContent)){
      return client.sendText(message.from, 'Por favor envie um link válido do YouTube! 😅😊')
    }

    await client.sendText(message.from, 'Aguarde... ⏳')

    const { videoDetails: { title } } = await getBasicInfo(messageContent);
    
    // Adiciona o link à fila de download junto com o número do remetente
    downloadQueue.push({ url: messageContent, senderNumber: message.from });
    
    // Se a fila tiver apenas um item, começa o download
    if (downloadQueue.length === 1) {
      processDownload(client);
    }
  }
} as CommandType;

// Função para processar o próximo download na fila
async function processDownload(client: Whatsapp) {
  const { url, senderNumber } = downloadQueue[0];
  const { videoDetails: { title } } = await getBasicInfo(url);
  
  const pythonScriptPath = path.join(__dirname, '../scripts', 'download-youtube-audio.py');
  const pythonCommand = `python3 ${pythonScriptPath} download_video "${url}" "${`${title}.mp3`}"`;
  
  exec(pythonCommand, async (error, stdout, stderr) => {
    if (error) {
      const pathMusic = path.join(`./src/temp/downloads/${title}.mp3`);
      
      // Verifica se o arquivo existe antes de tentar enviar
      if (fs.existsSync(pathMusic)) {
        await client.sendText(senderNumber, `Enviando: ${title} 🎵🎶`);
        await client.sendFile(senderNumber, pathMusic, title, `Aqui está a música: ${title} 🎵🎶`)
        .then(() => {
          // Após enviar o arquivo, exclui-o
          fs.unlinkSync(pathMusic);
        });
      } else {
        await client.sendText(senderNumber, `Erro ao baixar a música: ${title} 🎵🥲☠️`);
      }
    }
    
    // Remove o link processado da fila
    downloadQueue.shift();
    
    // Se ainda houver links na fila, processa o próximo
    if (downloadQueue.length > 0) {
      processDownload(client);
    }
  });
}
