import { NextFunction, Request, Response, raw } from "express"
import {
  customersCreateMiddlewareMock,
  customersGlobalMiddlewareMock,
  storeGlobalMiddlewareMock,
} from "../mocks"
import { defineRoutesConfig } from "../../../../../utils/define-routes-config"

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

export default defineRoutesConfig([
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
