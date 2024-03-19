import * as QueryConfig from "./query-config"

import {
  AdminGetInventoryItemsItemParams,
  AdminGetInventoryItemsParams,
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
        QueryConfig.retrieveLocationLevelsTransformQueryConfig
      ),
    ],
  },
]
