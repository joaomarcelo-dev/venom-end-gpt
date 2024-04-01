type MessageType = {
  role: "user" | "assistant";
  content: string;
  expireIn: number;
}

export type MessageHistory = {
  [key: string]: {
    messages: MessageType[];
    model: string;
    author?: string;
    isGroupMsg?: boolean;
    nameUser?: string;
    command?: string;
    paused: boolean;
  }
};


export {
  MessageType,
}