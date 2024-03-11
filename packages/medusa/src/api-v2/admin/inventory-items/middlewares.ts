import * as QueryConfig from "./query-config"

import {
  AdminGetInventoryItemsItemParams,
  AdminPostInventoryItemsItemLocationLevelsReq,
} from "./validators"
import { transformBody, transformQuery } from "../../../api/middlewares"

import { MiddlewareRoute } from "../../../types/middlewares"
import { authenticate } from "../../../utils/authenticate-middleware"

export const adminInviteRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: "ALL",
    matcher: "/admin/inventory-items",
    middlewares: [authenticate("admin", ["session", "bearer"])],
  },
  {
    method: ["GET"],
    matcher: "/admin/inventory-items",
    middlewares: [
      transformQuery(
        AdminGetInventoryItemsItemParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/inventory-items/:id/location-levels",
    middlewares: [transformBody(AdminPostInventoryItemsItemLocationLevelsReq)],
  },
]
