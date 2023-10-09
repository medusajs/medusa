import { MoneyAmount, Product } from "@medusajs/client-types"

/**
 * Extract currencies that the product variants have pricing in.
 */
export function getAllProductPricesCurrencies(product: Product) {
  const currencyMap: Record<string, true> = {}

  product.variants!.forEach((variant) => {
    variant.prices!.forEach((price) => {
      if (
        price.price_list_id ||
        price.region_id ||
        price.min_quantity ||
        price.max_quantity
      ) {
        return
      }
      currencyMap[price.currency_code] = true
    })
  })

  return Object.keys(currencyMap)
}

/**
 * Extract regions that the product variants have pricing in.
 */
export function getAllProductPricesRegions(product: Product) {
  const regionMap: Record<string, true> = {}

  product.variants!.forEach((variant) => {
    variant.prices!.forEach((price) => {
      if (
        price.price_list_id ||
        price.min_quantity ||
        price.max_quantity ||
        !price.region_id
      ) {
        return
      }
      regionMap[price.region_id] = true
    })
  })

  return Object.keys(regionMap)
}

/**
 * Return only currency prices.
 */
export function getCurrencyPricesOnly(prices: MoneyAmount[]) {
  return prices.filter((price) => {
    if (
      price.price_list_id ||
      price.region_id ||
      price.min_quantity ||
      price.max_quantity
    ) {
      return false
    }
    return true
  })
}

/**
 * Return only region prices.
 */
export function getRegionPricesOnly(prices: MoneyAmount[]) {
  return prices.filter((price) => {
    return !(price.price_list_id || price.min_quantity || price.max_quantity)
  })
}

/**
 * Modulo operation
 */
export function mod(n: number, m: number) {
  return ((n % m) + m) % m
}

export const isText = (v: string) => {
  return v !== "" && isNaN(Number(v))
}
