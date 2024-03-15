import { transformBody } from "../../../api/middlewares"
import { MiddlewareRoute } from "../../../loaders/helpers/routing/types"
import { authenticate } from "../../../utils/authenticate-middleware"
import {
  AdminPostFulfillmentShippingOptionsRulesBatchAddReq,
  AdminPostFulfillmentShippingOptionsRulesBatchRemoveReq,
} from "./validators"

export const adminFulfillmentRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/admin/fulfillment*",
    middlewares: [authenticate("admin", ["bearer", "session"])],
  },
  {
    method: ["POST"],
    matcher: "/admin/fulfillment/shipping-options/:id/rules/batch/add",
    middlewares: [
      transformBody(AdminPostFulfillmentShippingOptionsRulesBatchAddReq),
    ],
  },

  {
    method: ["POST"],
    matcher: "/admin/fulfillment/shipping-options/:id/rules/batch/remove",
    middlewares: [
      transformBody(AdminPostFulfillmentShippingOptionsRulesBatchRemoveReq),
    ],
  },
]
