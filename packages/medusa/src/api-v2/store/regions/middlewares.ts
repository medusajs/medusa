import { MiddlewareRoute } from "../../../loaders/helpers/routing/types"
import { validateAndTransformQuery } from "../../utils/validate-query"
import * as QueryConfig from "./query-config"
import { StoreGetRegionParams, StoreGetRegionsParams } from "./validators"

export const storeRegionRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/store/regions",
    middlewares: [
      validateAndTransformQuery(
        StoreGetRegionsParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/store/regions/:id",
    middlewares: [
      validateAndTransformQuery(
        StoreGetRegionParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
]
