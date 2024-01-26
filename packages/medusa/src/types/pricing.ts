import { MoneyAmount, Product, ProductVariant, ShippingOption } from "../models"

import { PriceSelectionContext } from "../interfaces/price-selection-strategy"
import { TaxServiceRate } from "./tax-service"

/**
 * Pricing fields for product variants.
 */
export type ProductVariantPricing = {
  /**
   * The list of prices.
   */
  prices: MoneyAmount[]
  /**
   * The original price of the variant.
   */
  original_price: number | null
  /**
   * The lowest price among the retrieved prices.
   */
  calculated_price: number | null
  /**
   * Whether the `original_price` field includes taxes.
   *
   * @featureFlag tax_inclusive_pricing
   */
  original_price_includes_tax?: boolean | null
  /**
   * Whether the `calculated_price` field includes taxes.
   *
   * @featureFlag tax_inclusive_pricing
   */
  calculated_price_includes_tax?: boolean | null
  /**
   * Either `default` if the `calculated_price` is the original price, or the type of the price list applied, if any.
   */
  calculated_price_type?: string | null
} & TaxedPricing

/**
 * Pricing fields related to taxes.
 */
export type TaxedPricing = {
  /**
   * The price after applying the tax amount on the original price.
   */
  original_price_incl_tax: number | null
  /**
   * The price after applying the tax amount on the calculated price.
   */
  calculated_price_incl_tax: number | null
  /**
   * The tax amount applied to the original price.
   */
  original_tax: number | null
  /**
   * The tax amount applied to the calculated price.
   */
  calculated_tax: number | null
  /**
   * The list of tax rates.
   */
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

/** @schema PricedShippingOption
 * title: "Priced Shipping Option"
 * type: object
 * allOf:
 *   - $ref: "#/components/schemas/ShippingOption"
 *   - type: object
 *     properties:
 *       price_incl_tax:
 *         type: number
 *         description: Price including taxes
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
 *       tax_amount:
 *         type: number
 *         description: The taxes applied.
 */
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
 *         description: "The product variants and their prices."
 *         type: array
 *         items:
 *           $ref: "#/components/schemas/PricedVariant"
 */
export type PricedProduct = Omit<Partial<Product>, "variants"> & {
  variants: PricedVariant[]
}

export type VariantPriceSetRes = {
  id: string
  title: string
  price: PriceModulePrice | PriceModulePrice[]
}

type PriceModulePrice = {
  variant_id: string
  price_set_id: string
}
