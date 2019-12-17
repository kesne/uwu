import React from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import Loader from '@airbnb/lunar/lib/components/Loader';
import Text from '@airbnb/lunar/lib/components/Text';

export default function TotalTokens() {
    const { data, loading } = useQuery(gql`
        query TotalTokens {
            totalTokens
        }
    `);

    if (loading) {
        return <Loader />;
    }

    return (
        <Text>
            <strong>Total tokens in circulation:</strong> {data.totalTokens}
        </Text>
    );
}
