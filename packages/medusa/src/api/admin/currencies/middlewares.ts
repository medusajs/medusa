import { validateAndTransformQuery } from "@zjedene-medusa/framework"
import { MiddlewareRoute } from "@zjedene-medusa/framework/http"
import { PolicyOperation } from "@zjedene-medusa/framework/utils"
import * as QueryConfig from "./query-config"
import { Entities } from "./query-config"
import { AdminGetCurrenciesParams, AdminGetCurrencyParams } from "./validators"

export const adminCurrencyRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/admin/currencies/*",
    policies: [
      {
        resource: Entities.currency,
        operation: PolicyOperation.read,
      },
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/currencies",
    middlewares: [
      validateAndTransformQuery(
        AdminGetCurrenciesParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.currency,
        operation: PolicyOperation.read,
      },
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
