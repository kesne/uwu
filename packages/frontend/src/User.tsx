import React from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import Loader from '@airbnb/lunar/lib/components/Loader';
import Alert from '@airbnb/lunar/lib/components/Alert';
import Title from '@airbnb/lunar/lib/components/Title';
import SignIn from './SignIn';
import Tokens from './Tokens';
import GiftTokens from './GiftTokens';

const USER_QUERY = gql`
    query Me {
        me {
            id
            name
            tokens {
                id
                used
                reason
                createdAt
            }
        }
    }
`;

export default function User() {
    const { data, loading, error } = useQuery(USER_QUERY);

    if (loading) {
        return <Loader large />;
    }

    if (error) {
        return <Alert danger title={error.message} />;
    }

    // No account, need to login:
    if (!data.me) {
        return <SignIn />;
    }

    return (
        <div>
            <Title level={1}>{data.me.name}</Title>
            <GiftTokens tokens={data.me.tokens} />
            <Tokens tokens={data.me.tokens} />
        </div>
    );
}
