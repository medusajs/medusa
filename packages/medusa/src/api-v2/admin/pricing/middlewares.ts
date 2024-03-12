import { transformQuery } from "../../../api/middlewares"
import { MiddlewareRoute } from "../../../loaders/helpers/routing/types"
import { authenticate } from "../../../utils/authenticate-middleware"
import * as QueryConfig from "./query-config"
import {
  AdminGetPricingRuleTypesParams,
  AdminGetPricingRuleTypesRuleTypeParams,
} from "./validators"

export const adminPricingRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/admin/pricing*",
    middlewares: [authenticate("admin", ["bearer", "session"])],
  },
  {
    method: ["GET"],
    matcher: "/admin/pricing/rule-types",
    middlewares: [
      transformQuery(
        AdminGetPricingRuleTypesParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/pricing/rule-types/:id",
    middlewares: [
      transformQuery(
        AdminGetPricingRuleTypesRuleTypeParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
]
