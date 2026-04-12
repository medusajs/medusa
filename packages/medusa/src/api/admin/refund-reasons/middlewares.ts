import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import { MiddlewareRoute } from "@medusajs/framework/http"
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
    policies: [
      {
        resource: Entities.refund_reason,
        operation: PolicyOperation.read,
      },
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/refund-reasons",
    middlewares: [
      validateAndTransformQuery(
        AdminGetRefundReasonsParams,
        queryConfig.listTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.refund_reason,
        operation: PolicyOperation.read,
      },
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/refund-reasons",
    middlewares: [
      validateAndTransformBody(AdminCreatePaymentRefundReason),
      validateAndTransformQuery(
        AdminGetRefundReasonsParams,
        queryConfig.retrieveTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.refund_reason,
        operation: PolicyOperation.create,
      },
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/refund-reasons/:id",
    middlewares: [
      validateAndTransformBody(AdminUpdatePaymentRefundReason),
      validateAndTransformQuery(
        AdminGetRefundReasonParams,
        queryConfig.retrieveTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.refund_reason,
        operation: PolicyOperation.update,
      },
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
      validateAndTransformQuery(
        AdminGetRefundReasonsParams,
        queryConfig.retrieveTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.refund_reason,
        operation: PolicyOperation.delete,
      },
    ],
  },
]
