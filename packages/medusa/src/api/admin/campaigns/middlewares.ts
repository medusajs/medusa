import { MiddlewareRoute } from "@medusajs/framework/http"
import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import { createLinkBody } from "../../utils/validators"
import * as QueryConfig from "./query-config"
import {
  AdminCreateCampaign,
  AdminGetCampaignParams,
  AdminGetCampaignsParams,
  AdminUpdateCampaign,
} from "./validators"

export const adminCampaignRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/admin/campaigns",
    middlewares: [
      validateAndTransformQuery(
        AdminGetCampaignsParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/campaigns",
    middlewares: [
      validateAndTransformBody(AdminCreateCampaign),
      validateAndTransformQuery(
        AdminGetCampaignParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/campaigns/:id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetCampaignParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/campaigns/:id",
    middlewares: [
      validateAndTransformBody(AdminUpdateCampaign),
      validateAndTransformQuery(
        AdminGetCampaignParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/campaigns/:id/promotions",
    middlewares: [
      validateAndTransformBody(createLinkBody()),
      validateAndTransformQuery(
        AdminGetCampaignParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
]
