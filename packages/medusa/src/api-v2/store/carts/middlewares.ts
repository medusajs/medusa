import { transformQuery } from "../../../api/middlewares"
import { MiddlewareRoute } from "../../../loaders/helpers/routing/types"
import * as QueryConfig from "./query-config"
import { StoreGetCartsCartParams } from "./validators"

export const storeCartRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/store/carts/:id",
    middlewares: [
      transformQuery(
        StoreGetCartsCartParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
]
