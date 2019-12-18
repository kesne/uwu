import React from 'react';
import Text from '@airbnb/lunar/lib/components/Text';
import Card from '@airbnb/lunar/lib/components/Card';
import CardContent from '@airbnb/lunar/lib/components/Card/Content';
import Row from '@airbnb/lunar/lib/components/Row';
import DateTime from '@airbnb/lunar/lib/components/DateTime';

type Props = {
    tokens: any[];
};

export default function Tokens({ tokens }: Props) {
    return (
        <Card>
            {tokens.map((grant: any) => (
                <CardContent key={grant.id}>
                    <Row
                        after={
                            <Text small>
                                <DateTime at={Number(grant.createdAt)} medium noTimezone />
                            </Text>
                        }
                    >
                        <Text large>{grant.reason}</Text>
                    </Row>
                </CardContent>
            ))}
        </Card>
    );
}
