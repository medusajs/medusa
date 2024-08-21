import { MiddlewareRoute } from "@medusajs/framework"
import { validateAndTransformBody } from "../../utils/validate-body"
import { validateAndTransformQuery } from "../../utils/validate-query"
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
