import * as QueryConfig from "./query-config"
import { Entities } from "./query-config"

import {
  AdminCreateTaxRegion,
  AdminGetTaxRegionParams,
  AdminGetTaxRegionsParams,
  AdminUpdateTaxRegion,
} from "./validators"

import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@zjedene-medusa/framework"
import { MiddlewareRoute } from "@zjedene-medusa/framework/http"
import { PolicyOperation } from "@zjedene-medusa/framework/utils"

export const adminTaxRegionRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/admin/tax-regions/*",
    policies: [
      {
        resource: Entities.tax_region,
        operation: PolicyOperation.read,
      },
    ],
  },
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
    policies: [
      {
        resource: Entities.tax_region,
        operation: PolicyOperation.create,
      },
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
    policies: [
      {
        resource: Entities.tax_region,
        operation: PolicyOperation.update,
      },
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
    policies: [
      {
        resource: Entities.tax_region,
        operation: PolicyOperation.read,
      },
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
  {
    method: "DELETE",
    matcher: "/admin/tax-regions/:id",
    middlewares: [],
    policies: [
      {
        resource: Entities.tax_region,
        operation: PolicyOperation.delete,
      },
    ],
  },
]
