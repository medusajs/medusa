import { transformQuery } from "../../../api/middlewares"
import { MiddlewareRoute } from "../../../loaders/helpers/routing/types"
import { authenticate } from "../../../utils/authenticate-middleware"
import * as QueryConfig from "./query-config"
import {
  StoreGetCurrenciesCurrencyParams,
  StoreGetCurrenciesParams,
} from "./validators"

export const storeCurrencyRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/store/currencies",
    middlewares: [
      transformQuery(
        StoreGetCurrenciesParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/store/currencies/:code",
    middlewares: [
      transformQuery(
        StoreGetCurrenciesCurrencyParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
]
