import { transformQuery } from "../../../api/middlewares"
import { MiddlewareRoute } from "../../../types/middlewares"
import { authenticate } from "../../../utils/authenticate-middleware"
import * as queryConfig from "./query-config"
import { AdminGetPaymentsParams } from "./validators"

export const adminPaymentRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: "ALL",
    matcher: "/admin/payments",
    middlewares: [authenticate("admin", ["session", "bearer"])],
  },
  {
    method: ["GET"],
    matcher: "/admin/payments",
    middlewares: [
      transformQuery(
        AdminGetPaymentsParams,
        queryConfig.listTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/payments/:id",
    middlewares: [
      transformQuery(
        AdminGetPaymentsParams,
        queryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/payments/:id/capture",
    middlewares: [],
  },
  {
    method: ["POST"],
    matcher: "/admin/payments/:id/refund",
    middlewares: [],
  },
]
