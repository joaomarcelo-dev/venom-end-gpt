import path from 'node:path';
import fs from 'node:fs';

export const saveImgBase64 = (base64String: string) => {
  const imageBuffer = Buffer.from(base64String, 'base64');
  
  // Salvar a imagem (opcional)
  fs.writeFileSync(path.join(__dirname, 'imagem_decodificada.jpeg'), imageBuffer);
};;