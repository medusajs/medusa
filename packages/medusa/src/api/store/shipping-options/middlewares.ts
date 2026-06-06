import {
  MiddlewareRoute,
  validateAndTransformBody,
} from "@zjedene-medusa/framework/http"
import { validateAndTransformQuery } from "@zjedene-medusa/framework"
import { listTransformQueryConfig } from "./query-config"
import {
  StoreCalculateShippingOptionPrice,
  StoreGetShippingOptions,
  StoreGetShippingOptionsParams,
} from "./validators"
import * as QueryConfig from "./query-config"

export const storeShippingOptionRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/store/shipping-options",
    middlewares: [
      validateAndTransformQuery(
        StoreGetShippingOptions,
        listTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/store/shipping-options/:id/calculate",
    middlewares: [
      validateAndTransformQuery(
        StoreGetShippingOptionsParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
      validateAndTransformBody(StoreCalculateShippingOptionPrice),
    ],
  },
]
