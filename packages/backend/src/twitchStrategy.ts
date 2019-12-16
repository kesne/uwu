import { Strategy } from 'passport-twitch.js';
import {
    TWITCH_CLIENT_ID,
    TWITCH_CLIENT_SECRET,
    TWITCH_ID,
    VJJ_ACCESS_TOKEN,
    VJJ_REFRESH_TOKEN,
} from './constants';
import redis from './redis';
import { photon } from './context';

export default new Strategy(
    {
        clientID: TWITCH_CLIENT_ID,
        clientSecret: TWITCH_CLIENT_SECRET,
        callbackURL:
            process.env.NODE_ENV === 'production'
                ? 'https://uwu.vapejuicejordan.rip/api/auth/twitch/callback'
                : 'http://localhost:3000/api/auth/twitch/callback',
        scope: [
            'user:read:email',
            // TODO: Only request these for admin logins:
            'channel:read:subscriptions',
            'channel_subscriptions',
            'bits:read',
        ],
    },
    (accessToken, refreshToken, profile, done) => {
        if (profile.id === TWITCH_ID) {
            // Save the access and refresh tokens for VJJ.
            redis.set(VJJ_ACCESS_TOKEN, accessToken);
            redis.set(VJJ_REFRESH_TOKEN, refreshToken);
        }

        const commonFields = {
            name: profile.display_name,
            email: profile.email,
        };

        photon.users
            .upsert({
                update: {
                    ...commonFields,
                },
                where: {
                    twitchID: profile.id,
                },
                create: {
                    ...commonFields,
                    twitchID: profile.id,
                    // NOTE: We issue 1 play token when you create your account without subscribing.
                    // This is just a small reward we can grant to non-subscribers for fun.
                    tokens: {
                        create: {
                            reason: 'Logging in to UwU without a subscription, because I love you.',
                        },
                    },
                },
            })
            .then(
                user => done(null, user),
                e => done(e),
            );
    },
);
