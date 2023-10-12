import { NextFunction, Request, Response } from "express"
import type { MiddlewareConfig } from "../../types"

export const globalCustomersMiddlewareMock = jest.fn()

function middleware(req: Request, res: Response, next: NextFunction) {
  globalCustomersMiddlewareMock()
  next()
}

export const config: MiddlewareConfig = {
  routes: [
    {
      matcher: "/customers/*",
      middlewares: [middleware],
    },
  ],
}
