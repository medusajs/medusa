import { MiddlewareRoute } from "../../../loaders/helpers/routing/types"
import { authenticate } from "../../../utils/middlewares/authenticate-middleware"
import { validateAndTransformQuery } from "../../utils/validate-query"
import * as QueryConfig from "./query-config"
import { StoreGetOrderParams, StoreGetOrdersParams } from "./validators"

export const storeOrderRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/store/orders",
    middlewares: [
      authenticate("store", ["session", "bearer"]),
      validateAndTransformQuery(
        StoreGetOrdersParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/store/orders/:id",
    middlewares: [
      authenticate("store", ["session", "bearer"], {
        allowUnauthenticated: true,
      }),
      validateAndTransformQuery(
        StoreGetOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
]
