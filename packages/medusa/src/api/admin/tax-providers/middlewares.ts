import * as QueryConfig from "./query-config"
import { Entities } from "./query-config"

import { validateAndTransformQuery } from "@zjedene-medusa/framework"
import { MiddlewareRoute } from "@zjedene-medusa/framework/http"
import { PolicyOperation } from "@zjedene-medusa/framework/utils"

import { AdminGetTaxProvidersParams } from "./validators"

export const adminTaxProviderRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/admin/tax-providers/*",
    policies: [
      {
        resource: Entities.tax_provider,
        operation: PolicyOperation.read,
      },
    ],
  },
  {
    method: "GET",
    matcher: "/admin/tax-providers",
    middlewares: [
      validateAndTransformQuery(
        AdminGetTaxProvidersParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.tax_provider,
        operation: PolicyOperation.read,
      },
    ],
  },
]
