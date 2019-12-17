import { queryType } from 'nexus';

export const Query = queryType({
    definition(t) {
        t.field('me', {
            type: 'User',
            nullable: true,
            resolve: (_parent, _args, { photon, user }) => {
                if (!user) {
                    return null;
                }

                return photon.users.findOne({
                    where: {
                        id: user.id,
                    },
                });
            },
        });

        t.int('totalTokens', {
            nullable: false,
            authorize: (_parent, _args, { user }) => !!user,
            resolve: async (_parent, _args, { photon }) => {
                // TODO: This is more expensive than it should be. Once we move redeption to be deleting vs marking as used,
                // we can just replace this with count.
                const allTokens = await photon.tokens.findMany({
                    where: { used: false },
                    select: { id: true },
                });

                return allTokens.length;
            },
        });
    },
});
