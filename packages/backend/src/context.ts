import TwitchClient from 'twitch';
import { Photon, User } from '@prisma/photon';
import { Request, Response } from 'express';

export interface Context {
    user: User;
    req: Request;
    res: Response;
    photon: Photon;
    twitch: TwitchClient;
}

export const photon = new Photon();

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
        photon,
        twitch,
    };
};
