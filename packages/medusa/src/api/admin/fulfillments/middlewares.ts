import { MiddlewareRoute } from "@medusajs/framework/http"
import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import * as QueryConfig from "./query-config"
import {
  AdminCreateFulfillment,
  AdminCreateShipment,
  AdminFulfillmentParams,
} from "./validators"

export const adminFulfillmentsRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["POST"],
    matcher: "/admin/fulfillments/:id/cancel",
    middlewares: [
      validateAndTransformQuery(
        AdminFulfillmentParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/fulfillments",
    middlewares: [
      validateAndTransformBody(AdminCreateFulfillment),
      validateAndTransformQuery(
        AdminFulfillmentParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/fulfillments/:id/shipment",
    middlewares: [
      validateAndTransformBody(AdminCreateShipment),
      validateAndTransformQuery(
        AdminFulfillmentParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
]
