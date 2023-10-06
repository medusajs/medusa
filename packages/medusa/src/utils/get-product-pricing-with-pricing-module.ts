import { Request } from "express"
import { PriceSelectionContext } from "../interfaces"
import { MoneyAmount, ProductVariant } from "../models"
import { isDefined } from "medusa-core-utils"
import { ProductVariantPricing } from "../types/pricing"

export async function getProductPricingWithPricingModule(
  req: Request,
  variants: ProductVariant[],
  context: PriceSelectionContext = {}
) {
  const remoteQuery = req.scope.resolve("remoteQuery")
  const pricingModule = req.scope.resolve("pricingModuleService")

  const variables = {
    variant_id: variants.map((v) => v.id),
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

  const res: VariantsRes[] = await remoteQuery(priceSetQuery, {
    context: variables,
  })

  const variantIdToPriceSetIdsMap = new Map(
    res.map((r) => {
      if (!r.price) {
        return [r.id, []]
      }

      const value = Array.isArray(r.price)
        ? r.price.map((p) => p.price_set_id)
        : [r.price.price_set_id]
      return [r.id, value]
    })
  )

  const priceSetIds = res
    .map((r) => {
      if (!r.price) {
        return []
      }
      return Array.isArray(r.price)
        ? r.price.map((p) => p.price_set_id)
        : [r.price.price_set_id]
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

  const priceSetMap = new Map<string, MoneyAmount>(prices.map((p) => [p.id, p]))

  variants.map((v) => {
    const priceSetIds = variantIdToPriceSetIdsMap.get(v.id)
    const prices = priceSetIds?.map((id) => priceSetMap.get(id)).filter(Boolean)
    if (prices?.length) {
      const calculatedPrice = prices.reduce((acc: number, curr): number => {
        return !curr || acc < curr.amount ? acc : curr.amount
      }, Infinity)

      const pricingResult: ProductVariantPricing = {
        prices: prices as MoneyAmount[],
        original_price: calculatedPrice,
        calculated_price: calculatedPrice,
        calculated_price_type: null,
        original_price_includes_tax: null,
        calculated_price_includes_tax: null,
        original_price_incl_tax: null,
        calculated_price_incl_tax: null,
        original_tax: null,
        calculated_tax: null,
        tax_rates: null,
      }

      Object.assign(v, pricingResult)
    }
  })

  return variants
}

export const removeNullish = (
  obj: Record<string, unknown>
): Record<string, unknown> =>
  Object.entries(obj).reduce((a, [k, v]) => {
    if (isDefined(v)) {
      a[k] = v
    }
    return a
  }, {})

type VariantsRes = {
  id: string
  title: string
  price: VariantsPriceRes | VariantsPriceRes[]
}

type VariantsPriceRes = {
  variant_id: string
  price_set_id: string
}
