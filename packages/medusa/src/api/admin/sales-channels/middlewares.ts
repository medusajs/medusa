import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import { maybeApplyLinkFilter, MiddlewareRoute } from "@medusajs/framework/http"
import { PolicyOperation } from "@medusajs/framework/utils"
import { createLinkBody } from "../../utils/validators"
import * as QueryConfig from "./query-config"
import { Entities } from "./query-config"
import {
  AdminCreateSalesChannel,
  AdminGetSalesChannelParams,
  AdminGetSalesChannelsParams,
  AdminUpdateSalesChannel,
} from "./validators"

export const adminSalesChannelRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/admin/sales-channels/*",
    policies: [
      {
        resource: Entities.sales_channel,
        operation: PolicyOperation.read,
      },
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/sales-channels",
    middlewares: [
      validateAndTransformQuery(
        AdminGetSalesChannelsParams,
        QueryConfig.listTransformQueryConfig
      ),
      maybeApplyLinkFilter({
        entryPoint: "sales_channel_location",
        resourceId: "sales_channel_id",
        filterableField: "location_id",
      }),
      maybeApplyLinkFilter({
        entryPoint: "publishable_api_key_sales_channel",
        resourceId: "sales_channel_id",
        filterableField: "publishable_key_id",
      }),
    ],
    policies: [
      {
        resource: Entities.sales_channel,
        operation: PolicyOperation.read,
      },
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/sales-channels/:id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetSalesChannelParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/sales-channels",
    middlewares: [
      validateAndTransformBody(AdminCreateSalesChannel),
      validateAndTransformQuery(
        AdminGetSalesChannelParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.sales_channel,
        operation: PolicyOperation.create,
      },
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/sales-channels/:id",
    middlewares: [
      validateAndTransformBody(AdminUpdateSalesChannel),
      validateAndTransformQuery(
        AdminGetSalesChannelParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.sales_channel,
        operation: PolicyOperation.update,
      },
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/sales-channels/:id",
    middlewares: [],
    policies: [
      {
        resource: Entities.sales_channel,
        operation: PolicyOperation.delete,
      },
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/sales-channels/:id/products",
    middlewares: [
      validateAndTransformBody(createLinkBody()),
      validateAndTransformQuery(
        AdminGetSalesChannelParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.sales_channel,
        operation: PolicyOperation.update,
      },
    ],
  },
]
