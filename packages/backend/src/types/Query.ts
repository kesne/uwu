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
    },
});
