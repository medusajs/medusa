import { NextFunction, Request, Response, json, raw } from "express"
import { MiddlewaresConfig } from "../../types"
import {
  customersCreateMiddlewareMock,
  customersGlobalMiddlewareMock,
  storeCorsMiddlewareMock,
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

const storeCors = (req: Request, res: Response, next: NextFunction) => {
  storeCorsMiddlewareMock()
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
      middlewares: [storeCors],
    },
    {
      matcher: "/webhooks/orders",
      method: "POST",
      middlewares: [json()],
    },
    {
      matcher: "/webhooks/*",
      method: "POST",
      bodyParser: false,
      middlewares: [raw({ type: "application/json" })],
    },
  ],
}
