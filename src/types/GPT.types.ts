type MessageType = {
  role: "user" | "assistant";
  content: string;
  expireIn: number;
}

export type MessageHistory = Record<string, MessageType[]>;


export {
  MessageType,
}