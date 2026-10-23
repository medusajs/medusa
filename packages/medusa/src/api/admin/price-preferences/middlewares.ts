import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import { authorize, MiddlewareRoute } from "@medusajs/framework/http"
import { PolicyOperation } from "@medusajs/framework/utils"
import * as QueryConfig from "./query-config"
import { Entities } from "./query-config"
import {
  AdminCreatePricePreference,
  AdminGetPricePreferenceParams,
  AdminGetPricePreferencesParams,
  AdminUpdatePricePreference,
} from "./validators"

export const adminPricePreferencesRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/admin/price-preferences/*",
    middlewares: [
      authorize([
        {
          resource: Entities.price_preference,
          operation: PolicyOperation.read,
        },
      ]),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/price-preferences",
    middlewares: [
      authorize([
        {
          resource: Entities.price_preference,
          operation: PolicyOperation.read,
        },
      ]),
      validateAndTransformQuery(
        AdminGetPricePreferencesParams,
        QueryConfig.listPricePreferenceQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/price-preferences/:id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetPricePreferenceParams,
        QueryConfig.retrivePricePreferenceQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/price-preferences",
    middlewares: [
      authorize([
        {
          resource: Entities.price_preference,
          operation: PolicyOperation.create,
        },
      ]),
      validateAndTransformBody(AdminCreatePricePreference),
      validateAndTransformQuery(
        AdminGetPricePreferenceParams,
        QueryConfig.retrivePricePreferenceQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/price-preferences/:id",
    middlewares: [
      authorize([
        {
          resource: Entities.price_preference,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminUpdatePricePreference),
      validateAndTransformQuery(
        AdminGetPricePreferenceParams,
        QueryConfig.retrivePricePreferenceQueryConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/price-preferences/:id",
    middlewares: [
      authorize([
        {
          resource: Entities.price_preference,
          operation: PolicyOperation.delete,
        },
      ]),
    ],
  },
]
