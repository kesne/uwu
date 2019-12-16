import React from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import Layout from '@airbnb/lunar-layouts/lib/components/Layout';
import User from './User';
import client from './client';

export default function App() {
    return (
        <ApolloProvider client={client}>
            <Layout>
                <User />
            </Layout>
        </ApolloProvider>
    );
}
