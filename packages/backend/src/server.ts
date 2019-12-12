import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import passport from 'passport';
import redis from 'redis';
import cors from 'cors';
import { Strategy } from 'passport-twitch.js';
import session from 'express-session';
import createRedisStore from 'connect-redis';
import { User } from '@prisma/photon';
import { schema } from './schema';
import { photon, createContext } from './context';
import CommandManager from './commands';

CommandManager.connect();

const app = express();

const server = new ApolloServer({
    schema,
    context: createContext,
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
        callbackURL: 'http://localhost:4000/auth/twitch/callback',
        scope: ['user:read:email', 'channel:read:subscriptions'],
    },
    (_accessToken, _refreshToken, profile, done) => {
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
                    tokenGrants: {
                        create: {
                            tokens: 1,
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
const redisClient = redis.createClient();

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
        store: new RedisStore({ client: redisClient }),
    }),
    passport.initialize(),
    passport.session(),
);

app.get('/login', passport.authenticate('twitch.js'));

app.get(
    '/auth/twitch/callback',
    passport.authenticate('twitch.js', { failureRedirect: '/' }),
    (_req, res) => {
        res.redirect('http://localhost:1234');
    },
);

server.applyMiddleware({
    app,
    path: '/graphql',
    cors: false,
});

app.listen(4000, () => {
    console.log('🚀 Server ready at: http://localhost:4000');
});
