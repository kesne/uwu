import React, { useState } from 'react';
import Button from '@airbnb/lunar/lib/components/Button';
import GiftModal from './GiftModal';
import { useCallback } from 'react';

export default function GiftTokens({ tokens }: any) {
    const [visible, setVisible] = useState(false);
    const handleClose = useCallback(() => {
        setVisible(false);
    }, []);

    return (
        <div>
            <Button onClick={() => setVisible(true)} inverted>
                Gift Fuck With Me Tokens
            </Button>
            {visible && <GiftModal tokens={tokens} onClose={handleClose} />}
        </div>
    );
}
