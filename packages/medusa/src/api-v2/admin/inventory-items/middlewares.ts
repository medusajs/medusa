import * as QueryConfig from "./query-config"

import {
  AdminGetInventoryItemsItemParams,
  AdminGetInventoryItemsParams,
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
    method: ["POST"],
    matcher: "/admin/inventory-items/:id/location-levels",
    middlewares: [transformBody(AdminPostInventoryItemsItemLocationLevelsReq)],
  },
  {
    method: ["POST"],
    matcher: "/admin/inventory-items",
    middlewares: [transformBody(AdminPostInventoryItemsReq)],
  },
]
