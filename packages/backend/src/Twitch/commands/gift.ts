import { Command } from '../CommandManager';
import { gift } from '../../utils/tokens';

export const giftCommand: Command = {
    name: 'gift',
    async execute({ twitch, message, photon }, username, amount) {
        const { userId, displayName } = message.userInfo;
        if (!userId) {
            return;
        }

        const numericalAmount = parseInt(amount, 10);
        if (!numericalAmount) {
            return `${displayName} I couldn't understand the amount of tokens you wanted to gift.`;
        }

        const user = await photon.users.findOne({ where: { twitchID: message.userInfo.userId } });

        if (!user) {
            return `@${displayName} You have no tokens to gift.`;
        }

        try {
            await gift(twitch, user, username, numericalAmount);
            return `@${displayName} You gave "${username}" ${numericalAmount} tokens!`;
        } catch (e) {
            return `${displayName} ${e.message}`;
        }
    },
};
