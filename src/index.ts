import { create } from 'venom-bot';
import appStart from './app';
import { routineInOneMinute } from './utils/time.utils';

create({
  session: 'venom-end-gpt',
  // headless: false // Desativa o modo headless para exibir o navegador
})
.then((client) => {
  appStart(client);
  routineInOneMinute(client);
})
.catch((error) => {
  console.log('Erro no venom: ', error);
});
