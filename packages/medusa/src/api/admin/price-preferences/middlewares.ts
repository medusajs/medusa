import { MiddlewareRoute } from "@medusajs/framework/http"
import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import * as QueryConfig from "./query-config"
import {
  AdminCreatePricePreference,
  AdminGetPricePreferenceParams,
  AdminGetPricePreferencesParams,
  AdminUpdatePricePreference,
} from "./validators"

export const adminPricePreferencesRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/admin/price-preferences",
    middlewares: [
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
      validateAndTransformBody(AdminUpdatePricePreference),
      validateAndTransformQuery(
        AdminGetPricePreferenceParams,
        QueryConfig.retrivePricePreferenceQueryConfig
      ),
    ],
  },
]
