export type AddMessageTempType = {
  from: string,
  author?: string,
  isGroupMsg?: boolean,
  nameUser?: string,
  content: string,
  model: string,
  command?: string,
  role: 'user' | 'assistant',
}