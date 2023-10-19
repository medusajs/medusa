import { NextFunction, Request, Response } from "express"
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
  ],
}
