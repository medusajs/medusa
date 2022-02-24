import { Router } from "express"
import { Store, PaymentProvider, TaxProvider } from "./../../../../"
import middlewares from "../../../middlewares"

const route = Router()

export default (app) => {
  app.use("/store", route)

  route.get("/", middlewares.wrap(require("./get-store").default))
  route.get(
    "/payment-providers",
    middlewares.wrap(require("./list-payment-providers").default)
  )
  route.get(
    "/tax-providers",
    middlewares.wrap(require("./list-tax-providers").default)
  )
  route.post("/", middlewares.wrap(require("./update-store").default))
  route.post(
    "/currencies/:currency_code",
    middlewares.wrap(require("./add-currency").default)
  )
  route.delete(
    "/currencies/:currency_code",
    middlewares.wrap(require("./remove-currency").default)
  )

  return app
}

export type AdminStoresRes = {
  store: Store
}

export type AdminTaxProvidersList = {
  tax_providers: TaxProvider[]
}

export type AdminPaymentProvidersList = {
  payment_providers: PaymentProvider[]
}

export * from "./update-store"
