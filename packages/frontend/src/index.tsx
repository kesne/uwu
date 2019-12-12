import './setup.ts';
import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import Layout from '@airbnb/lunar-layouts/lib/components/Layout';
import User from './User';
import client from './client';

function App() {
    return (
        <ApolloProvider client={client}>
            <Layout>
                <User />
            </Layout>
        </ApolloProvider>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));
