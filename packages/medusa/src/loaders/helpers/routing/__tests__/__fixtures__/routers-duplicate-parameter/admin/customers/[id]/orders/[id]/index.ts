import { Request, Response } from 'express';

export const getAdminOrdersIdMock = jest.fn();
export const postAdminOrdersIdMock = jest.fn();

export async function getAdminOrderById(
    req: Request,
    res: Response,
): Promise<void> {
    getAdminOrdersIdMock();
    res.send('hello world');
}

export async function postAdminOrderById(
    req: Request,
    res: Response,
): Promise<void> {
    postAdminOrdersIdMock();
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
