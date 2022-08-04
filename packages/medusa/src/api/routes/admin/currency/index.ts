import { Router } from "express"
import middlewares, {
  transformBody,
  transformQuery,
} from "../../../middlewares"
import { AdminGetCurrenciesParams } from "./list-currencies"
import { AdminPostCurrenciesCurrencyReq } from "./update-currency"
import { isFeatureFlagEnabled } from "../../../middlewares/feature-flag-enabled"
import TaxInclusivePricingFeatureFlag from "../../../../loaders/feature-flags/tax-inclusive-pricing"

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

export * from "./list-currencies"
export * from "./update-currency"
