import { MiddlewareRoute } from "@medusajs/framework/http"
import { unlessPath } from "../../utils/unless-path"
import { validateAndTransformBody } from "@medusajs/framework"
import { validateAndTransformQuery } from "@medusajs/framework"
import * as queryConfig from "./query-config"
import {
  AdminCreatePaymentCapture,
  AdminCreatePaymentRefund,
  AdminGetPaymentParams,
  AdminGetPaymentProvidersParams,
  AdminGetPaymentsParams,
} from "./validators"

export const adminPaymentRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/admin/payments",
    middlewares: [
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
      unlessPath(
        /.*\/payments\/payment-providers/,
        validateAndTransformQuery(
          AdminGetPaymentParams,
          queryConfig.retrieveTransformQueryConfig
        )
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/payments/:id/capture",
    middlewares: [
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
      validateAndTransformBody(AdminCreatePaymentRefund),
      validateAndTransformQuery(
        AdminGetPaymentParams,
        queryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
]
