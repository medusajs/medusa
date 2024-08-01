import { MiddlewareRoute } from "@medusajs/framework"
import { validateAndTransformQuery } from "../../utils/validate-query"
import * as QueryConfig from "./query-config"
import { StoreReturnReasonParams } from "./validators"

export const storeReturnReasonRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/admin/return-reasons",
    middlewares: [
      validateAndTransformQuery(
        StoreReturnReasonParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/return-reasons/:id",
    middlewares: [
      validateAndTransformQuery(
        StoreReturnReasonParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
]
