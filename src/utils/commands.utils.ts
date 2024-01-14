import { initialOrientationGPT3Turbo } from '../conf';
import { TypeCommands } from '../types/Commands.types';

export const listOfCommands: TypeCommands = {
  venom: {
    command: '!venom',
    description: 'Inicia o venom 🕷️',
    configurationInitial: initialOrientationGPT3Turbo,
    model: 'gpt-3.5-turbo',
  },
  stop: {
    command: '!stop',
    description: 'Para o venom 🛑🕷️',
    configurationInitial: '',
    model: '',
  },
};
