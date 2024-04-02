import { CommandType } from "../../types/Commands.types";

export default {
  initialAction: async ({ client, message }) => {
    await client.sendText(message.from, 'Agora grave um audio com a musica que desejas buscar! 🎶🎙️')  
  },
  action: async ({ client, message }) => {
      message
  },
  command: '!music',
  description: 'Procura qualquer musica que sejá mandada para ele',
} as CommandType;