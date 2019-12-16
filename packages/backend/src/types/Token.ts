import { objectType } from 'nexus';

export const Token = objectType({
    name: 'Token',
    definition(t) {
        t.model.id();
        t.model.createdAt();
        t.model.used();
        t.model.reason();
    },
});
