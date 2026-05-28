import { validateAndTransformBody } from "@medusajs/framework"
import { MiddlewareRoute } from "@medusajs/medusa"

import { AdminRefundOrderToStoreCreditParams } from "./validators"

export const adminRefundOrderToStoreCreditMiddlewares: MiddlewareRoute[] = [
  {
    method: ["POST"],
    matcher: "/admin/orders/:id/refund-to-store-credit",
    middlewares: [
      validateAndTransformBody(AdminRefundOrderToStoreCreditParams),
    ],
  },
]
