import CommandManager from './CommandManager';
import { photon } from '../context';

CommandManager.register('tokens', {
    async execute(api, state) {
        if (!state.username) {
            return;
        }

        const twitchUser = await api.helix.users.getUserByName(state.username);
        if (!twitchUser) return;

        const user = await photon.users.findOne({
            where: { twitchID: twitchUser.id },
            include: { tokenGrants: true },
        });

        if (!user) {
            return `@${state['display-name']}, you have 0 Fuck With Me Tokens`;
        }

        const totalTokens = user.tokenGrants.reduce(
            (acc, grant) => acc + (grant.tokens - grant.redeemed),
            0,
        );

        return `@${state['display-name']}, you have ${totalTokens} Fuck With Me Tokens`;
    },
});
