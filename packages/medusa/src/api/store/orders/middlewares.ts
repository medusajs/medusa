import { validateAndTransformQuery } from "@medusajs/framework"
import {
  MiddlewareRoute,
  validateAndTransformBody,
} from "@medusajs/framework/http"
import { authenticate } from "../../../utils/middlewares/authenticate-middleware"
import * as QueryConfig from "./query-config"
import {
  StoreAcceptOrderTransfer,
  StoreGetOrderParams,
  StoreGetOrdersParams,
  StoreRequestOrderTransfer,
  StoreDeclineOrderTransferRequest,
} from "./validators"

export const storeOrderRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/store/orders",
    middlewares: [
      authenticate("customer", ["session", "bearer"]),
      validateAndTransformQuery(
        StoreGetOrdersParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/store/orders/:id",
    middlewares: [
      validateAndTransformQuery(
        StoreGetOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/store/orders/:id/transfer/request",
    middlewares: [
      authenticate("customer", ["session", "bearer"]),
      validateAndTransformBody(StoreRequestOrderTransfer),
      validateAndTransformQuery(
        StoreGetOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/store/orders/:id/transfer/cancel",
    middlewares: [
      authenticate("customer", ["session", "bearer"]),
      validateAndTransformQuery(
        StoreGetOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/store/orders/:id/transfer/accept",
    middlewares: [
      validateAndTransformBody(StoreAcceptOrderTransfer),
      validateAndTransformQuery(
        StoreGetOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/store/orders/:id/transfer/decline",
    middlewares: [
      validateAndTransformBody(StoreDeclineOrderTransferRequest),
      validateAndTransformQuery(
        StoreGetOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
]
