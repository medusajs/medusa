import * as QueryConfig from "./query-config"

import {
  AdminGetStockLocationsParams,
  AdminPostStockLocationsParams,
  AdminPostStockLocationsReq,
} from "./validators"
import { transformBody, transformQuery } from "../../../api/middlewares"

import { MiddlewareRoute } from "../../../types/middlewares"
import { applySalesChannelsFilter } from "./utils/apply-sales-channel-filter"
import { authenticate } from "../../../utils/authenticate-middleware"

export const adminStockLocationRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: "ALL",
    matcher: "/admin/stock-locations*",
    middlewares: [authenticate("admin", ["session", "bearer", "api-key"])],
  },
  {
    method: ["POST"],
    matcher: "/admin/stock-locations",
    middlewares: [
      transformBody(AdminPostStockLocationsReq),
      transformQuery(
        AdminPostStockLocationsParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/stock-locations",
    middlewares: [
      transformQuery(
        AdminGetStockLocationsParams,
        QueryConfig.listTransformQueryConfig
      ),
      applySalesChannelsFilter(),
    ],
  },
]
