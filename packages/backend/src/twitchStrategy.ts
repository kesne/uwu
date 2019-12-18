import { Strategy } from 'passport-twitch.js';
import {
    TWITCH_CLIENT_ID,
    TWITCH_CLIENT_SECRET,
    TWITCH_ID,
    VJJ_ACCESS_TOKEN,
    VJJ_REFRESH_TOKEN,
} from './constants';
import redis from './redis';
import { User } from './entity/User';
import { Token } from './entity/Token';

const DEFAULT_NAME = 'twitch.js';
const ADMIN_NAME = 'twitch.js-admin';

function getStrategy(name: string, isAdmin: boolean = false) {
    const scopes = isAdmin
        ? [
              'user:read:email',
              'channel:read:subscriptions',
              'channel:read:redemptions',
              'channel_subscriptions',
              'bits:read',
          ]
        : ['user:read:email'];

    let callback =
        process.env.NODE_ENV === 'production'
            ? 'https://uwu.vapejuicejordan.rip/api/auth/twitch/callback'
            : 'http://localhost:3000/api/auth/twitch/callback';

    if (isAdmin) {
        callback += '/admin';
    }

    const strategy = new Strategy(
        {
            clientID: TWITCH_CLIENT_ID,
            clientSecret: TWITCH_CLIENT_SECRET,
            callbackURL: callback,
            scope: scopes,
        },
        async (accessToken, refreshToken, profile, done) => {
            if (name === DEFAULT_NAME && profile.id === TWITCH_ID) {
                done(null, { id: -1, needsRedirectToAdmin: true });
                return;
            }

            if (profile.id === TWITCH_ID) {
                // Save the access and refresh tokens for VJJ.
                redis.set(VJJ_ACCESS_TOKEN, accessToken);
                redis.set(VJJ_REFRESH_TOKEN, refreshToken);
            }

            try {
                const user = await User.getOrCreateUser(profile.id, {
                    name: profile.display_name,
                    email: profile.email
                });
                done(null, user);
            } catch (e) {
                done(e);
            }
        },
    );

    strategy.name = name;

    return strategy;
}

export const adminTwitchStrategy = getStrategy(ADMIN_NAME, true);
export const twitchStrategy = getStrategy(DEFAULT_NAME);
