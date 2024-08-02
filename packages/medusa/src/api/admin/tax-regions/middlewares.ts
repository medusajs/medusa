import * as QueryConfig from "./query-config"

import {
  AdminCreateTaxRegion,
  AdminGetTaxRegionParams,
  AdminGetTaxRegionsParams,
} from "./validators"

import { MiddlewareRoute } from "@medusajs/framework"
import { validateAndTransformBody } from "../../utils/validate-body"
import { validateAndTransformQuery } from "../../utils/validate-query"

export const adminTaxRegionRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: "POST",
    matcher: "/admin/tax-regions",
    middlewares: [
      validateAndTransformBody(AdminCreateTaxRegion),
      validateAndTransformQuery(
        AdminGetTaxRegionsParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
  },
  {
    method: "GET",
    matcher: "/admin/tax-regions",
    middlewares: [
      validateAndTransformQuery(
        AdminGetTaxRegionsParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
  },
  {
    method: "GET",
    matcher: "/admin/tax-regions/:id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetTaxRegionParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
]
