import { AuthenticationError } from 'apollo-server-express';
import { MutationResolvers } from '../schema.graphql';
import { TWITCH_ID } from '../constants';
import { User } from '../entity/User';

export const resolvers: MutationResolvers = {
    async giftTokens(_parent, { amount, username }, { user, twitch }) {
        if (!user) {
            throw new AuthenticationError('You need to be signed in to gift tokens');
        }

        await user.gift(twitch, username, amount);

        return user;
    },

    async createToken(_parent, { amount, username }, { user, twitch }) {
        if (user.twitchID !== TWITCH_ID) {
            throw new AuthenticationError('You must be VJJ to create tokens from nothing');
        }

        const twitchUser = await twitch.helix.users.getUserByName(username);

        if (!twitchUser) {
            throw new Error('Could not find the twitch user');
        }

        User.awardTokens(twitchUser.id, amount, 'A gift from your god, VapeJuiceJordan himself');

        return { success: true };
    }
};
