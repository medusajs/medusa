import { NextFunction, Request, Response } from 'express';

export function list(req: Request, res: Response) {
    res.send('list customers');
}

export const config = {
    routes: [{
        method: 'get',
        handlers: [list],
    }, {
        method: 'all',
        handlers: [(req: Request, res: Response, next: NextFunction) => {
            req.params._something = 'test';
            next();
        }],
    }],
};
