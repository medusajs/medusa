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
  AdminCreateStockLocation,
  AdminCreateStockLocationFulfillmentSet,
  AdminGetStockLocationParams,
  AdminGetStockLocationsParams,
  AdminUpdateStockLocation,
} from "./validators"

export const adminStockLocationRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/admin/stock-locations/*",
    policies: [
      {
        resource: Entities.stock_location,
        operation: PolicyOperation.read,
      },
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/stock-locations",
    middlewares: [
      validateAndTransformBody(AdminCreateStockLocation),
      validateAndTransformQuery(
        AdminGetStockLocationParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.stock_location,
        operation: PolicyOperation.create,
      },
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/stock-locations",
    middlewares: [
      validateAndTransformQuery(
        AdminGetStockLocationsParams,
        QueryConfig.listTransformQueryConfig
      ),
      maybeApplyLinkFilter({
        entryPoint: "sales_channel_location",
        resourceId: "stock_location_id",
        filterableField: "sales_channel_id",
      }),
    ],
    policies: [
      {
        resource: Entities.stock_location,
        operation: PolicyOperation.read,
      },
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/stock-locations/:id",
    middlewares: [
      validateAndTransformBody(AdminUpdateStockLocation),
      validateAndTransformQuery(
        AdminGetStockLocationParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.stock_location,
        operation: PolicyOperation.update,
      },
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
      validateAndTransformBody(AdminCreateStockLocationFulfillmentSet),
      validateAndTransformQuery(
        AdminGetStockLocationParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.stock_location,
        operation: PolicyOperation.update,
      },
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/stock-locations/:id/sales-channels",
    middlewares: [
      validateAndTransformBody(createLinkBody()),
      validateAndTransformQuery(
        AdminGetStockLocationParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.stock_location,
        operation: PolicyOperation.update,
      },
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/stock-locations/:id/fulfillment-providers",
    middlewares: [
      validateAndTransformBody(createLinkBody()),
      validateAndTransformQuery(
        AdminGetStockLocationParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.stock_location,
        operation: PolicyOperation.update,
      },
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/stock-locations/:id",
    middlewares: [],
    policies: [
      {
        resource: Entities.stock_location,
        operation: PolicyOperation.delete,
      },
    ],
  },
]
