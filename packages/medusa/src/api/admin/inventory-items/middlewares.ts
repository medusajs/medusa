import * as QueryConfig from "./query-config"
import { MiddlewareRoute } from "../../../types/middlewares"
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
import { unlessPath } from "../../utils/unless-path"

export const adminInventoryRoutesMiddlewares: MiddlewareRoute[] = [
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
    method: ["POST"],
    matcher: "/admin/inventory-items/:id/location-levels/batch",
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
  {
    method: ["DELETE"],
    matcher: "/admin/inventory-items/:id/location-levels/:location_id",
    middlewares: [
      unlessPath(
        /.*\/location-levels\/batch/,
        validateAndTransformQuery(
          AdminGetInventoryItemParams,
          QueryConfig.retrieveTransformQueryConfig
        )
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/inventory-items/:id/location-levels/:location_id",
    middlewares: [
      unlessPath(
        /.*\/location-levels\/batch/,
        validateAndTransformBody(AdminUpdateInventoryLocationLevel)
      ),
      unlessPath(
        /.*\/location-levels\/batch/,
        validateAndTransformQuery(
          AdminGetInventoryItemParams,
          QueryConfig.retrieveTransformQueryConfig
        )
      ),
    ],
  },
]
