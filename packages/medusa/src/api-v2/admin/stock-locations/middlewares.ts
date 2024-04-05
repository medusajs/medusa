import * as QueryConfig from "./query-config"

import { transformBody, transformQuery } from "../../../api/middlewares"
import {
  AdminGetStockLocationsLocationParams,
  AdminGetStockLocationsParams,
  AdminPostStockLocationsFulfillmentSetReq,
  AdminPostStockLocationsLocationParams,
  AdminPostStockLocationsLocationReq,
  AdminPostStockLocationsParams,
  AdminPostStockLocationsReq,
  AdminStockLocationsLocationSalesChannelBatchReq,
} from "./validators"

import { MiddlewareRoute } from "../../../types/middlewares"
import { authenticate } from "../../../utils/authenticate-middleware"
import { applySalesChannelsFilter } from "./utils/apply-sales-channel-filter"

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
  {
    method: ["POST"],
    matcher: "/admin/stock-locations/:id",
    middlewares: [
      transformBody(AdminPostStockLocationsLocationReq),
      transformQuery(
        AdminPostStockLocationsLocationParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/stock-locations/:id/sales-channels/batch*",
    middlewares: [
      transformBody(AdminStockLocationsLocationSalesChannelBatchReq),
      transformQuery(
        AdminPostStockLocationsLocationParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/stock-locations/:id",
    middlewares: [
      transformQuery(
        AdminGetStockLocationsLocationParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/stock-locations/:id/fulfillment-sets",
    middlewares: [
      transformBody(AdminPostStockLocationsFulfillmentSetReq),
      transformQuery(
        AdminPostStockLocationsParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
]
