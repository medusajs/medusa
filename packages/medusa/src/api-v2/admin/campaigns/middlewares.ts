import * as QueryConfig from "./query-config"

import {
  AdminGetCampaignsCampaignParams,
  AdminGetCampaignsParams,
  AdminPostCampaignsCampaignReq,
  AdminPostCampaignsReq,
} from "./validators"
import {
  isFeatureFlagEnabled,
  transformBody,
  transformQuery,
} from "../../../api/middlewares"

import { MedusaV2Flag } from "@medusajs/utils"
import { MiddlewareRoute } from "../../../loaders/helpers/routing/types"
import { authenticate } from "../../../utils/authenticate-middleware"

export const adminCampaignRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/admin/campaigns*",
    middlewares: [authenticate("admin", ["bearer", "session"])],
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
    method: ["POST"],
    matcher: "/admin/campaigns",
    middlewares: [transformBody(AdminPostCampaignsReq)],
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
  {
    method: ["POST"],
    matcher: "/admin/campaigns/:id",
    middlewares: [transformBody(AdminPostCampaignsCampaignReq)],
  },
]
