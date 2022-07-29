import { Router } from "express"
import { Store, PaymentProvider, TaxProvider } from "./../../../../"

const route = Router()

export default (app) => {
  app.use("/store", route)

  route.get("/", require("./get-store").default)
  route.get("/payment-providers", require("./list-payment-providers").default)
  route.get("/tax-providers", require("./list-tax-providers").default)
  route.post("/", require("./update-store").default)
  route.post("/currencies/:currency_code", require("./add-currency").default)
  route.delete(
    "/currencies/:currency_code",
    require("./remove-currency").default
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
