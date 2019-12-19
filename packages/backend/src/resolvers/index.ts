import { Resolvers } from '../schema.graphql';
import { resolvers as Query } from './Query';
import { resolvers as Mutation } from './Mutation';
import { resolvers as User } from './User';

const resolvers: Resolvers = {
    Query,
    Mutation,
    User,
};

export default resolvers;
