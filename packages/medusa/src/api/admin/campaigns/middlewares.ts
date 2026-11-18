import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import { authorize, MiddlewareRoute } from "@medusajs/framework/http"
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
    middlewares: [
      authorize([
        {
          resource: Entities.campaign,
          operation: PolicyOperation.read,
        },
      ]),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/campaigns",
    middlewares: [
      authorize([
        {
          resource: Entities.campaign,
          operation: PolicyOperation.read,
        },
      ]),
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
      authorize([
        {
          resource: Entities.campaign,
          operation: PolicyOperation.create,
        },
      ]),
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
      authorize([
        {
          resource: Entities.campaign,
          operation: PolicyOperation.update,
        },
      ]),
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
      authorize([
        {
          resource: Entities.campaign,
          operation: PolicyOperation.update,
        },
        {
          resource: Entities.promotion,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(createLinkBody()),
      validateAndTransformQuery(
        AdminGetCampaignParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/campaigns/:id",
    middlewares: [
      authorize([
        {
          resource: Entities.campaign,
          operation: PolicyOperation.delete,
        },
      ]),
    ],
  },
]
