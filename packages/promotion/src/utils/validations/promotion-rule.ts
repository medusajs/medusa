import { PromotionRuleOperatorValues } from "@medusajs/types"
import { MedusaError, PromotionRuleOperator, isPresent } from "@medusajs/utils"
import { CreatePromotionRuleDTO } from "../../types"

export function validatePromotionRuleAttributes(
  promotionRulesData: CreatePromotionRuleDTO[]
) {
  const errors: string[] = []

  for (const promotionRuleData of promotionRulesData) {
    if (!isPresent(promotionRuleData.attribute)) {
      errors.push("rules[].attribute is a required field")
    }

    if (!isPresent(promotionRuleData.operator)) {
      errors.push("rules[].operator is a required field")
    }

    if (isPresent(promotionRuleData.operator)) {
      const allowedOperators: PromotionRuleOperatorValues[] = Object.values(
        PromotionRuleOperator
      )

      if (!allowedOperators.includes(promotionRuleData.operator)) {
        errors.push(
          `rules[].operator (${
            promotionRuleData.operator
          }) is invalid. It should be one of ${allowedOperators.join(", ")}`
        )
      }
    } else {
      errors.push("rules[].operator is a required field")
    }
  }

  if (!errors.length) return

  throw new MedusaError(MedusaError.Types.INVALID_DATA, errors.join(", "))
}
