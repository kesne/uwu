import { mutationType, stringArg, intArg } from 'nexus';
import { gift } from '../utils/tokens';

export const Mutation = mutationType({
    definition(t) {
        t.field('giftTokens', {
            type: 'User',
            args: {
                username: stringArg({ nullable: false }),
                amount: intArg({ nullable: false }),
            },
            authorize: (_parent, _args, { user }) => !!user,
            resolve(_parent, { username, amount }, { user, twitch }) {
                return gift(twitch, user, username, amount);
            },
        });
    },
});
