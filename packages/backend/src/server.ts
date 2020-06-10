import http from 'http';
import * as Sentry from '@sentry/node';
import { createConnection } from 'typeorm';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import passport from 'passport';
import cors from 'cors';
import path from 'path';
import session from 'express-session';
import createRedisStore from 'connect-redis';
import typeDefs from './typeDefs';
import { createContext } from './context';
import redis from './redis';
import { PORT, SESSION_SECRET } from './constants';
import twitch from './twitch';
import { twitchStrategy, adminTwitchStrategy } from './twitchStrategy';
import websocket from './websocket';
import resolvers from './resolvers';
import { User } from './entity/User';

Sentry.init({ dsn: 'https://2c17cfce9294493bb3621acb6dbe74ab@sentry.io/1886220' });

async function main() {
    await twitch.ready();

    console.log('Connected to Twitch');

    createConnection(require('../ormconfig.js')).then(() => {
        console.log('== Connected to the database');
    }, (e) => {
        console.log('== Error connecting to database!');
        console.log(e);
    });

    const app = express();
    const server = http.createServer(app);

    if (process.env.NODE_ENV === 'production') {
        app.use(express.static(path.join(__dirname, '..', '..', 'frontend', 'dist')));
    }

    const graphQLServer = new ApolloServer({
        typeDefs,
        resolvers,
        context: createContext,
        playground: {
            settings: {
                'request.credentials': 'include',
            },
        },
    });

    passport.serializeUser<User, string>((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser<User, string>((id, done) => {
        User.findOne(id).then(
            (user) => done(null, user || undefined),
            (e) => done(e),
        );
    });

    passport.use(twitchStrategy);
    passport.use(adminTwitchStrategy);

    const RedisStore = createRedisStore(session);

    app.use(
        cors({
            origin: true,
            credentials: true,
        }),
        session({
            name: 'uwu.id',
            secret: SESSION_SECRET,
            saveUninitialized: true,
            resave: false,
            store: new RedisStore({ client: redis }),
        }),
        passport.initialize(),
        passport.session(),
    );

    app.get('/api/login', passport.authenticate(twitchStrategy.name));
    app.get('/api/login/admin', passport.authenticate(adminTwitchStrategy.name));

    app.get(
        '/api/auth/twitch/callback',
        passport.authenticate(twitchStrategy.name, {
            failureRedirect: '/',
        }),
        (req, res) => {
            // @ts-ignore
            if (req.user && req.user.needsRedirectToAdmin) {
                req.session!.destroy(() => {
                    res.redirect('/api/login/admin');
                });
            } else {
                res.redirect('/');
            }
        },
    );

    app.get(
        '/api/auth/twitch/callback/admin',
        passport.authenticate(adminTwitchStrategy.name, {
            failureRedirect: '/',
        }),
        (_req, res) => {
            res.redirect('/');
        },
    );

    graphQLServer.applyMiddleware({
        app,
        path: '/api/graphql',
        // We apply CORS to all paths, so don't have Apollo handle CORS:
        cors: false,
    });

    console.log('Trying to bind to port');

    server.listen(PORT, () => {
        console.log(`🚀 Server ready at port ${PORT}`);
    });

    websocket(server);
}

main().catch(console.error);
