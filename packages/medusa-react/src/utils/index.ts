import { isEmpty } from "lodash"
import { RegionInfo, ProductVariant } from "../types"

/**
 * Takes a product variant and region, and returns the variant price as a decimal number
 * @param variant - product variant
 * @param region - region
 * @param includeTaxes - whether to include taxes or not
 */
export const calculateVariantPrice = (
  variant: ProductVariant,
  region: RegionInfo,
  includeTaxes = true
) => {
  const amount = findVariantPrice(variant, region)

  return computeAmount(amount, region, includeTaxes)
}

/**
 * Finds the price amount correspoding to the region selected
 * @param variant - the product variant
 * @param region - the region
 * @returns - the price's amount
 */
export const findVariantPrice = (
  variant: ProductVariant,
  region: RegionInfo
) => {
  let price = variant?.prices?.find(
    (p) =>
      p.currency_code.toLowerCase() === region?.currency_code?.toLowerCase()
  )

  return price?.amount || 0
}

/**
 * Takes an amount, a region, and returns the amount as a decimal including or excluding taxes
 */

export const computeAmount = (
  amount: number,
  region: RegionInfo,
  includeTaxes = true
) => {
  const toDecimal = convertToDecimal(amount, region)

  const taxRate = includeTaxes ? getTaxRate(region) : 0

  const amountWithTaxes = toDecimal * (1 + taxRate)

  return amountWithTaxes
}

/**
 * Takes an amount and a region, and converts the amount to a localized decimal format
 */

export const formatAmount = (
  amount: number,
  region: RegionInfo,
  includeTaxes = true
) => {
  const amountWithTaxes = computeAmount(amount, region, includeTaxes)
  return convertToLocale({
    amount: amountWithTaxes,
    currency_code: region.currency_code,
  })
}

// we should probably add a more extensive list
const noDivisionCurrencies = ["krw", "jpy", "vnd"]

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

export const convertToLocale = ({
  amount,
  currency_code,
  digits = 2,
  locale = "en-US",
}: ConvertToLocaleParams) => {
  return currency_code && !isEmpty(currency_code)
    ? new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency_code,
        minimumFractionDigits: digits,
      }).format(amount)
    : amount
}

type ConvertToLocaleParams = {
  amount: number
  currency_code: string
  digits?: number
  locale?: string
}
