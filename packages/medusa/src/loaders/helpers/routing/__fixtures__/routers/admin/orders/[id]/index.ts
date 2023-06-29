import { Request, Response } from 'express';

export async function getAdminOrderById(
    req: Request,
    res: Response,
): Promise<void> {
    res.send('hello world');
}

export async function postAdminOrderById(
    req: Request,
    res: Response,
): Promise<void> {
    res.send('hello world');
}

export const config = {
    routes: [{
        method: 'get',
        handlers: [getAdminOrderById],
    }, {
        method: 'post',
        handlers: [postAdminOrderById],
    }],
};
