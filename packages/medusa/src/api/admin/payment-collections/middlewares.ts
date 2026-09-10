import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import { authorize, MiddlewareRoute } from "@medusajs/framework/http"
import { PolicyOperation } from "@medusajs/framework/utils"
import * as queryConfig from "./query-config"
import { Entities } from "./query-config"
import {
  AdminCreatePaymentCollection,
  AdminGetPaymentCollectionParams,
  AdminInitializePaymentSession,
  AdminMarkPaymentCollectionPaid,
} from "./validators"

export const adminPaymentCollectionsMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/admin/payment-collections/*",
    middlewares: [
      authorize([
        {
          resource: Entities.payment_collection,
          operation: PolicyOperation.read,
        },
      ]),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/payment-collections",
    middlewares: [
      authorize([
        {
          resource: Entities.payment_collection,
          operation: PolicyOperation.create,
        },
        {
          resource: Entities.order,
          operation: PolicyOperation.update,
        },
      ]),
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
      authorize([
        {
          resource: Entities.payment_collection,
          operation: PolicyOperation.update,
        },
        {
          resource: Entities.order,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminMarkPaymentCollectionPaid),
      validateAndTransformQuery(
        AdminGetPaymentCollectionParams,
        queryConfig.retrievePaymentCollectionTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/payment-collections/:id/payment-sessions",
    middlewares: [
      authorize([
        {
          resource: Entities.payment_collection,
          operation: PolicyOperation.update,
        },
        {
          resource: Entities.order,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminInitializePaymentSession),
      validateAndTransformQuery(
        AdminGetPaymentCollectionParams,
        queryConfig.retrievePaymentCollectionTransformQueryConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/payment-collections/:id",
    middlewares: [
      authorize([
        {
          resource: Entities.payment_collection,
          operation: PolicyOperation.delete,
        },
        {
          resource: Entities.order,
          operation: PolicyOperation.update,
        },
      ]),
    ],
  },
]
