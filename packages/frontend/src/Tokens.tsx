import React from 'react';
import Table from '@airbnb/lunar/lib/components/Table';

type Props = {
    tokens: any[];
};

export default function Tokens({ tokens }: Props) {
    return <Table>
        <thead>
            <tr>
                <th>Used</th>
                <th>Reason</th>
                <th>Grant Date</th>
            </tr>
        </thead>
        <tbody>
            {tokens.map((grant: any) => (
                <tr key={grant.id}>
                    <td>{grant.used ? 'Yes' : 'No'}</td>
                    <td>{grant.reason}</td>
                    <td>{grant.createdAt}</td>
                </tr>
            ))}
        </tbody>
    </Table>
}
