import { MiddlewareRoute } from "../../../loaders/helpers/routing/types"
import { authenticate } from "../../../utils/middlewares/authenticate-middleware"
import {
  AdminCreateShippingOption,
  AdminCreateShippingOptionRule,
  AdminGetShippingOptionParams,
  AdminGetShippingOptionRuleParams,
  AdminGetShippingOptionsParams,
  AdminUpdateShippingOption,
  AdminUpdateShippingOptionRule,
} from "./validators"
import {
  listTransformQueryConfig,
  retrieveRuleTransformQueryConfig,
  retrieveTransformQueryConfig,
} from "./query-config"
import { validateAndTransformBody } from "../../utils/validate-body"
import { validateAndTransformQuery } from "../../utils/validate-query"
import { createBatchBody } from "../../utils/validators"

export const adminShippingOptionRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/admin/shipping-options*",
    middlewares: [authenticate("admin", ["bearer", "session"])],
  },
  {
    method: ["GET"],
    matcher: "/admin/shipping-options",
    middlewares: [
      validateAndTransformQuery(
        AdminGetShippingOptionsParams,
        listTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/shipping-options",
    middlewares: [
      validateAndTransformBody(AdminCreateShippingOption),
      validateAndTransformQuery(
        AdminGetShippingOptionParams,
        retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/shipping-options/:id",
    middlewares: [
      validateAndTransformBody(AdminUpdateShippingOption),
      validateAndTransformQuery(
        AdminGetShippingOptionParams,
        retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/shipping-options/:id",
  },
  {
    method: ["POST"],
    matcher: "/admin/shipping-options/:id/rules/batch",
    middlewares: [
      validateAndTransformBody(
        createBatchBody(
          AdminCreateShippingOptionRule,
          AdminUpdateShippingOptionRule
        )
      ),
      validateAndTransformQuery(
        AdminGetShippingOptionRuleParams,
        retrieveRuleTransformQueryConfig
      ),
    ],
  },
]
