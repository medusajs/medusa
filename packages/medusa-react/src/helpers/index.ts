/**
 * @packageDocumentation
 * 
 * `medusa-react` exposes a set of utility functions that are mainly used to retrieve or format the price of a product variant.
 * 
 * @customNamespace Utilities
 */

import { ProductVariantInfo, RegionInfo } from "../types"
import { isEmpty } from "../utils"

/**
 * @interface
 * 
 * Options to format a variant's price.
 */
export type FormatVariantPriceParams = {
  /**
   * A variant's details.
   */
  variant: ProductVariantInfo
  /**
   * A region's details.
   */
  region: RegionInfo
  /**
   * Whether the computed price should include taxes or not.
   * 
   * @defaultValue true
   */
  includeTaxes?: boolean
  /**
   * The minimum number of fraction digits to use when formatting the price. This is passed as an option to `Intl.NumberFormat` in the underlying layer. 
   * You can learn more about this method’s options in 
   * [MDN’s documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat#parameters).
   */
  minimumFractionDigits?: number
  /**
   * The maximum number of fraction digits to use when formatting the price. This is passed as an option to `Intl.NumberFormat` which is used within the utility method.
   * You can learn more about this method’s options in 
   * [MDN’s documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat#parameters).
   */
  maximumFractionDigits?: number
  /**
   * A BCP 47 language tag. The default value is `en-US`. This is passed as a first parameter to `Intl.NumberFormat` which is used within the utility method. 
   * You can learn more about this method’s parameters in 
   * [MDN’s documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat#parameters).
   */
  locale?: string
}

/**
 * This utility function can be used to compute the price of a variant for a region and retrieve the formatted amount. For example, `$20.00`.
 * 
 * @param {FormatVariantPriceParams} param0 - Options to format the variant's price.
 * @returns {string} The formatted price.
 * 
 * @example
 * ```tsx title="src/Products.ts"
 * import React from "react"
 * import { formatVariantPrice } from "medusa-react"
 * import { Product, ProductVariant } from "@medusajs/medusa"
 * 
 * const Products = () => {
 *   // ...
 *   return (
 *     <ul>
 *       {products?.map((product: Product) => (
 *         <li key={product.id}>
 *           {product.title}
 *           <ul>
 *             {product.variants.map((variant: ProductVariant) => (
 *               <li key={variant.id}>
 *                 {formatVariantPrice({
 *                   variant,
 *                   region, // should be retrieved earlier
 *                 })}
 *               </li>
 *             ))}
 *           </ul>
 *         </li>
 *       ))}
 *     </ul>
 *   )
 * }
 * ```
 * 
 * @customNamespace Utilities
 */
export const formatVariantPrice = ({
  variant,
  region,
  includeTaxes = true,
  ...rest
}: FormatVariantPriceParams) => {
  const amount = computeVariantPrice({ variant, region, includeTaxes })

  return convertToLocale({
    amount,
    currency_code: region?.currency_code,
    ...rest,
  })
}

/**
 * @interface
 * 
 * Options to format a variant's price.
 */
export type ComputeVariantPriceParams = {
  /**
   * A variant's details.
   */
  variant: ProductVariantInfo
  /**
   * A region's details.
   */
  region: RegionInfo
  /**
   * Whether the computed price should include taxes or not.
   * 
   * @defaultValue true
   */
  includeTaxes?: boolean
}

