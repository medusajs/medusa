import { validateAndTransformQuery } from "@zjedene-medusa/framework"
import { MiddlewareRoute } from "@zjedene-medusa/framework/http"
import { PolicyOperation } from "@zjedene-medusa/framework/utils"
import * as QueryConfig from "./query-config"
import { Entities } from "./query-config"
import { AdminGetLocaleParams, AdminGetLocalesParams } from "./validators"

export const adminLocalesRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/admin/locales/*",
    policies: [
      {
        resource: Entities.store_locale,
        operation: PolicyOperation.read,
      },
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/locales",
    middlewares: [
      validateAndTransformQuery(
        AdminGetLocalesParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.store_locale,
        operation: PolicyOperation.read,
      },
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/locales/:code",
    middlewares: [
      validateAndTransformQuery(
        AdminGetLocaleParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
]
