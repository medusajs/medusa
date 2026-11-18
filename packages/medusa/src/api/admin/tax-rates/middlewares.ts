import * as QueryConfig from "./query-config"
import { Entities } from "./query-config"

import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import { PolicyOperation } from "@medusajs/framework/utils"
import {
  AdminCreateTaxRate,
  AdminCreateTaxRateRule,
  AdminGetTaxRateParams,
  AdminGetTaxRatesParams,
  AdminUpdateTaxRate,
} from "./validators"

import { authorize, MiddlewareRoute } from "@medusajs/framework/http"

export const adminTaxRateRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/admin/tax-rates/*",
    middlewares: [
      authorize([
        {
          resource: Entities.tax_rate,
          operation: PolicyOperation.read,
        },
      ]),
    ],
  },
  {
    method: "POST",
    matcher: "/admin/tax-rates",
    middlewares: [
      authorize([
        {
          resource: Entities.tax_rate,
          operation: PolicyOperation.create,
        },
        {
          resource: Entities.tax_region,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminCreateTaxRate),
      validateAndTransformQuery(
        AdminGetTaxRateParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: "POST",
    matcher: "/admin/tax-rates/:id",
    middlewares: [
      authorize([
        {
          resource: Entities.tax_rate,
          operation: PolicyOperation.update,
        },
        {
          resource: Entities.tax_region,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminUpdateTaxRate),
      validateAndTransformQuery(
        AdminGetTaxRateParams,
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
    method: "DELETE",
    matcher: "/admin/tax-rates/:id",
    middlewares: [
      authorize([
        {
          resource: Entities.tax_rate,
          operation: PolicyOperation.delete,
        },
        {
          resource: Entities.tax_region,
          operation: PolicyOperation.update,
        },
      ]),
    ],
  },
  {
    method: "GET",
    matcher: "/admin/tax-rates",
    middlewares: [
      authorize([
        {
          resource: Entities.tax_rate,
          operation: PolicyOperation.read,
        },
      ]),
      validateAndTransformQuery(
        AdminGetTaxRatesParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
  },
  {
    method: "POST",
    matcher: "/admin/tax-rates/:id/rules",
    middlewares: [
      authorize([
        {
          resource: Entities.tax_rate,
          operation: PolicyOperation.update,
        },
        {
          resource: Entities.tax_region,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminCreateTaxRateRule),
      validateAndTransformQuery(
        AdminGetTaxRateParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: "DELETE",
    matcher: "/admin/tax-rates/:id/rules/:rule_id",
    middlewares: [
      authorize([
        {
          resource: Entities.tax_rate,
          operation: PolicyOperation.update,
        },
        {
          resource: Entities.tax_region,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformQuery(
        AdminGetTaxRateParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
]
