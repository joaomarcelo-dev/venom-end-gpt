type MessageType = {
  role: "user" | "assistant";
  content: string;
}

export type MessageHistory = Record<string, MessageType[]>;


export {
  MessageType,
}