import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import { MiddlewareRoute } from "@medusajs/framework/http"

import * as QueryConfig from "./query-config"
import {
  AdminCreateStoreInventory,
  AdminGetStoreInventoryParams,
  AdminGetStoreInventoriesParams,
  AdminUpdateStoreInventory,
} from "./validators"

export const adminStoreInventoryRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/admin/store-inventories",
    middlewares: [
      validateAndTransformQuery(
        AdminGetStoreInventoriesParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/store-inventories/:id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetStoreInventoryParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/store-inventories",
    middlewares: [
      validateAndTransformBody(AdminCreateStoreInventory),
      validateAndTransformQuery(
        AdminGetStoreInventoryParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/store-inventories/:id",
    middlewares: [
      validateAndTransformBody(AdminUpdateStoreInventory),
      validateAndTransformQuery(
        AdminGetStoreInventoryParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/store-inventories/:id",
    middlewares: [],
  },
]
