import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import { authorize, MiddlewareRoute } from "@medusajs/framework/http"
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
    middlewares: [
      authorize([
        {
          resource: Entities.fulfillment_set,
          operation: PolicyOperation.read,
        },
      ]),
    ],
  },
  {
    matcher: "/admin/fulfillment-sets/*/service-zones/*",
    middlewares: [
      authorize([
        {
          resource: Entities.service_zone,
          operation: PolicyOperation.read,
        },
      ]),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/fulfillment-sets/:id/service-zones",
    middlewares: [
      authorize([
        {
          resource: Entities.fulfillment_set,
          operation: PolicyOperation.create,
        },
        {
          resource: Entities.service_zone,
          operation: PolicyOperation.create,
        },
        {
          resource: Entities.stock_location,
          operation: PolicyOperation.update,
        },
      ]),
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
      authorize([
        {
          resource: Entities.fulfillment_set,
          operation: PolicyOperation.update,
        },
        {
          resource: Entities.service_zone,
          operation: PolicyOperation.delete,
        },
        {
          resource: Entities.stock_location,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformQuery(
        AdminFulfillmentSetParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/fulfillment-sets/:id",
    middlewares: [
      authorize([
        {
          resource: Entities.fulfillment_set,
          operation: PolicyOperation.delete,
        },
        {
          resource: Entities.stock_location,
          operation: PolicyOperation.update,
        },
      ]),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/fulfillment-sets/:id/service-zones/:zone_id",
    middlewares: [
      authorize([
        {
          resource: Entities.fulfillment_set,
          operation: PolicyOperation.update,
        },
        {
          resource: Entities.service_zone,
          operation: PolicyOperation.update,
        },
        {
          resource: Entities.stock_location,
          operation: PolicyOperation.update,
        },
      ]),
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
      authorize([
        {
          resource: Entities.service_zone,
          operation: PolicyOperation.read,
        },
      ]),
      validateAndTransformQuery(
        AdminServiceZonesParams,
        QueryConfig.retrieveServiceZoneTransformQueryConfig
      ),
    ],
  },
]
