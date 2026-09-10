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
} from "@medusajs/framework"
import { authorize, MiddlewareRoute } from "@medusajs/framework/http"
import { PolicyOperation } from "@medusajs/framework/utils"

export const adminTaxRegionRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/admin/tax-regions/*",
    middlewares: [
      authorize([
        {
          resource: Entities.tax_region,
          operation: PolicyOperation.read,
        },
      ]),
    ],
  },
  {
    method: "POST",
    matcher: "/admin/tax-regions",
    middlewares: [
      authorize([
        {
          resource: Entities.tax_region,
          operation: PolicyOperation.create,
        },
      ]),
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
      authorize([
        {
          resource: Entities.tax_region,
          operation: PolicyOperation.update,
        },
      ]),
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
      authorize([
        {
          resource: Entities.tax_region,
          operation: PolicyOperation.read,
        },
      ]),
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
  {
    method: "DELETE",
    matcher: "/admin/tax-regions/:id",
    middlewares: [
      authorize([
        {
          resource: Entities.tax_region,
          operation: PolicyOperation.delete,
        },
      ]),
    ],
  },
]
