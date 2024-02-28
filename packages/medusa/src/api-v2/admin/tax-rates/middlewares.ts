import * as QueryConfig from "./query-config"

import { AdminGetTaxRatesTaxRateParams } from "./validators"
import { transformQuery } from "../../../api/middlewares"

import { MiddlewareRoute } from "../../../loaders/helpers/routing/types"
import { authenticate } from "../../../utils/authenticate-middleware"

export const adminTaxRateRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["ALL"],
    matcher: "/admin/tax-rates*",
    middlewares: [authenticate("admin", ["bearer", "session", "api-key"])],
  },
  {
    method: ["GET"],
    matcher: "/admin/tax-rates/:id",
    middlewares: [
      transformQuery(
        AdminGetTaxRatesTaxRateParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
]
