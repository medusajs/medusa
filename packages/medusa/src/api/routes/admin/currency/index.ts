import { Router } from "express"
import middlewares, {
  transformBody,
  transformQuery,
} from "../../../middlewares"
import { AdminGetCurrenciesParams } from "./list-currencies"
import { AdminPostCurrenciesCurrencyReq } from "./update-currency"
import TaxInclusiveFeatureFlag from "../../../../loaders/feature-flags/tax-inclusive"
import { isFeatureFlagEnabled } from "../../../middlewares/feature-flag-enabled"

export default (app) => {
  const route = Router()
  app.use("/currencies", route)

  route.get(
    "/",
    isFeatureFlagEnabled(TaxInclusiveFeatureFlag.key),
    transformQuery(AdminGetCurrenciesParams, {
      isList: true,
    }),
    middlewares.wrap(require("./list-currencies").default)
  )

  route.post(
    "/:code",
    isFeatureFlagEnabled(TaxInclusiveFeatureFlag.key),
    transformBody(AdminPostCurrenciesCurrencyReq),
    middlewares.wrap(require("./update-currency").default)
  )

  return app
}

export * from "./list-currencies"
export * from "./update-currency"
