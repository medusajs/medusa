import { MiddlewareRoute } from "@medusajs/framework/http"
import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import * as QueryConfig from "./query-config"
import {
  AdminCreateFulfillmentSetServiceZonesSchema,
  AdminFulfillmentSetParams,
  AdminServiceZonesParams,
  AdminUpdateFulfillmentSetServiceZonesSchema,
} from "./validators"

export const adminFulfillmentSetsRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["POST"],
    matcher: "/admin/fulfillment-sets/:id/service-zones",
    middlewares: [
      validateAndTransformBody(AdminCreateFulfillmentSetServiceZonesSchema),
      validateAndTransformQuery(
        AdminFulfillmentSetParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/fulfillment-sets/:id/service-zones/:zone_id",
    middlewares: [
      validateAndTransformQuery(
        AdminFulfillmentSetParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/fulfillment-sets/:id",
    middlewares: [],
  },
  {
    method: ["POST"],
    matcher: "/admin/fulfillment-sets/:id/service-zones/:zone_id",
    middlewares: [
      validateAndTransformBody(AdminUpdateFulfillmentSetServiceZonesSchema),
      validateAndTransformQuery(
        AdminFulfillmentSetParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/fulfillment-sets/:id/service-zones/:zone_id",
    middlewares: [
      validateAndTransformQuery(
        AdminServiceZonesParams,
        QueryConfig.retrieveServiceZoneTransformQueryConfig
      ),
    ],
  },
]
