import * as QueryConfig from "./query-config"

import { transformBody, transformQuery } from "../../../api/middlewares"
import {
  AdminCreateStockLocationFulfillmentSet,
  AdminGetStockLocationsLocationParams,
  AdminGetStockLocationsParams,
  AdminPostStockLocationsLocationParams,
  AdminPostStockLocationsLocationReq,
  AdminPostStockLocationsParams,
  AdminPostStockLocationsReq,
  AdminStockLocationsLocationSalesChannelBatchReq,
} from "./validators"

import { MiddlewareRoute } from "../../../types/middlewares"
import { authenticate } from "../../../utils/authenticate-middleware"
import { maybeApplyLinkFilter } from "../../utils/maybe-apply-link-filter"
import { validateAndTransformBody } from "../../utils/validate-body"

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
      maybeApplyLinkFilter({
        entryPoint: "sales_channel_location",
        resourceId: "stock_location_id",
        filterableField: "sales_channel_id",
      }),
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
      validateAndTransformBody(AdminCreateStockLocationFulfillmentSet),
      transformQuery(
        AdminPostStockLocationsParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
]
