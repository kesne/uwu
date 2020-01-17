import ApolloClient, { gql } from 'apollo-boost';

const client = new ApolloClient({
    uri: '/api/graphql',
    credentials: 'include',
});

export { gql };
export default client;
