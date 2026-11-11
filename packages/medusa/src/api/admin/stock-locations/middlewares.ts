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
  AdminCreateStockLocation,
  AdminCreateStockLocationFulfillmentSet,
  AdminGetStockLocationParams,
  AdminGetStockLocationsParams,
  AdminUpdateStockLocation,
} from "./validators"
import { createdAuditResource } from "../../utils/audit"

export const adminStockLocationRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/admin/stock-locations/*",
    middlewares: [
      authorize([
        {
          resource: Entities.stock_location,
          operation: PolicyOperation.read,
        },
      ]),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/stock-locations",
    audit: {
      action: "stock_location.create",
      resource: createdAuditResource("stock_location"),
    },
    middlewares: [
      authorize([
        {
          resource: Entities.stock_location,
          operation: PolicyOperation.create,
        },
      ]),
      validateAndTransformBody(AdminCreateStockLocation),
      validateAndTransformQuery(
        AdminGetStockLocationParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/stock-locations",
    middlewares: [
      authorize([
        {
          resource: Entities.stock_location,
          operation: PolicyOperation.read,
        },
      ]),
      validateAndTransformQuery(
        AdminGetStockLocationsParams,
        QueryConfig.listTransformQueryConfig
      ),
      applyCrossModuleFilter({
        filterableField: "sales_channel_id",
        relationPath: "sales_channels.id",
      }),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/stock-locations/:id",
    middlewares: [
      authorize([
        {
          resource: Entities.stock_location,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminUpdateStockLocation),
      validateAndTransformQuery(
        AdminGetStockLocationParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/stock-locations/:id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetStockLocationParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/stock-locations/:id/fulfillment-sets",
    middlewares: [
      authorize([
        {
          resource: Entities.stock_location,
          operation: PolicyOperation.update,
        },
        {
          resource: Entities.fulfillment_set,
          operation: PolicyOperation.create,
        },
      ]),
      validateAndTransformBody(AdminCreateStockLocationFulfillmentSet),
      validateAndTransformQuery(
        AdminGetStockLocationParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/stock-locations/:id/sales-channels",
    middlewares: [
      authorize([
        {
          resource: Entities.stock_location,
          operation: PolicyOperation.update,
        },
        {
          resource: Entities.sales_channel,
          operation: PolicyOperation.read,
        },
      ]),
      validateAndTransformBody(createLinkBody()),
      validateAndTransformQuery(
        AdminGetStockLocationParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/stock-locations/:id/fulfillment-providers",
    middlewares: [
      authorize([
        {
          resource: Entities.stock_location,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(createLinkBody()),
      validateAndTransformQuery(
        AdminGetStockLocationParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/stock-locations/:id",
    middlewares: [
      authorize([
        {
          resource: Entities.stock_location,
          operation: PolicyOperation.delete,
        },
      ]),
    ],
  },
]
