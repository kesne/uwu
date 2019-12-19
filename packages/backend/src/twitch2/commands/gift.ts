import { Command } from '../CommandManager';
import { User } from '../../entity/User';

export const giftCommand: Command = {
    name: 'gift',
    async execute({ twitch, message }, username, amount) {
        const { userId, displayName } = message.userInfo;
        if (!userId) {
            return;
        }

        const numericalAmount = parseInt(amount, 10);
        if (!numericalAmount) {
            return `${displayName} I couldn't understand the amount of tokens you wanted to gift.`;
        }

        const user = await User.findOne({ where: { twitchID: message.userInfo.userId } });

        if (!user) {
            return `@${displayName} You have no tokens to gift.`;
        }

        try {
            await user.gift(twitch, username, numericalAmount);
            return `@${displayName} You gave "${username}" ${numericalAmount} tokens!`;
        } catch (e) {
            return `@${displayName} ${e.message}`;
        }
    },
};
