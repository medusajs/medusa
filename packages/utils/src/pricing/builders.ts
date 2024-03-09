import {
  PriceListRuleDTO,
  PriceRuleDTO,
  PriceSetMoneyAmountDTO,
} from "@medusajs/types"

export function buildPriceListRules(
  priceListRules: PriceListRuleDTO[]
): Record<string, string[]> {
  return priceListRules.reduce((acc, curr) => {
    const ruleAttribute = curr.rule_type.rule_attribute
    const ruleValues = curr.price_list_rule_values || []

    acc[ruleAttribute] = ruleValues.map((ruleValue) => ruleValue.value)

    return acc
  }, {})
}

export function buildPriceSetRules(
  priceRules: PriceRuleDTO[]
): Record<string, string[]> {
  return priceRules.reduce((acc, curr) => {
    const ruleAttribute = curr.rule_type.rule_attribute
    const ruleValue = curr.value

    acc[ruleAttribute] = ruleValue

    return acc
  }, {})
}

export function buildPriceSetPrices(
  priceSetMoneyAmounts: PriceSetMoneyAmountDTO[]
): Record<string, any>[] {
  return priceSetMoneyAmounts.map((priceSetMoneyAmount) => {
    const productVariant = (priceSetMoneyAmount.price_set as any).variant
    const rules = priceSetMoneyAmount.price_rules
      ? buildPriceSetRules(priceSetMoneyAmount.price_rules)
      : []

    return {
      ...priceSetMoneyAmount.money_amount,
      variant_id: productVariant?.id ?? null,
      rules,
    }
  })
}
