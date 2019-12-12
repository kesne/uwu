import React, { useState, useMemo, useCallback } from 'react';
import Button from '@airbnb/lunar/lib/components/Button';
import ButtonGroup from '@airbnb/lunar/lib/components/ButtonGroup';
import Modal from '@airbnb/lunar/lib/components/Modal';
import Text from '@airbnb/lunar/lib/components/Text';
import Input from '@airbnb/lunar/lib/components/Input';

export default function GiftTokens({ tokenGrants }: any) {
    const [visible, setVisible] = useState(false);
    const [username, setUsername] = useState('');
    const [tokens, setTokens] = useState('0');
    const totalAvailable = useMemo(
        () =>
            tokenGrants.reduce(
                (acc: number, grant: any) => acc + (grant.tokens - grant.redeemed),
                0,
            ),
        [tokenGrants],
    );
    const handleClose = useCallback(() => {
        setTokens('0');
        setUsername('');
        setVisible(false);
    }, []);
    const handleSubmit = useCallback(e => {
        e.preventDefault();
        console.log('hi');
    }, []);

    return (
        <div>
            <Button onClick={() => setVisible(true)} inverted>
                Gift Fuck With Me Tokens
            </Button>
            {visible && (
                <Modal title="Gift Tokens" onClose={handleClose}>
                    <Text>
                        You can gift <strong>{totalAvailable}</strong> tokens to any twitch user.
                    </Text>
                    <Text>
                        Please make sure the Twitch username exactly matches the user you would like
                        to gift your tokens to.
                    </Text>
                    <form onSubmit={handleSubmit}>
                        <Input
                            label="Tokens to gift"
                            min={0}
                            max={totalAvailable}
                            type="number"
                            value={tokens}
                            onChange={setTokens}
                        />
                        <Input label="Twitch Username" value={username} onChange={setUsername} />
                        <ButtonGroup endAlign>
                            <Button inverted onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button type="submit">Gift</Button>
                        </ButtonGroup>
                    </form>
                </Modal>
            )}
        </div>
    );
}
