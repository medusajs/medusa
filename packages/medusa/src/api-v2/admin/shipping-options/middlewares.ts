import { MiddlewareRoute } from "../../../loaders/helpers/routing/types"
import { authenticate } from "../../../utils/authenticate-middleware"
import {
  AdminCreateShippingOption,
  AdminGetShippingOptionParams,
  AdminShippingOptionRulesBatchAdd,
  AdminShippingOptionRulesBatchRemove,
} from "./validators"
import { retrieveTransformQueryConfig } from "./query-config"
import { validateAndTransformBody } from "../../utils/validate-body"
import { validateAndTransformQuery } from "../../utils/validate-query"

export const adminShippingOptionRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/admin/shipping-options*",
    middlewares: [authenticate("admin", ["bearer", "session"])],
  },

  {
    method: ["POST"],
    matcher: "/admin/shipping-options",
    middlewares: [
      validateAndTransformQuery(
        AdminGetShippingOptionParams,
        retrieveTransformQueryConfig
      ),
      validateAndTransformBody(AdminCreateShippingOption),
    ],
  },

  {
    method: ["POST"],
    matcher: "/admin/shipping-options/:id/rules/batch/add",
    middlewares: [
      validateAndTransformQuery(
        AdminGetShippingOptionParams,
        retrieveTransformQueryConfig
      ),
      validateAndTransformBody(AdminShippingOptionRulesBatchAdd),
    ],
  },

  {
    method: ["POST"],
    matcher: "/admin/shipping-options/:id/rules/batch/remove",
    middlewares: [
      validateAndTransformQuery(
        AdminGetShippingOptionParams,
        retrieveTransformQueryConfig
      ),
      validateAndTransformBody(AdminShippingOptionRulesBatchRemove),
    ],
  },
]
