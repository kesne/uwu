import React from 'react';
import Table from '@airbnb/lunar/lib/components/Table';

type Props = {
    tokenGrants: any[];
};

export default function Tokens({ tokenGrants }: Props) {
    return <Table>
        <thead>
            <tr>
                <th>Tokens</th>
                <th>Redeemed</th>
                <th>Reason</th>
                <th>Grant Date</th>
            </tr>
        </thead>
        <tbody>
            {tokenGrants.map((grant: any) => (
                <tr key={grant.id}>
                    <td>{grant.tokens}</td>
                    <td>{grant.redeemed}</td>
                    <td>{grant.reason}</td>
                    <td>{grant.createdAt}</td>
                </tr>
            ))}
        </tbody>
    </Table>
}
