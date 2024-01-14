type MessageType = {
  role: "user" | "assistant";
  content: string;
  expireIn: number;
}

export type MessageHistory = {
  [key: string]: {
    messages: MessageType[];
    model: string;
  }
};


export {
  MessageType,
}