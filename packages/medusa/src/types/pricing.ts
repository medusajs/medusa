import { PriceSelectionContext } from "../interfaces/price-selection-strategy"
import { MoneyAmount, Product, ProductVariant, ShippingOption } from "../models"
import { TaxServiceRate } from "./tax-service"

export type ProductVariantPricing = {
  prices: MoneyAmount[]
  original_price: number | null
  calculated_price: number | null
  original_price_includes_tax?: boolean | null
  calculated_price_includes_tax?: boolean | null
  calculated_price_type?: string | null
} & TaxedPricing

export type TaxedPricing = {
  original_price_incl_tax: number | null
  calculated_price_incl_tax: number | null
  original_tax: number | null
  calculated_tax: number | null
  tax_rates: TaxServiceRate[] | null
}

export type PricingContext = {
  price_selection: PriceSelectionContext
  automatic_taxes: boolean
  tax_rate: number | null
}

export type ShippingOptionPricing = {
  price_incl_tax: number | null
  tax_rates: TaxServiceRate[] | null
  tax_amount: number
}

export type PricedShippingOption = Partial<ShippingOption> &
  ShippingOptionPricing

/**
 * @schema PricedVariant
 * title: "Priced Product Variant"
 * type: object
 * allOf:
 *   - $ref: "#/components/schemas/ProductVariant"
 *   - type: object
 *     properties:
 *       original_price:
 *         type: number
 *         description: The original price of the variant without any discounted prices applied.
 *       calculated_price:
 *         type: number
 *         description: The calculated price of the variant. Can be a discounted price.
 *       original_price_incl_tax:
 *         type: number
 *         description: The original price of the variant including taxes.
 *       calculated_price_incl_tax:
 *         type: number
 *         description: The calculated price of the variant including taxes.
 *       original_tax:
 *         type: number
 *         description: The taxes applied on the original price.
 *       calculated_tax:
 *         type: number
 *         description: The taxes applied on the calculated price.
 *       tax_rates:
 *         type: array
 *         description: An array of applied tax rates
 *         items:
 *           type: object
 *           properties:
 *             rate:
 *               type: number
 *               description: The tax rate value
 *             name:
 *               type: string
 *               description: The name of the tax rate
 *             code:
 *               type: string
 *               description: The code of the tax rate
 */
export type PricedVariant = Partial<ProductVariant> & ProductVariantPricing

/**
 * @schema PricedProduct
 * title: "Priced Product"
 * type: object
 * allOf:
 *   - $ref: "#/components/schemas/Product"
 *   - type: object
 *     properties:
 *       variants:
 *         type: array
 *         items:
 *           $ref: "#/components/schemas/PricedVariant"
 */
export type PricedProduct = Omit<Partial<Product>, "variants"> & {
  variants: PricedVariant[]
}
