import { MiddlewareRoute } from "@zjedene-medusa/framework/http"
import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@zjedene-medusa/framework"
import * as queryConfig from "./query-config"
import {
  StoreCreatePaymentCollection,
  StoreCreatePaymentSession,
  StoreGetPaymentCollectionParams,
} from "./validators"

export const storePaymentCollectionsMiddlewares: MiddlewareRoute[] = [
  {
    method: ["POST"],
    matcher: "/store/payment-collections",
    middlewares: [
      validateAndTransformBody(StoreCreatePaymentCollection),
      validateAndTransformQuery(
        StoreGetPaymentCollectionParams,
        queryConfig.retrievePaymentCollectionTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/store/payment-collections/:id/payment-sessions",
    middlewares: [
      validateAndTransformBody(StoreCreatePaymentSession),
      validateAndTransformQuery(
        StoreGetPaymentCollectionParams,
        queryConfig.retrievePaymentCollectionTransformQueryConfig
      ),
    ],
  },
]
