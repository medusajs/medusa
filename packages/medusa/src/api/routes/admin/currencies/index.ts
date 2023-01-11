import { Router } from "express"
import { Currency } from "../../../.."
import TaxInclusivePricingFeatureFlag from "../../../../loaders/feature-flags/tax-inclusive-pricing"
import { PaginatedResponse } from "../../../../types/common"
import middlewares, {
  transformBody,
  transformQuery,
} from "../../../middlewares"
import { isFeatureFlagEnabled } from "../../../middlewares/feature-flag-enabled"
import { AdminGetCurrenciesParams } from "./list-currencies"
import { AdminPostCurrenciesCurrencyReq } from "./update-currency"

export default (app) => {
  const route = Router()
  app.use("/currencies", route)

  route.get(
    "/",
    transformQuery(AdminGetCurrenciesParams, {
      isList: true,
    }),
    middlewares.wrap(require("./list-currencies").default)
  )

  route.post(
    "/:code",
    transformBody(AdminPostCurrenciesCurrencyReq),
    isFeatureFlagEnabled(TaxInclusivePricingFeatureFlag.key),
    middlewares.wrap(require("./update-currency").default)
  )

  return app
}

/**
 * @schema AdminCurrenciesListRes
 * type: object
 * properties:
 *   currencies:
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/Currency"
 *   count:
 *     type: integer
 *     description: The total number of items available
 *   offset:
 *     type: integer
 *     description: The number of items skipped before these items
 *   limit:
 *     type: integer
 *     description: The number of items per page
 */
export type AdminCurrenciesListRes = PaginatedResponse & {
  currencies: Currency[]
}

/**
 * @schema AdminCurrenciesRes
 * type: object
 * properties:
 *   currency:
 *       $ref: "#/components/schemas/Currency"
 */
export type AdminCurrenciesRes = {
  currency: Currency
}

export * from "./list-currencies"
export * from "./update-currency"
