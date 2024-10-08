import {
  PriceDTO,
  PriceListRuleDTO,
  PriceRuleDTO,
  ProductVariantDTO,
  UpdatePriceListPriceDTO,
} from "@medusajs/types"

export function buildPriceListRules(
  priceListRules?: PriceListRuleDTO[]
): Record<string, string[]> | undefined {
  return priceListRules?.reduce((acc, curr) => {
    const ruleAttribute = curr.attribute
    const ruleValues = curr.value || []

    acc[ruleAttribute] = ruleValues
    return acc
  }, {})
}

export function buildPriceSetRules(
  priceRules?: PriceRuleDTO[]
): Record<string, string> | undefined {
  if (typeof priceRules === "undefined") {
    return undefined
  }

  return priceRules?.reduce((acc, curr) => {
    const ruleAttribute = curr.attribute
    const ruleValue = curr.value

    acc[ruleAttribute] = ruleValue
    return acc
  }, {})
}

export function buildPriceSetPricesForCore(
  prices: (PriceDTO & {
    price_set?: PriceDTO["price_set"] & {
      variant?: ProductVariantDTO
    }
  })[]
): Record<string, any>[] {
  return prices?.map((price) => {
    const productVariant = (price.price_set as any)?.variant
    const rules: Record<string, string> | undefined =
      typeof price.price_rules === "undefined"
        ? undefined
        : buildPriceSetRules(price.price_rules || [])

    delete price.price_rules
    delete price.price_set

    return {
      ...price,
      variant_id: productVariant?.id ?? undefined,
      rules,
    }
  })
}

export function buildPriceSetPricesForModule(
  prices: PriceDTO[]
): UpdatePriceListPriceDTO[] {
  return prices?.map((price) => {
    const rules: Record<string, string> | undefined =
      typeof price.price_rules === "undefined"
        ? undefined
        : buildPriceSetRules(price.price_rules || [])

    return {
      ...price,
      price_set_id: price.price_set!?.id!,
      rules,
    }
  })
}
