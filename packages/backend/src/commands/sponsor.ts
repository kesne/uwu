import CommandManager from './CommandManager';

CommandManager.register('sponsor', {
    execute() {
        return "Tonights stream is sponsored by Samuel Smith's Winter Welcome Ale";
    },
});
