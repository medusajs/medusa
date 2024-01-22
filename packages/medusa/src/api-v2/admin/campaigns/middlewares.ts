import { MedusaV2Flag } from "@medusajs/utils"
import { isFeatureFlagEnabled, transformQuery } from "../../../api/middlewares"
import { MiddlewareRoute } from "../../../loaders/helpers/routing/types"
import * as QueryConfig from "./query-config"
import {
  AdminGetCampaignsCampaignParams,
  AdminGetCampaignsParams,
} from "./validators"

export const adminCampaignRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/admin/campaigns*",
    middlewares: [isFeatureFlagEnabled(MedusaV2Flag.key)],
  },
  {
    method: ["GET"],
    matcher: "/admin/campaigns",
    middlewares: [
      transformQuery(
        AdminGetCampaignsParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/campaigns/:id",
    middlewares: [
      transformQuery(
        AdminGetCampaignsCampaignParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
]
