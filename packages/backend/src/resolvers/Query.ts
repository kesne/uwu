import { AuthenticationError } from 'apollo-server-express';
import { QueryResolvers } from '../schema.graphql';
import { Token } from '../entity/Token';

export const resolvers: QueryResolvers = {
    me(_parent, _args, { user }) {
        if (!user) {
            return null;
        }
        return user;
    },

    async totalTokens(_parent, _args, { user }) {
        if (!user) {
            throw new AuthenticationError('You must be signed in to see the total tokens count.');
        }
        return await Token.count();
    },
};
