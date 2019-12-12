import { objectType } from 'nexus';

export const Post = objectType({
    name: 'TokenGrant',
    definition(t) {
        t.model.id();
        t.model.createdAt();
        t.model.redeemed();
        t.model.tokens();
        t.model.reason();
    },
});