/**
 * This utility function can be used to compute the price of a variant for a region and retrieve the amount without formatting. 
 * For example, `20`. This method is used by {@link formatVariantPrice} before applying the price formatting.
 * 
 * @param {ComputeVariantPriceParams} param0 - Options to compute the variant's price.
 * @returns The computed price of the variant.
 * 
 * @example
 * ```tsx title="src/Products.ts"
 * import React from "react"
 * import { computeVariantPrice } from "medusa-react"
 * import { Product, ProductVariant } from "@medusajs/medusa"
 * 
 * const Products = () => {
 *   // ...
 *   return (
 *     <ul>
 *       {products?.map((product: Product) => (
 *         <li key={product.id}>
 *           {product.title}
 *           <ul>
 *             {product.variants.map((variant: ProductVariant) => (
 *               <li key={variant.id}>
 *                 {computeVariantPrice({
 *                   variant,
 *                   region, // should be retrieved earlier
 *                 })}
 *               </li>
 *             ))}
 *           </ul>
 *         </li>
 *       ))}
 *     </ul>
 *   )
 * }
 * ```
 * 
 * @customNamespace Utilities
 */
export const computeVariantPrice = ({
  variant,
  region,
  includeTaxes = true,
}: ComputeVariantPriceParams) => {
  const amount = getVariantPrice(variant, region)

  return computeAmount({
    amount,
    region,
    includeTaxes,
  })
}

/**
 * This utility function is used to retrieve a variant's price in a region. It doesn't take into account taxes or any options, so you typically wouldn't need this function on its own.
 * It's used by the {@link computeVariantPrice} function to retrieve the variant's price in a region before computing the correct price for the options provided.
 * 
 * @param {ProductVariantInfo} variant - The variant's details.
 * @param {RegionInfo} region - The region's details.
 * @returns {number} The variant's price in a region.
 * 
 * @example
 * ```tsx title="src/Products.ts"
 * import React from "react"
 * import { getVariantPrice } from "medusa-react"
 * import { Product, ProductVariant } from "@medusajs/medusa"
 * 
 * const Products = () => {
 *   // ...
 *   return (
 *     <ul>
 *       {products?.map((product: Product) => (
 *         <li key={product.id}>
 *           {product.title}
 *           <ul>
 *             {product.variants.map((variant: ProductVariant) => (
 *               <li key={variant.id}>
 *                 {getVariantPrice(
 *                   variant,
 *                   region, // should be retrieved earlier
 *                 )}
 *               </li>
 *             ))}
 *           </ul>
 *         </li>
 *       ))}
 *     </ul>
 *   )
 * }
 * ```
 * 
 * @customNamespace Utilities
 */
export const getVariantPrice = (
  variant: ProductVariantInfo,
  region: RegionInfo
) => {
  let price = variant?.prices?.find(
    (p) =>
      p.currency_code.toLowerCase() === region?.currency_code?.toLowerCase()
  )

  return price?.amount || 0
}

/**
 * Options to compute an amount.
 */
export type ComputeAmountParams = {
  /**
   * The original amount used for computation.
   */
  amount: number
  /**
   * The region's details.
   */
  region: RegionInfo
  /**
   * Whether the computed price should include taxes or not.
   * 
   * @defaultValue true
   */
  includeTaxes?: boolean
}

/**
 * This utility function can be used to compute the price of an amount for a region and retrieve the amount without formatting. For example, `20`.
 * This function is used by {@link formatAmount} before applying the price formatting.
 * 
 * The main difference between this utility function and {@link computeVariantPrice} is that you don’t need to pass a complete variant object. This can be used with any number.
 * 
 * @param {ComputeAmountParams} params0 - The options to compute the amount.
 * @returns {number} The computed amount.
 * 
 * @example
 * ```tsx title="src/MyComponent.ts"
 * import React from "react"
 * import { computeAmount } from "medusa-react"
 * 
 * const MyComponent = () => {
 *   // ...
 *   return (
 *     <div>
 *       {computeAmount({
 *         amount,
 *         region, // should be retrieved earlier
 *       })}
 *     </div>
 *   )
 * }
 * ```
 * 
 * @customNamespace Utilities
 */
export const computeAmount = ({
  amount,
  region,
  includeTaxes = true,
}: ComputeAmountParams) => {
  const toDecimal = convertToDecimal(amount, region)

  const taxRate = includeTaxes ? getTaxRate(region) : 0

  const amountWithTaxes = toDecimal * (1 + taxRate)

  return amountWithTaxes
}

