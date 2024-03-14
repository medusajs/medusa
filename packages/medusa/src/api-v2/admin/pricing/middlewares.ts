import { transformBody, transformQuery } from "../../../api/middlewares"
import { MiddlewareRoute } from "../../../loaders/helpers/routing/types"
import { authenticate } from "../../../utils/authenticate-middleware"
import * as QueryConfig from "./query-config"
import {
  AdminDeletePricingRuleTypesRuleTypeReq,
  AdminGetPricingRuleTypesParams,
  AdminGetPricingRuleTypesRuleTypeParams,
  AdminPostPricingRuleTypesReq,
  AdminPostPricingRuleTypesRuleTypeReq,
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
    method: ["POST"],
    matcher: "/admin/pricing/rule-types",
    middlewares: [transformBody(AdminPostPricingRuleTypesReq)],
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
  {
    method: ["POST"],
    matcher: "/admin/pricing/rule-types/:id",
    middlewares: [transformBody(AdminPostPricingRuleTypesRuleTypeReq)],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/pricing/rule-types/:id",
    middlewares: [transformBody(AdminDeletePricingRuleTypesRuleTypeReq)],
  },
]
