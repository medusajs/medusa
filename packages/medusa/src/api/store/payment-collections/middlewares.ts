import { MiddlewareRoute } from "../../../types/middlewares"
import { authenticate } from "../../../utils/middlewares/authenticate-middleware"
import { validateAndTransformBody } from "../../utils/validate-body"
import { validateAndTransformQuery } from "../../utils/validate-query"
import * as queryConfig from "./query-config"
import {
  StoreGetPaymentCollectionParams,
  StoreCreatePaymentCollection,
  StoreCreatePaymentSession,
} from "./validators"

export const storePaymentCollectionsMiddlewares: MiddlewareRoute[] = [
  {
    method: "ALL",
    matcher: "/store/payment-collections*",
    middlewares: [
      authenticate("customer", ["session", "bearer"], {
        allowUnauthenticated: true,
      }),
    ],
  },
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
