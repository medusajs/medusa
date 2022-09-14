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
  app.use(
    "/currencies",
    isFeatureFlagEnabled(TaxInclusivePricingFeatureFlag.key),
    route
  )

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
    middlewares.wrap(require("./update-currency").default)
  )

  return app
}

export type AdminCurrenciesListRes = PaginatedResponse & {
  currencies: Currency[]
}

export type AdminCurrenciesRes = {
  currency: Currency
}

export * from "./list-currencies"
export * from "./update-currency"
