import { objectType } from 'nexus';

export const User = objectType({
    name: 'User',
    definition(t) {
        t.model.id();
        t.model.name();
        t.model.twitchID();
        t.model.tokens({ pagination: false, filtering: { used: true } });
    },
});
