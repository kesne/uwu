import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import passport from 'passport';
import cors from 'cors';
import path from 'path';
import session from 'express-session';
import createRedisStore from 'connect-redis';
import { User } from '@prisma/photon';
import { schema } from './schema';
import { photon, createContext } from './context';
import redis from './redis';
import { PORT, SESSION_SECRET } from './constants';
import Twitch from './Twitch';
import twitchStrategy from './twitchStrategy';

async function main() {
    const twitch = new Twitch();
    await twitch.ready();

    const app = express();

    if (process.env.NODE_ENV === 'production') {
        app.use(express.static(path.join(__dirname, '..', '..', 'frontend', 'build')));
    }

    const server = new ApolloServer({
        schema,
        context: createContext(twitch.client),
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
            secret: SESSION_SECRET,
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
        // We apply CORS to all paths, so don't have Apollo handle CORS:
        cors: false,
    });

    app.listen(PORT, () => {
        console.log(`🚀 Server ready at port ${PORT}`);
    });
}

main().catch(console.error);
