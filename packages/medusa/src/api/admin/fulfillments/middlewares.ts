import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import { MiddlewareRoute } from "@medusajs/framework/http"
import { PolicyOperation } from "@medusajs/framework/utils"
import * as QueryConfig from "./query-config"
import { Entities } from "./query-config"
import {
  AdminCreateFulfillment,
  AdminCreateShipment,
  AdminFulfillmentParams,
} from "./validators"

export const adminFulfillmentsRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/admin/fulfillments/*",
    policies: [
      {
        resource: Entities.fulfillment,
        operation: PolicyOperation.read,
      },
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/fulfillments/:id/cancel",
    middlewares: [
      validateAndTransformQuery(
        AdminFulfillmentParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.fulfillment,
        operation: PolicyOperation.update,
      },
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
    policies: [
      {
        resource: Entities.fulfillment,
        operation: PolicyOperation.create,
      },
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
    policies: [
      {
        resource: Entities.fulfillment,
        operation: PolicyOperation.update,
      },
    ],
  },
]
