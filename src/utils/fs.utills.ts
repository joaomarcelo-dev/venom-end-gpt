import https from 'https';
import fs from 'fs';
import path from 'path';
import mime from 'mime-types';
import { v4 as uuidv4 } from 'uuid';
import { ActionParmsType } from '../types/Commands.types';

const downloadFileByLink = (url: string): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const tempDir = path.resolve(__dirname, '../temp'); // Diretório temporário onde será salvo o arquivo

    if (!fs.existsSync(tempDir)){
      fs.mkdirSync(tempDir);
    }
    
    let ext = '.png'; // Extensão padrão
    const fileName = `${uuidv4()}${ext}`; // Gera um nome aleatório para o arquivo
    
    const filePath = path.join(tempDir, fileName); // Caminho completo para o arquivo
    
    const file = fs.createWriteStream(filePath);
    
    https.get(url, response => {
      // Verifica o tipo de conteúdo do arquivo
      const contentType = response.headers['content-type'];
      if (contentType) {
        const contentTypeParts = contentType.split('/');
        if (contentTypeParts.length === 2 && contentTypeParts[0] === 'image') {
          ext = `.${contentTypeParts[1]}`;
        }
      }
      
      response.pipe(file);
      file.on('finish', () => {
        file.close(() => {
          console.log('Download concluído!');
          resolve(filePath); // Retorna o caminho completo do arquivo
        });
      });
    }).on('error', err => {
      fs.unlink(filePath, () => {
        console.error(`Erro durante o download: ${err.message}`);
        reject(err);
      });
    });
  });
}

const deletFileToPath = (filePath: string) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

const imageToBase64 = async (imagePath: string) => {
  if (!fs.existsSync(imagePath)) {
      console.error('Arquivo não encontrado:', imagePath);
      throw new Error('Arquivo não encontrado');
  }

  // Lê o arquivo como buffer
  const imageBuffer = fs.readFileSync(imagePath);

  // Converte o buffer para base64
  const base64Image = 'data:image/png;base64,' + imageBuffer.toString('base64');

  // Retorna a string base64 com o prefixo correto
  return base64Image;
}

const saveMidiaReceived = async ({ client, message }: ActionParmsType): Promise<string | undefined> => {
  if (message.mediaData) {
    const buffer = await client.decryptFile(message);
    const fileName = `${uuidv4()}.${mime.extension(message.mimetype)}`;

    // Define o caminho completo onde você quer salvar o arquivo
    const filePath = path.join(__dirname, '../temp', fileName);

    fs.writeFile(filePath, buffer, async (err) => {
      if (err) {
        console.log('Erro ao baixar o arquivo:', err);
        await client.sendText(message.from, 'Erro ao baixar o arquivo');
      } else {
        console.log('Arquivo baixado com sucesso em:', filePath);
        await client.sendText(message.from, 'Arquivo baixado com sucesso');
      }
    });

    return filePath;
  }
}

const fsUtils = {
  downloadFileByLink,
  imageToBase64,
  deletFileToPath,
  saveMidiaReceived,
}

export default fsUtils;