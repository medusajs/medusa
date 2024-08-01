import { MiddlewareRoute } from "@medusajs/framework"
import { validateAndTransformBody } from "../../utils/validate-body"
import { validateAndTransformQuery } from "../../utils/validate-query"
import * as QueryConfig from "./query-config"
import {
  AdminCreateDraftOrder,
  AdminGetOrderParams,
  AdminGetOrdersParams,
} from "./validators"

export const adminDraftOrderRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/admin/draft-orders",
    middlewares: [
      validateAndTransformQuery(
        AdminGetOrdersParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/draft-orders/:id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/draft-orders",
    middlewares: [
      validateAndTransformBody(AdminCreateDraftOrder),
      validateAndTransformQuery(
        AdminGetOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
]
