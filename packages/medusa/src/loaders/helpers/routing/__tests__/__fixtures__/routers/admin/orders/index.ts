import { Request, Response } from 'express';

export function getIgnore(req: Request, res: Response) {
    res.send('hello world');
}

export const config = {
    ignore: true,
    routes: [{
        method: 'get',
        handlers: [getIgnore],
    }],
};
