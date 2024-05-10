import { MiddlewareRoute } from "../../../loaders/helpers/routing/types"
import { authenticate } from "../../../utils/authenticate-middleware"
import { validateAndTransformBody } from "../../utils/validate-body"
import { validateAndTransformQuery } from "../../utils/validate-query"
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
    matcher: "/admin/campaigns*",
    middlewares: [authenticate("admin", ["bearer", "session", "api-key"])],
  },
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
