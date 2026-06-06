import { MiddlewareRoute } from "@zjedene-medusa/framework/http"
import { validateAndTransformQuery } from "@zjedene-medusa/framework"
import * as QueryConfig from "./query-config"
import { StoreReturnReasonParams, StoreReturnReasonsParams } from "./validators"

export const storeReturnReasonRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/store/return-reasons",
    middlewares: [
      validateAndTransformQuery(
        StoreReturnReasonsParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/store/return-reasons/:id",
    middlewares: [
      validateAndTransformQuery(
        StoreReturnReasonParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
]
