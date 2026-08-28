import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import { authorize, MiddlewareRoute } from "@medusajs/framework/http"
import { PolicyOperation } from "@medusajs/framework/utils"
import * as queryConfig from "./query-config"
import { Entities } from "./query-config"
import {
  AdminCreatePaymentRefundReason,
  AdminGetRefundReasonParams,
  AdminGetRefundReasonsParams,
  AdminUpdatePaymentRefundReason,
} from "./validators"

export const adminRefundReasonsRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/admin/refund-reasons/*",
    middlewares: [
      authorize([
        {
          resource: Entities.refund_reason,
          operation: PolicyOperation.read,
        },
      ]),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/refund-reasons",
    middlewares: [
      authorize([
        {
          resource: Entities.refund_reason,
          operation: PolicyOperation.read,
        },
      ]),
      validateAndTransformQuery(
        AdminGetRefundReasonsParams,
        queryConfig.listTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/refund-reasons",
    middlewares: [
      authorize([
        {
          resource: Entities.refund_reason,
          operation: PolicyOperation.create,
        },
      ]),
      validateAndTransformBody(AdminCreatePaymentRefundReason),
      validateAndTransformQuery(
        AdminGetRefundReasonsParams,
        queryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/refund-reasons/:id",
    middlewares: [
      authorize([
        {
          resource: Entities.refund_reason,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminUpdatePaymentRefundReason),
      validateAndTransformQuery(
        AdminGetRefundReasonParams,
        queryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/refund-reasons/:id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetRefundReasonsParams,
        queryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/refund-reasons/:id",
    middlewares: [
      authorize([
        {
          resource: Entities.refund_reason,
          operation: PolicyOperation.delete,
        },
      ]),
      validateAndTransformQuery(
        AdminGetRefundReasonsParams,
        queryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
]
