import { PromotionRuleResponse } from "@medusajs/types"

export const getRuleValue = (rule: PromotionRuleResponse) => {
  console.log("rule --- ", rule)
  if (rule.field_type === "number") {
    return parseInt(rule.values as unknown as string)
  }

  // if (rule.field_type === "select") {
  //   return rule.values[0]
  // }

  return rule.values
}
