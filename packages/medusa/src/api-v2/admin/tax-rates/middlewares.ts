import * as QueryConfig from "./query-config"

import { transformBody } from "../../../api/middlewares"
import { validateAndTransformQuery } from "../../utils/validate-query"
import {
  AdminGetTaxRateParams,
  AdminGetTaxRatesParams,
  AdminPostTaxRatesReq,
  AdminPostTaxRatesTaxRateReq,
  AdminPostTaxRatesTaxRateRulesReq,
} from "./validators"

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
    middlewares: [
      transformBody(AdminPostTaxRatesReq),
      validateAndTransformQuery(
        AdminGetTaxRatesParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: "POST",
    matcher: "/admin/tax-rates/:id",
    middlewares: [
      transformBody(AdminPostTaxRatesTaxRateReq),
      validateAndTransformQuery(
        AdminGetTaxRatesParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: "GET",
    matcher: "/admin/tax-rates/:id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetTaxRateParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: "GET",
    matcher: "/admin/tax-rates",
    middlewares: [
      validateAndTransformQuery(
        AdminGetTaxRatesParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
  },
  {
    method: "POST",
    matcher: "/admin/tax-rates/:id/rules",
    middlewares: [transformBody(AdminPostTaxRatesTaxRateRulesReq)],
  },
]
