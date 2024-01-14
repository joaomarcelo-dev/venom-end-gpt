export type AddMessageTempType = {
  from: string,
  content: string,
  model: string,
  role: 'user' | 'assistant',
}