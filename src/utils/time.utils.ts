import schedule from 'node-schedule';
import { deleteMessagesExpired } from './messages.utils';
import dayjs from 'dayjs';
import { Whatsapp } from 'venom-bot';

export const generateUnixTime = (minutes: number) => {
  return dayjs().add(minutes, 'minute').unix();
};

export const routineInOneMinute = (client: Whatsapp) => schedule.scheduleJob('*/10 * * * * *', () => {
  deleteMessagesExpired(client);
});