import * as QueryConfig from "./query-config"

import {
  AdminCreateTaxRegion,
  AdminGetTaxRegionParams,
  AdminGetTaxRegionsParams,
  AdminUpdateTaxRegion,
} from "./validators"

import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import { MiddlewareRoute } from "@medusajs/framework/http"

export const adminTaxRegionRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: "POST",
    matcher: "/admin/tax-regions",
    middlewares: [
      validateAndTransformBody(AdminCreateTaxRegion),
      validateAndTransformQuery(
        AdminGetTaxRegionsParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: "POST",
    matcher: "/admin/tax-regions/:id",
    middlewares: [
      validateAndTransformBody(AdminUpdateTaxRegion),
      validateAndTransformQuery(
        AdminGetTaxRegionsParams,
        QueryConfig.retrieveTransformQueryConfig
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
