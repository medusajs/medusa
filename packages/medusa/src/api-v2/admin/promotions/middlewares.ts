import { MedusaV2Flag } from "@medusajs/utils"

import {
  isFeatureFlagEnabled,
  transformBody,
  transformQuery,
} from "../../../api/middlewares"
import { MiddlewareRoute } from "../../../loaders/helpers/routing/types"
import * as QueryConfig from "./query-config"
import {
  AdminGetPromotionsParams,
  AdminGetPromotionsPromotionParams,
  AdminPostPromotionsPromotionReq,
} from "./validators"

export const adminPromotionRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/admin/promotions*",
    middlewares: [isFeatureFlagEnabled(MedusaV2Flag.key)],
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
    middlewares: [transformBody(AdminPostPromotionsPromotionReq)],
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
]
