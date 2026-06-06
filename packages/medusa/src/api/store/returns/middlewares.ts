import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@zjedene-medusa/framework"
import { MiddlewareRoute } from "@zjedene-medusa/framework/http"
import * as QueryConfig from "./query-config"
import { ReturnsParams, StorePostReturnsReqSchema } from "./validators"

export const storeReturnsRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["POST"],
    matcher: "/store/returns",
    middlewares: [
      validateAndTransformBody(StorePostReturnsReqSchema),
      validateAndTransformQuery(
        ReturnsParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
]
