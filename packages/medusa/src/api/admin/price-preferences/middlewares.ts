import { MiddlewareRoute } from "@medusajs/framework"
import { validateAndTransformBody } from "../../utils/validate-body"
import { validateAndTransformQuery } from "../../utils/validate-query"
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
