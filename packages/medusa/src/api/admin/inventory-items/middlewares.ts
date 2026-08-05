import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import { authorize, MiddlewareRoute } from "@medusajs/framework/http"
import { PolicyOperation } from "@medusajs/framework/utils"
import { DEFAULT_BATCH_ENDPOINTS_SIZE_LIMIT } from "../../../utils/middlewares"
import * as QueryConfig from "./query-config"
import { Entities } from "./query-config"
import {
  AdminBatchInventoryItemLevels,
  AdminBatchInventoryItemLocationsLevel,
  AdminCreateInventoryItem,
  AdminCreateInventoryLocationLevel,
  AdminGetInventoryItemParams,
  AdminGetInventoryItemsParams,
  AdminGetInventoryLocationLevelParams,
  AdminGetInventoryLocationLevelsParams,
  AdminUpdateInventoryItem,
  AdminUpdateInventoryLocationLevel,
} from "./validators"

export const adminInventoryRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/admin/inventory-items/*",
    middlewares: [
      authorize([
        {
          resource: Entities.inventory_item,
          operation: PolicyOperation.read,
        },
      ]),
    ],
  },
  {
    matcher: "/admin/inventory-items/*/location-levels/*",
    middlewares: [
      authorize([
        {
          resource: Entities.inventory_level,
          operation: PolicyOperation.read,
        },
      ]),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/inventory-items",
    middlewares: [
      authorize([
        {
          resource: Entities.inventory_item,
          operation: PolicyOperation.read,
        },
      ]),
      validateAndTransformQuery(
        AdminGetInventoryItemsParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/inventory-items/:id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetInventoryItemParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/inventory-items",
    middlewares: [
      authorize([
        {
          resource: Entities.inventory_item,
          operation: PolicyOperation.create,
        },
      ]),
      validateAndTransformBody(AdminCreateInventoryItem),
      validateAndTransformQuery(
        AdminGetInventoryItemParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/inventory-items/batch",
    bodyParser: {
      sizeLimit: DEFAULT_BATCH_ENDPOINTS_SIZE_LIMIT,
    },
    middlewares: [
      authorize([
        {
          resource: Entities.inventory_item,
          operation: PolicyOperation.ALL,
        },
      ]),
      validateAndTransformBody(AdminBatchInventoryItemLevels),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/inventory-items/location-levels/batch",
    bodyParser: {
      sizeLimit: DEFAULT_BATCH_ENDPOINTS_SIZE_LIMIT,
    },
    middlewares: [
      authorize([
        {
          resource: Entities.inventory_level,
          operation: [
            PolicyOperation.create,
            PolicyOperation.update,
            PolicyOperation.delete,
          ],
        },
      ]),
      validateAndTransformBody(AdminBatchInventoryItemLevels),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/inventory-items/:id",
    middlewares: [
      authorize([
        {
          resource: Entities.inventory_item,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminUpdateInventoryItem),
      validateAndTransformQuery(
        AdminGetInventoryItemParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/inventory-items/:id/location-levels",
    middlewares: [
      validateAndTransformQuery(
        AdminGetInventoryLocationLevelsParams,
        QueryConfig.listLocationLevelsTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/inventory-items/:id/location-levels",
    middlewares: [
      authorize([
        {
          resource: Entities.inventory_level,
          operation: PolicyOperation.create,
        },
      ]),
      validateAndTransformBody(AdminCreateInventoryLocationLevel),
      validateAndTransformQuery(
        AdminGetInventoryItemParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/inventory-items/:id/location-levels/batch",
    bodyParser: {
      sizeLimit: DEFAULT_BATCH_ENDPOINTS_SIZE_LIMIT,
    },
    middlewares: [
      authorize([
        {
          resource: Entities.inventory_level,
          operation: [
            PolicyOperation.create,
            PolicyOperation.update,
            PolicyOperation.delete,
          ],
        },
      ]),
      validateAndTransformBody(AdminBatchInventoryItemLocationsLevel),
      validateAndTransformQuery(
        AdminGetInventoryLocationLevelParams,
        QueryConfig.retrieveLocationLevelsTransformQueryConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/inventory-items/:id/location-levels/:location_id",
    middlewares: [
      authorize([
        {
          resource: Entities.inventory_level,
          operation: PolicyOperation.delete,
        },
      ]),
      validateAndTransformQuery(
        AdminGetInventoryItemParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/inventory-items/:id/location-levels/:location_id",
    middlewares: [
      authorize([
        {
          resource: Entities.inventory_level,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminUpdateInventoryLocationLevel),
      validateAndTransformQuery(
        AdminGetInventoryItemParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
]
