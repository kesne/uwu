import ApolloClient from 'apollo-boost';

const client = new ApolloClient({
  uri: '/api/graphql',
  credentials: 'include'
});

export default client;
