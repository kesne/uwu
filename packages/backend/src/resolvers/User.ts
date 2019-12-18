import { UserResolvers } from '../schema.graphql';
import { Token } from '../entity/Token';
import { AuthenticationError } from 'apollo-server-express';

export const resolvers: UserResolvers = {
    async tokens(parent, _args, { user }) {
        if (user.id !== parent.id) {
            throw new AuthenticationError('You can only look at your own tokens!');
        }

        return await Token.find({ where: { user } });
    },
};
