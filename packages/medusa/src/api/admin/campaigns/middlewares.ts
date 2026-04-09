import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import { MiddlewareRoute } from "@medusajs/framework/http"
import { PolicyOperation } from "@medusajs/framework/utils"
import { createLinkBody } from "../../utils/validators"
import * as QueryConfig from "./query-config"
import { Entities } from "./query-config"
import {
  AdminCreateCampaign,
  AdminGetCampaignParams,
  AdminGetCampaignsParams,
  AdminUpdateCampaign,
} from "./validators"

export const adminCampaignRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/admin/campaigns/*",
    policies: [
      {
        resource: Entities.campaign,
        operation: PolicyOperation.read,
      },
    ],
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
    policies: [
      {
        resource: Entities.campaign,
        operation: PolicyOperation.read,
      },
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
    policies: [
      {
        resource: Entities.campaign,
        operation: PolicyOperation.create,
      },
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
    policies: [
      {
        resource: Entities.campaign,
        operation: PolicyOperation.update,
      },
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
    policies: [
      {
        resource: Entities.campaign,
        operation: PolicyOperation.update,
      },
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/campaigns/:id",
    policies: [
      {
        resource: Entities.campaign,
        operation: PolicyOperation.delete,
      },
    ],
  },
]
