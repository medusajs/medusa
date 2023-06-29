import { Request, Response } from 'express';

export function create(req: Request, res: Response) {
    res.send('create customers');
}

export const config = {
    routes: [{
        method: 'post',
        handlers: [create],
    }],
};
