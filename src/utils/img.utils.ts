import axios from 'axios';
import fs from 'node:fs';
import path from 'node:path';

const downloadFileImg = async (url: string, path: string, name: string) => {
  const responseData = await axios({
    method: 'get',
    url: url,
    responseType: 'stream', // Para garantir que a resposta seja tratada como um fluxo (stream)
  });

  const writer = fs.createWriteStream(`${path}/${name}`);
  
  responseData.data.pipe(writer);
  
  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
};

export const descriptImgENC = async (link: string, key: string, alg: string) => {
  await downloadFileImg(link, path.join(__dirname, '../temp'), 'imagem_encodificada.jpeg');
};