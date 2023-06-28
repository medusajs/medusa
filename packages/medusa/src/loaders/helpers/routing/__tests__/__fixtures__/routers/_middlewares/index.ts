import { NextFunction, Request, Response } from 'express';

const globalMiddlewareMock = jest.fn();

function middleware(req: Request, res: Response, next: NextFunction) {
    globalMiddlewareMock();
    next();
}

export const config = {
    routes: [{
        path: '/customers/*',
        middlewares: [middleware],
    }],
};
