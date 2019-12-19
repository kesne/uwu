import { Strategy } from 'passport-twitch.js';
import {
    TWITCH_CLIENT_ID,
    TWITCH_CLIENT_SECRET,
    TWITCH_ID,
} from './constants';
import twitch from './twitch';
import { User } from './entity/User';

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
                twitch.provideCredentials(accessToken, refreshToken);
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
