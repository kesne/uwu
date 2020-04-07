import { Command } from '../CommandManager';
import { User } from '../../entity/User';
import { sendToClient } from '../../websocket';

type Reward = {
    tokens: number;
    response: string;
    push?: string;
}

const REWARDS: Record<string, Reward> = {
    piano: {
        tokens: 1,
        response: '@VapeJuiceJordan GO PLAY PIAMO RIGHT MEOW'
    },
    enhance: {
        tokens: 1,
        response: 'ENHANCE!!',
        push: 'ENHANCE'
    }
};

export const redeem: Command = {
    name: 'redeem',
    async execute({ message }, rewardText) {
        const { displayName, userId } = message.userInfo;

        // TODO: Also move this into the top-level command stuff
        if (!userId) {
            return;
        }

        const reward = REWARDS[rewardText];
        if (!reward) {
            return `@${displayName} I don't think that's a reward???`;
        }

        // TODO: Move this into the command context, just pre-resolve it for all messages:
        const user = await User.findOne({
            where: { twitchID: userId },
            relations: ['tokens'],
        });

        if (!user) {
            return `@${displayName} You don't have any tokens :(`;
        }

        const redeemed = await user.redeem(reward.tokens);

        if (redeemed) {
            if (reward.push) {
                sendToClient({
                    type: 'ENHANCE',
                });
            }
            return reward.response;
        }

        return `@${displayName} You don't have enough tokens for that :(`;
    },
};
