import { Router } from "express"
import { TaxRate } from "../../../.."
import { DeleteResponse, PaginatedResponse } from "../../../../types/common"
import middlewares from "../../../middlewares"

const route = Router()

export default (app) => {
  app.use("/tax-rates", route)

  /**
   * List tax rates
   */
  route.get("/", middlewares.wrap(require("./list-tax-rates").default))

  /**
   * Get a tax rate
   */
  route.get("/:id", middlewares.wrap(require("./get-tax-rate").default))

  /**
   * Create a tax rate
   */
  route.post("/", middlewares.wrap(require("./create-tax-rate").default))

  /**
   * Update a tax rate
   */
  route.post("/:id", middlewares.wrap(require("./update-tax-rate").default))

  /**
   * Remove products from tax rate
   */
  route.delete(
    "/:id/products/batch",
    middlewares.wrap(require("./remove-from-products").default)
  )

  /**
   * Remove product types from tax rate
   */
  route.delete(
    "/:id/product-types/batch",
    middlewares.wrap(require("./remove-from-product-types").default)
  )

  /**
   * Remove shipping options from tax rate
   */
  route.delete(
    "/:id/shipping-options/batch",
    middlewares.wrap(require("./remove-from-shipping-options").default)
  )

  /**
   * Add products to tax rate
   */
  route.post(
    "/:id/products/batch",
    middlewares.wrap(require("./add-to-products").default)
  )

  /**
   * Add product types to tax rate
   */
  route.post(
    "/:id/product-types/batch",
    middlewares.wrap(require("./add-to-product-types").default)
  )

  /**
   * Add to shipping options
   */
  route.post(
    "/:id/shipping-options/batch",
    middlewares.wrap(require("./add-to-shipping-options").default)
  )

  /**
   * Delete a tax rate
   */
  route.delete("/:id", middlewares.wrap(require("./delete-tax-rate").default))

  return app
}

export const defaultAdminTaxRatesRelations = []

export const defaultAdminTaxRatesFields: (keyof TaxRate)[] = [
  "id",
  "rate",
  "code",
  "name",
  "region_id",
  "created_at",
  "updated_at",
]

/**
 * @schema AdminTaxRatesDeleteRes
 * type: object
 * properties:
 *   id:
 *     type: string
 *     description: The ID of the deleted Shipping Option.
 *   object:
 *     type: string
 *     description: The type of the object that was deleted.
 *     default: tax-rate
 *   deleted:
 *     type: boolean
 *     description: Whether or not the items were deleted.
 *     default: true
 */
export type AdminTaxRatesDeleteRes = DeleteResponse

/**
 * @schema AdminTaxRatesListRes
 * type: object
 * properties:
 *   tax_rates:
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/TaxRate"
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
export type AdminTaxRatesListRes = PaginatedResponse & {
  tax_rates: TaxRate[]
}

/**
 * @schema AdminTaxRatesRes
 * type: object
 * properties:
 *   tax_rate:
 *     $ref: "#/components/schemas/TaxRate"
 */
export type AdminTaxRatesRes = {
  tax_rate: TaxRate
}

export * from "./list-tax-rates"
export * from "./get-tax-rate"
export * from "./remove-from-product-types"
export * from "./remove-from-products"
export * from "./remove-from-shipping-options"
export * from "./add-to-product-types"
export * from "./add-to-products"
export * from "./add-to-shipping-options"
export * from "./create-tax-rate"
export * from "./delete-tax-rate"
export * from "./update-tax-rate"
