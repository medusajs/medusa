import * as QueryConfig from "./query-config"

import {
  AdminGetTaxRatesTaxRateParams,
  AdminPostTaxRatesReq,
  AdminPostTaxRatesTaxRateReq,
} from "./validators"
import { transformBody, transformQuery } from "../../../api/middlewares"

import { MiddlewareRoute } from "../../../loaders/helpers/routing/types"
import { authenticate } from "../../../utils/authenticate-middleware"

export const adminTaxRateRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: "ALL",
    matcher: "/admin/tax-rates*",
    middlewares: [authenticate("admin", ["bearer", "session", "api-key"])],
  },
  {
    method: "POST",
    matcher: "/admin/tax-rates",
    middlewares: [transformBody(AdminPostTaxRatesReq)],
  },
  {
    method: "POST",
    matcher: "/admin/tax-rates/:id",
    middlewares: [transformBody(AdminPostTaxRatesTaxRateReq)],
  },
  {
    method: "GET",
    matcher: "/admin/tax-rates/:id",
    middlewares: [
      transformQuery(
        AdminGetTaxRatesTaxRateParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
]
