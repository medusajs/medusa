import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import { authorize, MiddlewareRoute } from "@medusajs/framework/http"
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
    middlewares: [
      authorize([
        {
          resource: Entities.order_change,
          operation: PolicyOperation.read,
        },
      ]),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/order-changes/:id",
    middlewares: [
      authorize([
        {
          resource: Entities.order_change,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminPostOrderChangesReqSchema),
      validateAndTransformQuery(
        AdminOrderChangeParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
]
