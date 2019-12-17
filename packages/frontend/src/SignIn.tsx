import React from 'react';
import Title from '@airbnb/lunar/lib/components/Title';
import Text from '@airbnb/lunar/lib/components/Text';
import Button from '@airbnb/lunar/lib/components/Button';

export default function SignIn() {
    return (
        <div>
            <Title level={3}>Sign In To Continue</Title>
            <Text>UwU requires you to sign in with Twitch to view and manage your tokens.</Text>
            <Button href="/api/login">Sign In With Twitch</Button>
        </div>
    );
}
