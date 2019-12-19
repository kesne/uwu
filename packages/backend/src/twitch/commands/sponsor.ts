import { Command } from '../CommandManager';

export const sponsor: Command = {
    name: 'sponsor',
    execute() {
        return "Tonights stream is sponsored by Coca-Cola Vanilla Zero Sugar";
    },
};
