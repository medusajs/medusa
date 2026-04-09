import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import { MiddlewareRoute } from "@medusajs/framework/http"
import { PolicyOperation } from "@medusajs/framework/utils"
import * as QueryConfig from "./query-config"
import { Entities } from "./query-config"
import {
  AdminCreateFulfillmentSetServiceZonesSchema,
  AdminFulfillmentSetParams,
  AdminServiceZonesParams,
  AdminUpdateFulfillmentSetServiceZonesSchema,
} from "./validators"

export const adminFulfillmentSetsRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/admin/fulfillment-sets/*",
    policies: [
      {
        resource: Entities.fulfillment_set,
        operation: PolicyOperation.read,
      },
    ],
  },
  {
    matcher: "/admin/fulfillment-sets/*/service-zones/*",
    policies: [
      {
        resource: Entities.service_zone,
        operation: PolicyOperation.read,
      },
    ],
  },
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
    policies: [
      {
        resource: Entities.fulfillment_set,
        operation: PolicyOperation.create,
      },
      {
        resource: Entities.service_zone,
        operation: PolicyOperation.create,
      },
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
    policies: [
      {
        resource: Entities.fulfillment_set,
        operation: PolicyOperation.update,
      },
      {
        resource: Entities.service_zone,
        operation: PolicyOperation.delete,
      },
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/fulfillment-sets/:id",
    middlewares: [],
    policies: [
      {
        resource: Entities.fulfillment_set,
        operation: PolicyOperation.delete,
      },
    ],
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
    policies: [
      {
        resource: Entities.fulfillment_set,
        operation: PolicyOperation.update,
      },
      {
        resource: Entities.service_zone,
        operation: PolicyOperation.update,
      },
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
    policies: [
      {
        resource: Entities.service_zone,
        operation: PolicyOperation.read,
      },
    ],
  },
]
