import { MiddlewareRoute } from "@medusajs/framework"
import { validateAndTransformQuery } from "../../utils/validate-query"
import * as QueryConfig from "./query-config"
import { AdminGetCurrencyParams, AdminGetCurrenciesParams } from "./validators"

export const adminCurrencyRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/admin/currencies",
    middlewares: [
      validateAndTransformQuery(
        AdminGetCurrenciesParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/currencies/:code",
    middlewares: [
      validateAndTransformQuery(
        AdminGetCurrencyParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
]
