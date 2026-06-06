import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@zjedene-medusa/framework"
import { MiddlewareRoute } from "@zjedene-medusa/framework/http"
import { PolicyOperation } from "@zjedene-medusa/framework/utils"
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
    policies: [
      {
        resource: Entities.price_preference,
        operation: PolicyOperation.read,
      },
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/price-preferences",
    middlewares: [
      validateAndTransformQuery(
        AdminGetPricePreferencesParams,
        QueryConfig.listPricePreferenceQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.price_preference,
        operation: PolicyOperation.read,
      },
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
      validateAndTransformBody(AdminCreatePricePreference),
      validateAndTransformQuery(
        AdminGetPricePreferenceParams,
        QueryConfig.retrivePricePreferenceQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.price_preference,
        operation: PolicyOperation.create,
      },
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/price-preferences/:id",
    middlewares: [
      validateAndTransformBody(AdminUpdatePricePreference),
      validateAndTransformQuery(
        AdminGetPricePreferenceParams,
        QueryConfig.retrivePricePreferenceQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.price_preference,
        operation: PolicyOperation.update,
      },
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/price-preferences/:id",
    middlewares: [],
    policies: [
      {
        resource: Entities.price_preference,
        operation: PolicyOperation.delete,
      },
    ],
  },
]
