import { Request, Response } from 'express';
import { User } from './entity/User';

export type Context = {
    user: User;
    req: Request;
    res: Response;
};

export const createContext = ({ req, res }: { req: Request; res: Response }) => {
    return {
        user: req.user,
        req,
        res,
    };
};
