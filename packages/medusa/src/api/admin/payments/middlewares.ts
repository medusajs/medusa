import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import { authorize, MiddlewareRoute } from "@medusajs/framework/http"
import { PolicyOperation } from "@medusajs/framework/utils"
import * as queryConfig from "./query-config"
import { Entities } from "./query-config"
import {
  AdminCreatePaymentCapture,
  AdminCreatePaymentRefund,
  AdminGetPaymentParams,
  AdminGetPaymentProvidersParams,
  AdminGetPaymentsParams,
} from "./validators"

export const adminPaymentRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/admin/payments/*",
    middlewares: [
      authorize([
        {
          resource: Entities.payment,
          operation: PolicyOperation.read,
        },
      ]),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/payments",
    middlewares: [
      authorize([
        {
          resource: Entities.payment,
          operation: PolicyOperation.read,
        },
      ]),
      validateAndTransformQuery(
        AdminGetPaymentsParams,
        queryConfig.listTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/payments/payment-providers",
    middlewares: [
      validateAndTransformQuery(
        AdminGetPaymentProvidersParams,
        queryConfig.listTransformPaymentProvidersQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/payments/:id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetPaymentParams,
        queryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/payments/:id/capture",
    middlewares: [
      authorize([
        {
          resource: Entities.capture,
          operation: PolicyOperation.create,
        },
        {
          resource: Entities.order,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminCreatePaymentCapture),
      validateAndTransformQuery(
        AdminGetPaymentParams,
        queryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/payments/:id/refund",
    middlewares: [
      authorize([
        {
          resource: Entities.refund,
          operation: PolicyOperation.create,
        },
        {
          resource: Entities.order,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminCreatePaymentRefund),
      validateAndTransformQuery(
        AdminGetPaymentParams,
        queryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
]
