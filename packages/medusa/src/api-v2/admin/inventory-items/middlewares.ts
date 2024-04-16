import * as QueryConfig from "./query-config"

import {
  AdminGetInventoryItemsItemLocationLevelsParams,
  AdminGetInventoryItemsItemParams,
  AdminGetInventoryItemsParams,
  AdminPostInventoryItemsInventoryItemParams,
  AdminPostInventoryItemsInventoryItemReq,
  AdminPostInventoryItemsItemLocationLevelsBatchReq,
  AdminPostInventoryItemsItemLocationLevelsLevelParams,
  AdminPostInventoryItemsItemLocationLevelsLevelReq,
  AdminPostInventoryItemsItemLocationLevelsReq,
  AdminPostInventoryItemsReq,
} from "./validators"
import { transformBody, transformQuery } from "../../../api/middlewares"

import { MiddlewareRoute } from "../../../types/middlewares"
import { authenticate } from "../../../utils/authenticate-middleware"

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
      transformQuery(
        AdminGetInventoryItemsParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/inventory-items/:id",
    middlewares: [
      transformQuery(
        AdminGetInventoryItemsItemParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/inventory-items",
    middlewares: [
      transformBody(AdminPostInventoryItemsReq),
      transformQuery(
        AdminGetInventoryItemsItemParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/inventory-items/:id/location-levels/batch/combi",
    middlewares: [
      transformBody(AdminPostInventoryItemsItemLocationLevelsBatchReq),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/inventory-items/:id/location-levels",
    middlewares: [
      transformQuery(
        AdminGetInventoryItemsItemLocationLevelsParams,
        QueryConfig.listLocationLevelsTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/inventory-items/:id/location-levels",
    middlewares: [transformBody(AdminPostInventoryItemsItemLocationLevelsReq)],
  },
  {
    method: ["POST"],
    matcher: "/admin/inventory-items/:id/location-levels",
    middlewares: [transformBody(AdminPostInventoryItemsItemLocationLevelsReq)],
  },
  {
    method: ["POST"],
    matcher: "/admin/inventory-items/:id/location-levels/:location_id",
    middlewares: [
      transformBody(AdminPostInventoryItemsItemLocationLevelsLevelReq),
      transformQuery(
        AdminPostInventoryItemsItemLocationLevelsLevelParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/inventory-items/:id",
    middlewares: [
      transformBody(AdminPostInventoryItemsInventoryItemReq),
      transformQuery(
        AdminPostInventoryItemsInventoryItemParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
]
