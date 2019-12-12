import TwitchClient from 'twitch';
import { Photon, User } from '@prisma/photon';
import { Request, Response } from 'express';
import { getClient } from './twitch';

export interface Context {
    user: User;
    req: Request;
    res: Response;
    photon: Photon;
    twitch: TwitchClient;
}

export const photon = new Photon();

export async function createContext({ req, res }: { req: Request; res: Response }) {
    const twitch = await getClient();

    return {
        user: req.user,
        req,
        res,
        photon,
        twitch,
    };
}
