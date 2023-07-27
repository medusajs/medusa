import { Router } from "express"
import { TaxRate } from "../../../.."
import { AdminPostTaxRatesTaxRateParams } from "./update-tax-rate"
import { AdminGetTaxRatesParams } from "./list-tax-rates"
import { AdminGetTaxRatesTaxRateParams } from "./get-tax-rate"
import { AdminPostTaxRatesParams } from "./create-tax-rate"
import { AdminPostTaxRatesTaxRateShippingOptionsParams } from "./add-to-shipping-options"
import { AdminPostTaxRatesTaxRateProductTypesParams } from "./add-to-product-types"
import { AdminPostTaxRatesTaxRateProductsParams } from "./add-to-products"
import { AdminDeleteTaxRatesTaxRateShippingOptionsParams } from "./remove-from-shipping-options"
import { AdminDeleteTaxRatesTaxRateProductTypesParams } from "./remove-from-product-types"
import { AdminDeleteTaxRatesTaxRateProductsParams } from "./remove-from-products"
import { DeleteResponse, PaginatedResponse } from "../../../../types/common"
import middlewares, { transformQuery } from "../../../middlewares"

const route = Router()

export default (app) => {
  app.use("/tax-rates", route)

  /**
   * List tax rates
   */
  route.get("/", 
    transformQuery(AdminGetTaxRatesParams, {
      defaultFields: defaultAdminTaxRatesFields,
      defaultRelations: defaultAdminTaxRatesRelations,
      isList: true,
    }),
    middlewares.wrap(require("./list-tax-rates").default
  ))

  /**
   * Get a tax rate
   */
  route.get("/:id", 
    transformQuery(AdminGetTaxRatesTaxRateParams, {
      defaultFields: defaultAdminTaxRatesFields,
      defaultRelations: defaultAdminTaxRatesRelations,
      isList: false,
    }),
    middlewares.wrap(require("./get-tax-rate").default
  ))

  /**
   * Create a tax rate
   */
  route.post("/", 
    transformQuery(AdminPostTaxRatesParams, {
      defaultFields: defaultAdminTaxRatesFields,
      defaultRelations: defaultAdminTaxRatesRelations,
      isList: false,
    }),
    middlewares.wrap(require("./create-tax-rate").default)
  )

  /**
   * Update a tax rate
   */
  route.post("/:id",
    transformQuery(AdminPostTaxRatesTaxRateParams, {
      defaultFields: defaultAdminTaxRatesFields,
      defaultRelations: defaultAdminTaxRatesRelations,
      isList: false,
    }),
    middlewares.wrap(require("./update-tax-rate").default)
  )

  /**
   * Remove products from tax rate
   */
  route.delete(
    "/:id/products/batch",
    transformQuery(AdminDeleteTaxRatesTaxRateProductsParams, {
      defaultFields: defaultAdminTaxRatesFields,
      defaultRelations: defaultAdminTaxRatesRelations,
      isList: false,
    }),
    middlewares.wrap(require("./remove-from-products").default)
  )

  /**
   * Remove product types from tax rate
   */
  route.delete(
    "/:id/product-types/batch",
    transformQuery(AdminDeleteTaxRatesTaxRateProductTypesParams, {
      defaultFields: defaultAdminTaxRatesFields,
      defaultRelations: defaultAdminTaxRatesRelations,
      isList: false,
    }),
    middlewares.wrap(require("./remove-from-product-types").default)
  )

  /**
   * Remove shipping options from tax rate
   */
  route.delete(
    "/:id/shipping-options/batch",
    transformQuery(AdminDeleteTaxRatesTaxRateShippingOptionsParams, {
      defaultFields: defaultAdminTaxRatesFields,
      defaultRelations: defaultAdminTaxRatesRelations,
      isList: false,
    }),
    middlewares.wrap(require("./remove-from-shipping-options").default)
  )

  /**
   * Add products to tax rate
   */
  route.post(
    "/:id/products/batch",
    transformQuery(AdminPostTaxRatesTaxRateProductsParams, {
      defaultFields: defaultAdminTaxRatesFields,
      defaultRelations: defaultAdminTaxRatesRelations,
      isList: false,
    }),
    middlewares.wrap(require("./add-to-products").default)
  )

  /**
   * Add product types to tax rate
   */
  route.post(
    "/:id/product-types/batch",
    transformQuery(AdminPostTaxRatesTaxRateProductTypesParams, {
      defaultFields: defaultAdminTaxRatesFields,
      defaultRelations: defaultAdminTaxRatesRelations,
      isList: false,
    }),
    middlewares.wrap(require("./add-to-product-types").default)
  )

  /**
   * Add to shipping options
   */
  route.post(
    "/:id/shipping-options/batch",
    transformQuery(AdminPostTaxRatesTaxRateShippingOptionsParams, {
      defaultFields: defaultAdminTaxRatesFields,
      defaultRelations: defaultAdminTaxRatesRelations,
      isList: false,
    }),
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
 * required:
 *   - id
 *   - object
 *   - deleted
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
 * required:
 *   - tax_rates
 *   - count
 *   - offset
 *   - limit
 * properties:
 *   tax_rates:
 *     type: array
 *     description: "An array of tax rate details."
 *     items:
 *       $ref: "#/components/schemas/TaxRate"
 *   count:
 *     type: integer
 *     description: The total number of items available
 *   offset:
 *     type: integer
 *     description: The number of tax rates to skip when retrieving the tax rates.
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
 * required:
 *   - tax_rate
 * properties:
 *   tax_rate:
 *     description: "Tax rate details."
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
