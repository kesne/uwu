import { Command } from '../CommandManager';
import { User } from '../../entity/User';

const formatTokens = (name: string, tokens: number = 0) =>
    `@${name}, you have ${tokens} Fuck With Me Tokens`;

export const tokens: Command = {
    name: 'tokens',
    aliases: ['points'],
    async execute({ message }) {
        const { displayName, userId } = message.userInfo;

        if (!userId) {
            return;
        }

        const user = await User.findOne({
            where: { twitchID: userId },
            relations: ['tokens'],
        });

        if (!user) {
            return formatTokens(displayName);
        }

        return formatTokens(displayName, user.tokens.length);
    },
};
