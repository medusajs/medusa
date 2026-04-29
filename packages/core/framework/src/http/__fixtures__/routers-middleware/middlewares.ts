import { raw } from "express"
import { z } from "../../../deps/zod"
import { MedusaNextFunction, MedusaRequest, MedusaResponse } from "../../types"
import { defineMiddlewares } from "../../utils/define-middlewares"
import {
  customersCreateMiddlewareMock,
  customersCreateMiddlewareValidatorMock,
  customersGlobalMiddlewareMock,
  storeGlobalMiddlewareMock,
} from "../mocks"

const customersGlobalMiddleware = (
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) => {
  customersGlobalMiddlewareMock()
  next()
}

const customersCreateMiddleware = (
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) => {
  if (req.additionalDataValidator) {
    customersCreateMiddlewareValidatorMock()
  }
  customersCreateMiddlewareMock()
  next()
}

const storeGlobal = (
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) => {
  storeGlobalMiddlewareMock()
  next()
}

const middlewares = defineMiddlewares([
  {
    matcher: "/customers",
    middlewares: [customersGlobalMiddleware],
  },
  {
    method: ["ALL"],
    matcher: "/v1*",
    bodyParser: {
      sizeLimit: "500kb",
    },
    middlewares: [],
  },
  {
    method: "POST",
    matcher: "/customers",
    additionalDataValidator: {
      group_id: z.string(),
    },
    middlewares: [customersCreateMiddleware],
  },
  {
    matcher: "/store/*",
    middlewares: [storeGlobal],
  },
  {
    matcher: "/webhooks",
    bodyParser: {
      preserveRawBody: true,
    },
  },
  {
    matcher: "/webhooks/*",
    method: "POST",
    bodyParser: false,
    middlewares: [raw({ type: "application/json" })],
  },
])

export default middlewares
