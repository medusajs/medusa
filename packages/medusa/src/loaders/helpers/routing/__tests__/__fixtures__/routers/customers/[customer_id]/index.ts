import { Request, Response } from 'express';

export function get(req: Request, res: Response) {
    res.send('list customers');
}

export const config = {
    routes: [{
        method: 'get',
        handlers: [get],
    }],
};
