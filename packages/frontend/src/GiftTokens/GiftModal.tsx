import React, { useState, useEffect, useCallback } from 'react';
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
import Alert from '@airbnb/lunar/lib/components/Alert';
import Spacing from '@airbnb/lunar/lib/components/Spacing';
import Button from '@airbnb/lunar/lib/components/Button';
import ButtonGroup from '@airbnb/lunar/lib/components/ButtonGroup';
import Modal from '@airbnb/lunar/lib/components/Modal';
import Text from '@airbnb/lunar/lib/components/Text';
import Input from '@airbnb/lunar/lib/components/Input';

export default function GiftModal({ tokens, onClose }: any) {
    const [username, setUsername] = useState('');
    const [amountToGift, setAmountToGift] = useState('0');
    const [giftTokens, { loading, data, error }] = useMutation(
        gql`
            mutation GiftTokens($amount: Int!, $username: String!) {
                giftTokens(amount: $amount, username: $username) {
                    id
                }
            }
        `,
        {
            variables: {
                username,
                amount: Number(amountToGift),
            },
        },
    );

    const handleSubmit = useCallback(
        e => {
            e.preventDefault();
            giftTokens();
        },
        [giftTokens],
    );

    useEffect(() => {
        if (data) {
            onClose();
        }
    }, [data, onClose]);

    return (
        <Modal title="Gift Tokens" onClose={onClose}>
            {error && (
                <Spacing bottom={2}>
                    <Alert danger title={error.message} />
                </Spacing>
            )}
            <Text>
                You can gift <strong>{tokens.length}</strong> tokens to any twitch user.
            </Text>
            <Text>
                Please make sure the Twitch username exactly matches the user you would like to gift
                your tokens to.
            </Text>
            <form onSubmit={handleSubmit}>
                <Input
                    label="Tokens to gift"
                    min={0}
                    max={tokens.length}
                    type="number"
                    value={amountToGift}
                    onChange={setAmountToGift}
                />
                <Input label="Twitch Username" value={username} onChange={setUsername} />
                <ButtonGroup endAlign>
                    <Button inverted onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" loading={loading}>
                        Gift
                    </Button>
                </ButtonGroup>
            </form>
        </Modal>
    );
}
