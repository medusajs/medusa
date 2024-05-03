import { MiddlewareRoute } from "../../../types/middlewares"
import { validateAndTransformQuery } from "../../utils/validate-query"
import * as queryConfig from "./query-config"
import { StoreGetPaymentProvidersParams } from "./validators"

export const storePaymentRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/store/payments/payment-providers",
    middlewares: [
      validateAndTransformQuery(
        StoreGetPaymentProvidersParams,
        queryConfig.listTransformPaymentProvidersQueryConfig
      ),
    ],
  },
]
