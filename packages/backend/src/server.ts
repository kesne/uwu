import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import passport from 'passport';
import cors from 'cors';
import { Strategy } from 'passport-twitch.js';
import session from 'express-session';
import createRedisStore from 'connect-redis';
import { User } from '@prisma/photon';
import { schema } from './schema';
import { photon, createContext } from './context';
import redis from './redis';
import { TWITCH_ID, VJJ_ACCESS_TOKEN, VJJ_REFRESH_TOKEN } from './constants';
import Twitch from './Twitch';

async function main() {
    const twitch = new Twitch();
    await twitch.ready();

    const app = express();

    const server = new ApolloServer({
        schema,
        context: createContext(twitch.client),
        playground: {
            settings: {
                'request.credentials': 'include',
            },
        },
    });

    const twitchStrategy = new Strategy(
        {
            clientID: process.env.TWITCH_CLIENT_ID as string,
            clientSecret: process.env.TWITCH_CLIENT_SECRET as string,
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
                                reason:
                                    'Logging in to UwU without a subscription, because I love you.',
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

    passport.serializeUser<User, string>((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser<User, string>((id, done) => {
        photon.users.findOne({ where: { id } }).then(
            user => done(null, user || undefined),
            e => done(e),
        );
    });

    passport.use(twitchStrategy);

    const RedisStore = createRedisStore(session);

    app.use(
        cors({
            origin: true,
            credentials: true,
        }),
        session({
            name: 'uwu.id',
            secret: 'cats',
            saveUninitialized: true,
            resave: false,
            store: new RedisStore({ client: redis }),
        }),
        passport.initialize(),
        passport.session(),
    );

    app.get('/api/login', passport.authenticate('twitch.js'));

    app.get(
        '/api/auth/twitch/callback',
        passport.authenticate('twitch.js', { failureRedirect: '/' }),
        (_req, res) => {
            res.redirect('/');
        },
    );

    server.applyMiddleware({
        app,
        path: '/api/graphql',
        cors: false,
    });

    const PORT = process.env.PORT || 4000;

    app.listen(PORT, () => {
        console.log(`🚀 Server ready at port ${PORT}`);
    });
}

main().catch(console.error);
