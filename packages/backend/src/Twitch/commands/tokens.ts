import { photon } from '../../context';
import { Command } from '../CommandManager';

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

        const user = await photon.users.findOne({
            where: { twitchID: userId },
            include: {
                tokens: {
                    where: { used: false },
                },
            },
        });

        if (!user) {
            return formatTokens(displayName);
        }

        return formatTokens(displayName, user.tokens.length);
    },
};
