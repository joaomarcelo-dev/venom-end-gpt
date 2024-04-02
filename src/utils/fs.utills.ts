import https from 'https';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

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

const fsUtils = {
  downloadFileByLink,
  imageToBase64,
}

export default fsUtils;