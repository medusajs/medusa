import { MoneyAmount, ProductVariant } from "../models"

import { PriceSelectionContext } from "../interfaces"
import { ProductVariantPricing } from "../types/pricing"
import { Request } from "express"
import { isDefined } from "medusa-core-utils"

export async function getProductPricingWithPricingModule(
  req: Request,
  variants: ProductVariant[],
  context: PriceSelectionContext = {}
) {
  const remoteQuery = req.scope.resolve("remoteQuery")
  const pricingModule = req.scope.resolve("pricingModuleService")

  const variables = {
    variant_id: variants.map((variant) => variant.id),
  }

  const priceSetQuery = `
    query {
      variants {
        id
        title
        price {
          price_set {
            id
          }
        }
      }
    }
   `

  const variantPriceSets: VariantsRes[] = await remoteQuery(priceSetQuery, {
    context: variables,
  })

  const variantIdToPriceSetIdsMap = new Map(
    variantPriceSets.map((variantPriceSet) => {
      if (!variantPriceSet.price) {
        return [variantPriceSet.id, []]
      }

      const value = Array.isArray(variantPriceSet.price)
        ? variantPriceSet.price.map((price) => price.price_set_id)
        : [variantPriceSet.price.price_set_id]
      return [variantPriceSet.id, value]
    })
  )

  const priceSetIds = variantPriceSets
    .map((variantPriceSet) => {
      if (!variantPriceSet.price) {
        return []
      }
      return Array.isArray(variantPriceSet.price)
        ? variantPriceSet.price.map((price) => price.price_set_id)
        : [variantPriceSet.price.price_set_id]
    })
    .flat()

  const queryContext: PriceSelectionContext = removeNullish(context)

  if (queryContext.currency_code) {
    queryContext.currency_code = queryContext.currency_code.toUpperCase()
  }

  const prices = await pricingModule.calculatePrices(
    { id: priceSetIds },
    {
      context: queryContext,
    }
  )

  const priceSetMap = new Map<string, MoneyAmount>(
    prices.map((price) => [price.id, price])
  )

  variants.map((variant) => {
    const priceSetIds = variantIdToPriceSetIdsMap.get(variant.id)
    const prices = priceSetIds?.map((id) => priceSetMap.get(id)).filter(Boolean)
    if (prices?.length) {
      let calculatedLowestPrice: number | null = prices.reduce(
        (price: number, comparisonPrice): number => {
          return !comparisonPrice || price < comparisonPrice.amount
            ? price
            : comparisonPrice.amount
        },
        Infinity
      )

      calculatedLowestPrice =
        calculatedLowestPrice === Infinity ? null : calculatedLowestPrice

      const pricingResult: ProductVariantPricing = {
        prices: prices as MoneyAmount[],
        original_price: calculatedLowestPrice,
        calculated_price: calculatedLowestPrice,
        calculated_price_type: null,
        original_price_includes_tax: null,
        calculated_price_includes_tax: null,
        original_price_incl_tax: null,
        calculated_price_incl_tax: null,
        original_tax: null,
        calculated_tax: null,
        tax_rates: null,
      }

      Object.assign(variant, pricingResult)
    }
  })

  return variants
}

export const removeNullish = (
  obj: Record<string, unknown>
): Record<string, unknown> =>
  Object.entries(obj).reduce((resultObject, [currentKey, currentValue]) => {
    if (isDefined(currentValue)) {
      resultObject[currentKey] = currentValue
    }
    return resultObject
  }, {})

export type VariantsRes = {
  id: string
  title: string
  price: VariantsPriceRes | VariantsPriceRes[]
}

type VariantsPriceRes = {
  variant_id: string
  price_set_id: string
}
