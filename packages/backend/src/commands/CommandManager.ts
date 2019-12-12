import TwitchClient from 'twitch';
import { Client, ChatUserstate } from 'tmi.js';
import { getClient } from '../twitch';

type Command = {
    cost?: number;
    execute(
        api: TwitchClient,
        state: ChatUserstate,
        ...args: string[]
    ): string | undefined | Promise<string | undefined>;
};

class CommandManager {
    commands = new Map<string, Command>();
    client = Client({
        options: { debug: true },
        connection: {
            secure: true,
            reconnect: true,
        },
        identity: {
            username: 'VapeJuiceJorbot',
            password: process.env.TWITCH_BOT_OAUTH,
        },
        channels: ['VapeJuiceJordan'],
    });

    register(name: string, definition: Command) {
        this.commands.set(name, definition);
    }

    async connect() {
        const api = await getClient();

        this.client.connect();

        this.client.on('message', async (channel, state, message, self) => {
            // Ignore echoed messages.
            if (self) return;
            // Ignore messages that do not start with a "!"
            if (!message.startsWith('!')) return;

            const [command, ...args] = message
                .slice(1)
                .toLowerCase()
                .split(' ');

            const commandDefinition = this.commands.get(command);

            // If we don't have a command, just bail:
            if (!commandDefinition) return;

            try {
                const response = await commandDefinition.execute(api, state, ...args);
                if (response) {
                    this.client.say(channel, response);
                }
            } catch (e) {
                console.error('Error while executing command.');
                console.error(e);
            }
        });
    }
}

export default new CommandManager();
