import * as QueryConfig from "./query-config"
import { MiddlewareRoute } from "../../../types/middlewares"
import { authenticate } from "../../../utils/authenticate-middleware"
import { validateAndTransformQuery } from "../../utils/validate-query"
import {
  AdminCreateInventoryItem,
  AdminCreateInventoryLocationLevel,
  AdminGetInventoryItemParams,
  AdminGetInventoryItemsParams,
  AdminGetInventoryLocationLevelParams,
  AdminGetInventoryLocationLevelsParams,
  AdminUpdateInventoryItem,
  AdminUpdateInventoryLocationLevel,
} from "./validators"
import { validateAndTransformBody } from "../../utils/validate-body"
import { createBatchBody } from "../../utils/validators"

export const adminInventoryRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: "ALL",
    matcher: "/admin/inventory-items*",
    middlewares: [authenticate("admin", ["session", "bearer", "api-key"])],
  },
  {
    method: ["GET"],
    matcher: "/admin/inventory-items",
    middlewares: [
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
      validateAndTransformBody(AdminCreateInventoryItem),
      validateAndTransformQuery(
        AdminGetInventoryItemParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/inventory-items/:id",
    middlewares: [
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
      validateAndTransformBody(AdminCreateInventoryLocationLevel),
      validateAndTransformQuery(
        AdminGetInventoryItemParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/inventory-items/:id/location-levels/:location_id",
    middlewares: [
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
      validateAndTransformBody(AdminUpdateInventoryLocationLevel),
      validateAndTransformQuery(
        AdminGetInventoryItemParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/inventory-items/:id/location-levels/op/batch",
    middlewares: [
      validateAndTransformBody(
        createBatchBody(
          AdminCreateInventoryLocationLevel,
          AdminUpdateInventoryLocationLevel
        )
      ),
      validateAndTransformQuery(
        AdminGetInventoryLocationLevelParams,
        QueryConfig.retrieveLocationLevelsTransformQueryConfig
      ),
    ],
  },
]
