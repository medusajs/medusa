import { NextFunction, Request, Response } from "express"

export const globalCustomersMiddlewareMock = jest.fn()

function middleware(req: Request, res: Response, next: NextFunction) {
  globalCustomersMiddlewareMock()
  next()
}

export const config = {
  routes: [
    {
      path: "/customers/*",
      middlewares: [middleware],
    },
  ],
}
