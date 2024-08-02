import { NextFunction, raw, Request, Response } from "express"
import {
  customersCreateMiddlewareMock,
  customersGlobalMiddlewareMock,
  storeGlobalMiddlewareMock,
} from "../mocks"
import { defineMiddlewares } from "../../utils/define-middlewares"

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

export default defineMiddlewares([
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
])