/**
 * Options to format an amount.
 */
export type FormatAmountParams = {
  /**
   * The original amount used for computation.
   */
  amount: number
  /**
   * The region's details.
   */
  region: RegionInfo
  /**
   * Whether the computed price should include taxes or not.
   * 
   * @defaultValue true
   */
  includeTaxes?: boolean
  /**
   * The minimum number of fraction digits to use when formatting the price. This is passed as an option to `Intl.NumberFormat` in the underlying layer. 
   * You can learn more about this method’s options in 
   * [MDN’s documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat#parameters).
   */
  minimumFractionDigits?: number
  /**
   * The maximum number of fraction digits to use when formatting the price. This is passed as an option to `Intl.NumberFormat` which is used within the utility method. 
   * You can learn more about this method’s options in 
   * [MDN’s documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat#parameters).
   */
  maximumFractionDigits?: number
  /**
   * A BCP 47 language tag. The default value is `en-US`. This is passed as a first parameter to `Intl.NumberFormat` which is used within the utility method. 
   * You can learn more about this method’s parameters in 
   * [MDN’s documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat#parameters).
   */
  locale?: string
}

/**
 * This utility function can be used to compute the price of an amount for a region and retrieve the formatted amount. For example, `$20.00`.
 * 
 * The main difference between this utility function and {@link formatVariantPrice} is that you don’t need to pass a complete variant object. This can be used with any number.
 * 
 * @param {FormatAmountParams} param0 - Options to format the amount.
 * @returns {string} The formatted price.
 * 
 * @example
 * import React from "react"
 * import { formatVariantPrice } from "medusa-react"
 * import { Product, ProductVariant } from "@medusajs/medusa"
 * 
 * const Products = () => {
 *   // ...
 *   return (
 *     <ul>
 *       {products?.map((product: Product) => (
 *         <li key={product.id}>
 *           {product.title}
 *           <ul>
 *             {product.variants.map((variant: ProductVariant) => (
 *               <li key={variant.id}>
 *                 {formatVariantPrice({
 *                   variant,
 *                   region, // should be retrieved earlier
 *                 })}
 *               </li>
 *             ))}
 *           </ul>
 *         </li>
 *       ))}
 *     </ul>
 *   )
 * }
 * 
 * @customNamespace Utilities
 */
export const formatAmount = ({
  amount,
  region,
  includeTaxes = true,
  ...rest
}: FormatAmountParams) => {
  const taxAwareAmount = computeAmount({
    amount,
    region,
    includeTaxes,
  })
  return convertToLocale({
    amount: taxAwareAmount,
    currency_code: region.currency_code,
    ...rest,
  })
}

// we should probably add a more extensive list
const noDivisionCurrencies = ["pkr","krw", "jpy", "vnd"]

const convertToDecimal = (amount: number, region: RegionInfo) => {
  const divisor = noDivisionCurrencies.includes(
    region?.currency_code?.toLowerCase()
  )
    ? 1
    : 100

  return Math.floor(amount) / divisor
}

const getTaxRate = (region?: RegionInfo) => {
  return region && !isEmpty(region) ? region?.tax_rate / 100 : 0
}

const convertToLocale = ({
  amount,
  currency_code,
  minimumFractionDigits,
  maximumFractionDigits,
  locale = "en-US",
}: ConvertToLocaleParams) => {
  return currency_code && !isEmpty(currency_code)
    ? new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency_code,
        minimumFractionDigits,
        maximumFractionDigits,
      }).format(amount)
    : amount.toString()
}

type ConvertToLocaleParams = {
  amount: number
  currency_code: string
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  locale?: string
}

/**
 * @internal We need to export these types so that they're included in the generated reference documentation.
 */
export { ProductVariantInfo, RegionInfo }