import { Router } from "express"
import { PaymentProvider, Store, TaxProvider } from "./../../../../"
import middlewares from "../../../middlewares"
import { ExtendedStoreDTO } from "../../../../types/store"

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

export const defaultRelationsExtended = ["currencies", "default_currency"]

/**
 * @schema AdminExtendedStoresRes
 * type: object
 * x-expanded-relations:
 *   field: store
 *   relations:
 *     - currencies
 *     - default_currency
 * required:
 *   - store
 * properties:
 *   store:
 *     $ref: "#/components/schemas/ExtendedStoreDTO"
 */
export type AdminExtendedStoresRes = {
  store: ExtendedStoreDTO
}

/**
 * @schema AdminStoresRes
 * type: object
 * required:
 *   - store
 * properties:
 *   store:
 *     $ref: "#/components/schemas/Store"
 */
export type AdminStoresRes = {
  store: Store
}

/**
 * @schema AdminTaxProvidersList
 * type: object
 * required:
 *   - tax_providers
 * properties:
 *   tax_providers:
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/TaxProvider"
 */
export type AdminTaxProvidersList = {
  tax_providers: TaxProvider[]
}

/**
 * @schema AdminPaymentProvidersList
 * type: object
 * required:
 *   - payment_providers
 * properties:
 *   payment_providers:
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/PaymentProvider"
 */
export type AdminPaymentProvidersList = {
  payment_providers: PaymentProvider[]
}

export * from "./update-store"
