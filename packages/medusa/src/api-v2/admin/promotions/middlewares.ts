import * as QueryConfig from "./query-config"

import { transformBody, transformQuery } from "../../../api/middlewares"
import {
  AdminGetPromotionsParams,
  AdminGetPromotionsPromotionParams,
  AdminPostPromotionsPromotionReq,
  AdminPostPromotionsPromotionRulesBatchAddReq,
  AdminPostPromotionsPromotionRulesBatchRemoveReq,
  AdminPostPromotionsReq,
} from "./validators"

import { MiddlewareRoute } from "../../../loaders/helpers/routing/types"
import { authenticate } from "../../../utils/authenticate-middleware"

export const adminPromotionRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/admin/promotions*",
    middlewares: [authenticate("admin", ["bearer", "session"])],
  },
  {
    method: ["GET"],
    matcher: "/admin/promotions",
    middlewares: [
      transformQuery(
        AdminGetPromotionsParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/promotions",
    middlewares: [transformBody(AdminPostPromotionsReq)],
  },
  {
    method: ["GET"],
    matcher: "/admin/promotions/:id",
    middlewares: [
      transformQuery(
        AdminGetPromotionsPromotionParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/promotions/:id",
    middlewares: [transformBody(AdminPostPromotionsPromotionReq)],
  },
  {
    method: ["POST"],
    matcher: "/admin/promotions/:id/rules/batch/add",
    middlewares: [transformBody(AdminPostPromotionsPromotionRulesBatchAddReq)],
  },
  {
    method: ["POST"],
    matcher: "/admin/promotions/:id/target-rules/batch/add",
    middlewares: [transformBody(AdminPostPromotionsPromotionRulesBatchAddReq)],
  },
  {
    method: ["POST"],
    matcher: "/admin/promotions/:id/buy-rules/batch/add",
    middlewares: [transformBody(AdminPostPromotionsPromotionRulesBatchAddReq)],
  },
  {
    method: ["POST"],
    matcher: "/admin/promotions/:id/rules/batch/remove",
    middlewares: [
      transformBody(AdminPostPromotionsPromotionRulesBatchRemoveReq),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/promotions/:id/target-rules/batch/remove",
    middlewares: [
      transformBody(AdminPostPromotionsPromotionRulesBatchRemoveReq),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/promotions/:id/buy-rules/batch/remove",
    middlewares: [
      transformBody(AdminPostPromotionsPromotionRulesBatchRemoveReq),
    ],
  },
]
