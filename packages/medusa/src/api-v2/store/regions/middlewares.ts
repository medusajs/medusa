import { transformQuery } from "../../../api/middlewares"
import { MiddlewareRoute } from "../../../loaders/helpers/routing/types"
import * as QueryConfig from "./query-config"
import { StoreGetRegionsParams, StoreRegionsRegionParams } from "./validators"

export const storeRegionRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/store/regions",
    middlewares: [
      transformQuery(
        StoreGetRegionsParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/store/regions/:id",
    middlewares: [
      transformQuery(
        StoreRegionsRegionParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/store/regions/:id/payment-providers",
    middlewares: [],
  },
]
