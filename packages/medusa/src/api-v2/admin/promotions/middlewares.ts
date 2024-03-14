import * as QueryConfig from "./query-config"

import { transformBody, transformQuery } from "../../../api/middlewares"
import {
  AdminGetPromotionsParams,
  AdminGetPromotionsPromotionParams,
  AdminPostPromotionsPromotionReq,
  AdminPostPromotionsPromotionRulesReq,
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
    matcher: "/admin/promotions/:id/rules",
    middlewares: [transformBody(AdminPostPromotionsPromotionRulesReq)],
  },
  {
    method: ["POST"],
    matcher: "/admin/promotions/:id/target-rules",
    middlewares: [transformBody(AdminPostPromotionsPromotionRulesReq)],
  },
  {
    method: ["POST"],
    matcher: "/admin/promotions/:id/buy-rules",
    middlewares: [transformBody(AdminPostPromotionsPromotionRulesReq)],
  },
]
