import { mutationType, stringArg, intArg } from 'nexus';
import redeem from '../utils/redeem';

export const Mutation = mutationType({
    definition(t) {
        t.string('test', {
            resolve() {
                return 'hi';
            },
        });

        t.field('giftTokens', {
            type: 'User',
            args: {
                username: stringArg({ nullable: false }),
                amount: intArg({ nullable: false }),
            },
            authorize: (_parent, _args, { user }) => !!user,
            async resolve(_parent, { username, amount }, { photon, user, twitch }) {
                const twitchUser = await twitch.helix.users.getUserByName(username);

                if (!twitchUser) {
                    throw new Error(`Unable to find user "${username}".`);
                }

                const tokenGrant = {
                    create: {
                        tokens: amount,
                        reason: `A gift from ${user.name}!`,
                    },
                };

                const tokenGrants = await photon.tokenGrants.findMany({
                    where: {
                        user: { id: user.id },
                    },
                });

                const hasEnoughTokens = await redeem(user.id, tokenGrants, amount);

                if (!hasEnoughTokens) {
                    throw new Error('Attempted to gift more tokens than were available.');
                }

                await photon.users.upsert({
                    where: {
                        twitchID: twitchUser.id,
                    },
                    update: {
                        tokenGrants: tokenGrant,
                    },
                    create: {
                        twitchID: twitchUser.id,
                        name: twitchUser.displayName,
                        tokenGrants: tokenGrant,
                    },
                });

                return user;
            },
        });
    },
});
