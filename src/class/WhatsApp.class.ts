
export default class WhatsApp {
  client: any;
  messages: any[] = [];
  chatActive: boolean = false;

  constructor(client: any) {
    this.client = client;
  }

  async sendMessage(message: string, number: string) {
    return await this.client.sendText(number, message);
  }

  async onMessage(callback: any) {
    return await this.client.onMessage(callback);
  }

  async sendText(number: string, message: string) {
    return await this.client.sendText(number, message);
  }

  async sendFile(number: string, file: any, caption: string) {
    return await this.client.sendFile(number, file, caption);
  }

  async sendImage(number: string, image: any, caption: string) {
    return await this.client.sendImage(number, image, caption);
  }

  async sendVoice(number: string, voice: any, caption: string) {
    return await this.client.sendVoice(number, voice, caption);
  }
}