import { PromotionRuleResponse } from "@medusajs/types"

export const getRuleValue = (rule: PromotionRuleResponse) => {
  if (rule.field_type === "number") {
    return parseInt(rule.values as unknown as string)
  }

  return rule.values
}
