import TwitchClient from 'twitch';
import TwitchPrivateMessage from 'twitch-chat-client/lib/StandardCommands/TwitchPrivateMessage';
import * as allCommands from './commands';

type CommandContext = {
    twitch: TwitchClient;
    message: TwitchPrivateMessage;
};

export type Command = {
    name: string;
    aliases?: string[];
    cost?: number;
    execute(
        context: CommandContext,
        ...args: string[]
    ): string | undefined | Promise<string | undefined>;
};

type Say = (channel: string, message: string) => void;

export default class CommandManager {
    private commands: Map<string, Command>;
    private say: Say;
    private twitch: TwitchClient;

    constructor(twitch: TwitchClient, say: Say) {
        this.twitch = twitch;
        this.say = say;
        this.commands = new Map();

        Object.values(allCommands).forEach(command => {
            this.commands.set(command.name, command);
            if (command.aliases) {
                command.aliases.forEach(alias => {
                    this.commands.set(alias, command);
                });
            }
        });
    }

    async send(channel: string, message: string, info: TwitchPrivateMessage) {
        if (!message.startsWith('!')) return;

        const [command, ...args] = message
            .slice(1)
            .toLowerCase()
            .split(' ');

        const commandDefinition = this.commands.get(command);

        // If we don't have a command, just bail:
        if (!commandDefinition) return;

        try {
            const response = await commandDefinition.execute(
                {
                    twitch: this.twitch,
                    message: info,
                },
                ...args,
            );
            if (response) {
                this.say(channel, response);
            }
        } catch (e) {
            console.error('Error while executing command.');
            console.error(e);
        }
    }
}
