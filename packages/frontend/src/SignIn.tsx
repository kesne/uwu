import React from 'react';
import Title from '@airbnb/lunar/lib/components/Title';
import Text from '@airbnb/lunar/lib/components/Text';
import Button from '@airbnb/lunar/lib/components/Button';

const SIGN_IN_URL = 'http://localhost:4000/login';

export default function SignIn() {
    return (
        <div>
            <Title level={3}>Sign In To Continue</Title>
            <Text>UwU requires you to sign in with Twitch to view and manage your tokens.</Text>
            <Button href={SIGN_IN_URL}>Sign In With Twitch</Button>
        </div>
    );
}
