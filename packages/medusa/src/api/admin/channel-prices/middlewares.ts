import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import { MiddlewareRoute } from "@medusajs/framework/http"

import * as QueryConfig from "./query-config"
import {
  AdminCreateChannelPrice,
  AdminGetChannelPriceParams,
  AdminGetChannelPricesParams,
  AdminUpdateChannelPrice,
} from "./validators"

export const adminChannelPriceRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/admin/channel-prices",
    middlewares: [
      validateAndTransformQuery(
        AdminGetChannelPricesParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/channel-prices/:id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetChannelPriceParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/channel-prices",
    middlewares: [
      validateAndTransformBody(AdminCreateChannelPrice),
      validateAndTransformQuery(
        AdminGetChannelPriceParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/channel-prices/:id",
    middlewares: [
      validateAndTransformBody(AdminUpdateChannelPrice),
      validateAndTransformQuery(
        AdminGetChannelPriceParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/channel-prices/:id",
    middlewares: [],
  },
]
