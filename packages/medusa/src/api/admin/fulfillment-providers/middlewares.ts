import { MiddlewareRoute } from "../../../types/middlewares"
import { validateAndTransformQuery } from "../../utils/validate-query"
import * as QueryConfig from "./query-config"
import { AdminFulfillmentProvidersParams } from "./validators"

export const adminFulfillmentProvidersRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/admin/fulfillment-providers",
    middlewares: [
      validateAndTransformQuery(
        AdminFulfillmentProvidersParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
  },
]
