import TwitchClient from 'twitch';
import { Request, Response } from 'express';
import { User } from './entity/User';

export type Context = {
    user: User;
    req: Request;
    res: Response;
    twitch: TwitchClient;
};

export const createContext = (twitch: TwitchClient) => ({
    req,
    res,
}: {
    req: Request;
    res: Response;
}) => {
    return {
        user: req.user,
        req,
        res,
        twitch,
    };
};
