import { transformBody, transformQuery } from "../../../api/middlewares"
import { MiddlewareRoute } from "../../../loaders/helpers/routing/types"
import { authenticate } from "../../../utils/authenticate-middleware"
import {
  AdminPostFulfillmentShippingOptionsRulesBatchAddParams,
  AdminPostFulfillmentShippingOptionsRulesBatchAddReq,
  AdminPostFulfillmentShippingOptionsRulesBatchRemoveParams,
  AdminPostFulfillmentShippingOptionsRulesBatchRemoveReq,
  AdminPostFulfillmentShippingOptionsShippingOption,
  AdminPostShippingOptionsShippingOptionParams,
} from "./validators"
import { retrieveTransformQueryConfig } from "./query-config"

export const adminFulfillmentRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/admin/fulfillment*",
    middlewares: [authenticate("admin", ["bearer", "session"])],
  },

  {
    method: ["POST"],
    matcher: "/admin/fulfillment/shipping-options",
    middlewares: [
      transformQuery(
        AdminPostShippingOptionsShippingOptionParams,
        retrieveTransformQueryConfig
      ),
      transformBody(AdminPostFulfillmentShippingOptionsShippingOption),
    ],
  },

  {
    method: ["POST"],
    matcher: "/admin/fulfillment/shipping-options/:id/rules/batch/add",
    middlewares: [
      transformQuery(
        AdminPostFulfillmentShippingOptionsRulesBatchAddParams,
        retrieveTransformQueryConfig
      ),
      transformBody(AdminPostFulfillmentShippingOptionsRulesBatchAddReq),
    ],
  },

  {
    method: ["POST"],
    matcher: "/admin/fulfillment/shipping-options/:id/rules/batch/remove",
    middlewares: [
      transformQuery(
        AdminPostFulfillmentShippingOptionsRulesBatchRemoveParams,
        retrieveTransformQueryConfig
      ),
      transformBody(AdminPostFulfillmentShippingOptionsRulesBatchRemoveReq),
    ],
  },
]
