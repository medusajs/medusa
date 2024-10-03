import { MiddlewareRoute } from "@medusajs/framework/http"
import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import * as queryConfig from "./query-config"
import {
  AdminCreatePaymentCollection,
  AdminGetPaymentCollectionParams,
  AdminMarkPaymentCollectionPaid,
} from "./validators"

export const adminPaymentCollectionsMiddlewares: MiddlewareRoute[] = [
  {
    method: ["POST"],
    matcher: "/admin/payment-collections",
    middlewares: [
      validateAndTransformBody(AdminCreatePaymentCollection),
      validateAndTransformQuery(
        AdminGetPaymentCollectionParams,
        queryConfig.retrievePaymentCollectionTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/payment-collections/:id/mark-as-paid",
    middlewares: [
      validateAndTransformBody(AdminMarkPaymentCollectionPaid),
      validateAndTransformQuery(
        AdminGetPaymentCollectionParams,
        queryConfig.retrievePaymentCollectionTransformQueryConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/payment-collections/:id",
    middlewares: [],
  },
]
