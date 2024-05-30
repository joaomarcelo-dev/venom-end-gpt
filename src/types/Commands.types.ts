import { Message, Whatsapp } from "venom-bot";

export type ActionParmsType = {
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

export type CommandType = {
  command: string
  description: string
  details?: string
  model?: string
  action: ({ client, message }: ActionParmsType) => void
  initialAction: ({ client, message }: ActionParmsType) => void
}