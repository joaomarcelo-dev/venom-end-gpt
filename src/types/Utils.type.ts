export type AddMessageTempType = {
  from: string,
  author?: string,
  isGroupMsg?: boolean,
  nameUser?: string,
  content: string,
  model: string,
  role: 'user' | 'assistant',
}