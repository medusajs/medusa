import { transformQuery } from "../../../api/middlewares"
import { MiddlewareRoute } from "../../../loaders/helpers/routing/types"
import { authenticate } from "../../../utils/authenticate-middleware"
import {
  AdminCreateShippingOption,
  AdminCreateShippingOptionRulesBatchAdd,
  AdminCreateShippingOptionRulesBatchRemove,
  AdminPostFulfillmentShippingOptionsRulesBatchAddParams,
  AdminPostFulfillmentShippingOptionsRulesBatchRemoveParams,
  AdminPostShippingOptionsShippingOptionParams,
} from "./validators"
import { retrieveTransformQueryConfig } from "./query-config"
import { validateAndTransformBody } from "../../utils/validate-body"

export const adminFulfillmentRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/admin/shipping-options*",
    middlewares: [authenticate("admin", ["bearer", "session"])],
  },

  {
    method: ["POST"],
    matcher: "/admin/shipping-options",
    middlewares: [
      transformQuery(
        AdminPostShippingOptionsShippingOptionParams,
        retrieveTransformQueryConfig
      ),
      validateAndTransformBody(AdminCreateShippingOption),
    ],
  },

  {
    method: ["POST"],
    matcher: "/admin/shipping-options/:id/rules/batch/add",
    middlewares: [
      transformQuery(
        AdminPostFulfillmentShippingOptionsRulesBatchAddParams,
        retrieveTransformQueryConfig
      ),
      validateAndTransformBody(AdminCreateShippingOptionRulesBatchAdd),
    ],
  },

  {
    method: ["POST"],
    matcher: "/admin/shipping-options/:id/rules/batch/remove",
    middlewares: [
      transformQuery(
        AdminPostFulfillmentShippingOptionsRulesBatchRemoveParams,
        retrieveTransformQueryConfig
      ),
      validateAndTransformBody(AdminCreateShippingOptionRulesBatchRemove),
    ],
  },
]
