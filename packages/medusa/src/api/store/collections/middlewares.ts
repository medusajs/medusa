import * as QueryConfig from "./query-config"
import { MiddlewareRoute } from "../../../loaders/helpers/routing/types"
import { validateAndTransformQuery } from "../../utils/validate-query"
import {
  StoreGetCollectionParams,
  StoreGetCollectionsParams,
} from "./validators"

export const storeCollectionRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/store/collections",
    middlewares: [
      validateAndTransformQuery(
        StoreGetCollectionsParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/store/collections/:id",
    middlewares: [
      validateAndTransformQuery(
        StoreGetCollectionParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
]
