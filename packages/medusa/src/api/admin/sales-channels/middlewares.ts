import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import {
  applyCrossModuleFilter,
  authorize,
  MiddlewareRoute,
} from "@medusajs/framework/http"
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
import { createdAuditResource } from "../../utils/audit"

export const adminSalesChannelRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/admin/sales-channels/*",
    middlewares: [
      authorize([
        {
          resource: Entities.sales_channel,
          operation: PolicyOperation.read,
        },
      ]),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/sales-channels",
    middlewares: [
      authorize([
        {
          resource: Entities.sales_channel,
          operation: PolicyOperation.read,
        },
      ]),
      validateAndTransformQuery(
        AdminGetSalesChannelsParams,
        QueryConfig.listTransformQueryConfig
      ),
      applyCrossModuleFilter({
        filterableField: "location_id",
        relationPath: "stock_locations.id",
      }),
      applyCrossModuleFilter({
        filterableField: "publishable_key_id",
        relationPath: "publishable_api_keys.id",
      }),
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
    audit: {
      action: "sales_channel.create",
      resource: createdAuditResource("sales_channel"),
    },
    middlewares: [
      authorize([
        {
          resource: Entities.sales_channel,
          operation: PolicyOperation.create,
        },
      ]),
      validateAndTransformBody(AdminCreateSalesChannel),
      validateAndTransformQuery(
        AdminGetSalesChannelParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/sales-channels/:id",
    middlewares: [
      authorize([
        {
          resource: Entities.sales_channel,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminUpdateSalesChannel),
      validateAndTransformQuery(
        AdminGetSalesChannelParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/sales-channels/:id",
    middlewares: [
      authorize([
        {
          resource: Entities.sales_channel,
          operation: PolicyOperation.delete,
        },
      ]),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/sales-channels/:id/products",
    middlewares: [
      authorize([
        {
          resource: Entities.sales_channel,
          operation: PolicyOperation.update,
        },
        {
          resource: Entities.product,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(createLinkBody()),
      validateAndTransformQuery(
        AdminGetSalesChannelParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
]
