import {
  ApplicationMethodTargetTypeValues,
  PromotionRuleDTO,
  PromotionRuleOperatorValues,
} from "@medusajs/framework/types"
import {
  ApplicationMethodTargetType,
  MedusaError,
  PromotionRuleOperator,
  isPresent,
  isString,
  pickValueFromObject,
} from "@medusajs/framework/utils"
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
  context: Record<string, any>,
  contextScope: ApplicationMethodTargetTypeValues
): boolean {
  return rules.every((rule) => {
    const validRuleValues = rule.values?.map((ruleValue) => ruleValue.value)

    if (!rule.attribute) {
      return false
    }

    const valuesToCheck = pickValueFromObject(
      fetchRuleAttributeForContext(rule.attribute, contextScope),
      context
    )

    return evaluateRuleValueCondition(
      validRuleValues.filter(isString),
      rule.operator!,
      valuesToCheck
    )
  })
}

/*
  The context here can either be either:
  - a cart context
  - an item context under a cart
  - a shipping method context under a cart

  The rule's attributes are set from the perspective of the cart context. For example: items.product.id
  
  When the context here is item or shipping_method, we need to drop the "items."" or "shipping_method."
  from the rule attribute string to accurate pick the values from the context.
*/
function fetchRuleAttributeForContext(
  ruleAttribute: string,
  contextScope: ApplicationMethodTargetTypeValues
): string {
  if (contextScope === ApplicationMethodTargetType.ITEMS) {
    ruleAttribute = ruleAttribute.replace(
      `${ApplicationMethodTargetType.ITEMS}.`,
      ""
    )
  }

  if (contextScope === ApplicationMethodTargetType.SHIPPING_METHODS) {
    ruleAttribute = ruleAttribute.replace(
      `${ApplicationMethodTargetType.SHIPPING_METHODS}.`,
      ""
    )
  }

  return ruleAttribute
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
