import { MiddlewareRoute } from "../../../types/middlewares"
import { validateAndTransformQuery } from "../../utils/validate-query"
import * as QueryConfig from "./query-config"
import { AdminGetFulfillmentProvidersParams } from "./validators"

export const adminFulfillmentProvidersRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/admin/fulfillment-providers",
    middlewares: [
      validateAndTransformQuery(
        AdminGetFulfillmentProvidersParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
  },
]
