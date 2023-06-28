import { Request, Response } from 'express';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function listProducts(req: Request, res: Response): Promise<void> {
    console.log('hello world');
}

export async function listProducts2(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    req: Request,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    res: Response,
): Promise<void> {
    console.log('hello world');
}

export const config = {
    routes: [{
        method: 'get',
        handlers: [listProducts],
    }, {
        method: 'post',
        handlers: [listProducts],
    }],
};
