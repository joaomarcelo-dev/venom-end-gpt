import { create } from 'venom-bot';
import appStart from './app';
import { routineInOneMinute } from './utils/time.utils';

create({
  session: 'venom-end-gpt',

})
.then((client) => {
  appStart(client);
  routineInOneMinute(client);
})
.catch((error) => {
  console.log(error);
});

