import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import { MiddlewareRoute } from "@medusajs/framework/http"
import { PolicyOperation } from "@medusajs/framework/utils"
import * as QueryConfig from "./query-config"
import { Entities } from "./query-config"
import {
  AdminOrderChangeParams,
  AdminPostOrderChangesReqSchema,
} from "./validators"

export const adminOrderChangesRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/admin/order-changes/*",
    policies: [
      {
        resource: Entities.order_change,
        operation: PolicyOperation.read,
      },
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/order-changes/:id",
    middlewares: [
      validateAndTransformBody(AdminPostOrderChangesReqSchema),
      validateAndTransformQuery(
        AdminOrderChangeParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.order_change,
        operation: PolicyOperation.update,
      },
    ],
  },
]
