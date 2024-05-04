import { NextFunction, Request, Response, raw } from "express"
import { MiddlewaresConfig } from "../../types"
import {
  customersCreateMiddlewareMock,
  customersGlobalMiddlewareMock,
  storeGlobalMiddlewareMock,
} from "../mocks"

const customersGlobalMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  customersGlobalMiddlewareMock()
  next()
}

const customersCreateMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  customersCreateMiddlewareMock()
  next()
}

const storeGlobal = (req: Request, res: Response, next: NextFunction) => {
  storeGlobalMiddlewareMock()
  next()
}

export const config: MiddlewaresConfig = {
  routes: [
    {
      matcher: "/customers",
      middlewares: [customersGlobalMiddleware],
    },
    {
      method: "POST",
      matcher: "/customers",
      middlewares: [customersCreateMiddleware],
    },
    {
      matcher: "/store/*",
      middlewares: [storeGlobal],
    },
    {
      matcher: "/webhooks/*",
      method: "POST",
      bodyParser: false,
      middlewares: [raw({ type: "application/json" })],
    },
  ],
}
