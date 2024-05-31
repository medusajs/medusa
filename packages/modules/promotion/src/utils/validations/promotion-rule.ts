import { PromotionRuleDTO, PromotionRuleOperatorValues } from "@medusajs/types"
import {
  MedusaError,
  PromotionRuleOperator,
  isPresent,
  isString,
  pickValueFromObject,
} from "@medusajs/utils"
import { CreatePromotionRuleDTO } from "@types"

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

export function areRulesValidForContext(
  rules: PromotionRuleDTO[],
  context: Record<string, any>
): boolean {
  return rules.every((rule) => {
    const validRuleValues = rule.values?.map((ruleValue) => ruleValue.value)

    if (!rule.attribute) {
      return false
    }

    const valuesToCheck = pickValueFromObject(rule.attribute, context)

    return evaluateRuleValueCondition(
      validRuleValues.filter(isString),
      rule.operator!,
      valuesToCheck
    )
  })
}

export function evaluateRuleValueCondition(
  ruleValues: string[],
  operator: string,
  ruleValuesToCheck: string[] | string
) {
  if (!Array.isArray(ruleValuesToCheck)) {
    ruleValuesToCheck = [ruleValuesToCheck]
  }

  return ruleValuesToCheck.every((ruleValueToCheck: string) => {
    if (operator === "in" || operator === "eq") {
      return ruleValues.some((ruleValue) => ruleValue === ruleValueToCheck)
    }

    if (operator === "ne") {
      return ruleValues.some((ruleValue) => ruleValue !== ruleValueToCheck)
    }

    if (operator === "gt") {
      return ruleValues.some((ruleValue) => ruleValue > ruleValueToCheck)
    }

    if (operator === "gte") {
      return ruleValues.some((ruleValue) => ruleValue >= ruleValueToCheck)
    }

    if (operator === "lt") {
      return ruleValues.some((ruleValue) => ruleValue < ruleValueToCheck)
    }

    if (operator === "lte") {
      return ruleValues.some((ruleValue) => ruleValue <= ruleValueToCheck)
    }

    return false
  })
}
