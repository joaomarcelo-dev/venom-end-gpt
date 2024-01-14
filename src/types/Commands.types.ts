import { Message, Whatsapp } from "venom-bot";

type ActionParmsType = {
  message: Message,
  client: Whatsapp,
}

export type TypeCommands = {
  [key: string]: {
    command: string;
    description: string;
    configurationInitial: string;
    model: string;
    action: ({}: ActionParmsType) => void;
  };
};
