import React from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import Loader from '@airbnb/lunar/lib/components/Loader';
import Alert from '@airbnb/lunar/lib/components/Alert';
import Title from '@airbnb/lunar/lib/components/Title';
import Row from '@airbnb/lunar/lib/components/Row';
import SignIn from './SignIn';
import Tokens from './Tokens';
import GiftTokens from './GiftTokens';
import Spacing from '@airbnb/lunar/lib/components/Spacing';
import TotalTokens from './TotalTokens';

const USER_QUERY = gql`
    query Me {
        me {
            id
            name
            tokens {
                id
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
            <Spacing bottom={2}>
                <Row after={<GiftTokens tokens={data.me.tokens} />} middleAlign>
                    <Title level={1}>{data.me.name}</Title>
                    <Title level={3}>Total Tokens: {data.me.tokens.length}</Title>
                </Row>
            </Spacing>
            <Tokens tokens={data.me.tokens} />
            <Spacing top={2}>
                <TotalTokens />
            </Spacing>
        </div>
    );
}
