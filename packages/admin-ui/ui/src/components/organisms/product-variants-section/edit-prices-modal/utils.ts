import React from "react"
import { MoneyAmount, Product } from "@medusajs/client-types"

/**
 * Extract currencies that the product variants have pricing in.
 */
export function getAllProductPricesCurrencies(product: Product) {
  const currencyMap: Record<string, true> = {}

  product.variants!.forEach((variant) => {
    variant.prices!.forEach((price) => {
      if (
        price.price_list ||
        price.region ||
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
        price.price_list ||
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
      price.price_list ||
      price.region ||
      price.min_quantity ||
      price.max_quantity
    ) {
      return false
    }
    return true
  })
}

/**
 * Return only currency prices.
 */
export function getRegionPricesOnly(prices: MoneyAmount[]) {
  return prices.filter((price) => {
    return !(price.price_list || price.min_quantity || price.max_quantity)
  })
}

/**
 * Return vertical midpoint of the clicked cell
 */
export function getCellYMidpoint(event: React.MouseEvent) {
  return (
    (event.currentTarget!.getBoundingClientRect().top +
      event.currentTarget.getBoundingClientRect().bottom) /
    2
  )
}
