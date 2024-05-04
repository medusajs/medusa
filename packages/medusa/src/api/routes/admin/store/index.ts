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
 * description: "The store's details with additional details like payment and tax providers."
 * x-expanded-relations:
 *   field: store
 *   relations:
 *     - currencies
 *     - default_currency
 * required:
 *   - store
 * properties:
 *   store:
 *     description: Store details.
 *     $ref: "#/components/schemas/ExtendedStoreDTO"
 */
export type AdminExtendedStoresRes = {
  store: ExtendedStoreDTO
}

/**
 * @schema AdminStoresRes
 * type: object
 * description: "The store's details."
 * required:
 *   - store
 * properties:
 *   store:
 *     description: Store details.
 *     $ref: "#/components/schemas/Store"
 */
export type AdminStoresRes = {
  store: Store
}

/**
 * @schema AdminTaxProvidersList
 * type: object
 * description: "The list of tax providers in a store."
 * required:
 *   - tax_providers
 * properties:
 *   tax_providers:
 *     type: array
 *     description: An array of tax providers details.
 *     items:
 *       $ref: "#/components/schemas/TaxProvider"
 */
export type AdminTaxProvidersList = {
  tax_providers: TaxProvider[]
}

/**
 * @schema AdminPaymentProvidersList
 * type: object
 * description: "The list of payment providers in a store."
 * required:
 *   - payment_providers
 * properties:
 *   payment_providers:
 *     type: array
 *     description: An array of payment providers details.
 *     items:
 *       $ref: "#/components/schemas/PaymentProvider"
 */
export type AdminPaymentProvidersList = {
  payment_providers: PaymentProvider[]
}

export * from "./update-store"
