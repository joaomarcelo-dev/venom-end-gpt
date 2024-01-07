import { create } from 'venom-bot';
import appStart from './app';

create({
  session: 'venom-end-gpt',

})
.then((client) => appStart(client))
.catch((error) => {
  console.log(error);
});
