import {
  ApplicationMethodTargetTypeValues,
  InferEntityType,
  PromotionRuleDTO,
  PromotionRuleOperatorValues,
} from "@medusajs/framework/types"
import {
  ApplicationMethodTargetType,
  MathBN,
  MedusaError,
  PromotionRuleOperator,
  isPresent,
  isString,
  pickValueFromObject,
} from "@medusajs/framework/utils"
import { PromotionRule } from "@models"
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
  rules: PromotionRuleDTO[] | InferEntityType<typeof PromotionRule>[],
  context: Record<string, any>,
  contextScope: ApplicationMethodTargetTypeValues
): boolean {
  if (!rules?.length) {
    return true
  }

  const isItemScope = contextScope === ApplicationMethodTargetType.ITEMS
  const isShippingScope =
    contextScope === ApplicationMethodTargetType.SHIPPING_METHODS

  return ("initialized" in rules ? [...rules] : rules).every((rule) => {
    if (!rule.attribute || !rule.values?.length) {
      return false
    }

    const validRuleValues: string[] = []
    for (const value of rule.values) {
      if (isString(value.value)) {
        validRuleValues.push(value.value as string)
      }
    }

    if (!validRuleValues.length) {
      return false
    }

    let ruleAttribute = rule.attribute
    if (isItemScope) {
      ruleAttribute = ruleAttribute.replace(
        `${ApplicationMethodTargetType.ITEMS}.`,
        ""
      )
    } else if (isShippingScope) {
      ruleAttribute = ruleAttribute.replace(
        `${ApplicationMethodTargetType.SHIPPING_METHODS}.`,
        ""
      )
    }

    const valuesToCheck = pickValueFromObject(ruleAttribute, context)

    return evaluateRuleValueCondition(
      validRuleValues,
      rule.operator!,
      valuesToCheck
    )
  })
}

/*
  Optimized evaluateRuleValueCondition by using early returns and cleaner approach
  for evaluating rule conditions.
*/
export function evaluateRuleValueCondition(
  ruleValues: string[],
  operator: string,
  ruleValuesToCheck: (string | number)[] | (string | number)
): boolean {
  const valuesToCheck = Array.isArray(ruleValuesToCheck)
    ? ruleValuesToCheck
    : [ruleValuesToCheck]

  if (!valuesToCheck.length) {
    switch (operator) {
      case "ne":
        return true
      default:
        return false
    }
  }

  switch (operator) {
    case "eq": {
      const ruleValueSet = new Set(ruleValues)
      return valuesToCheck.every((val) => ruleValueSet.has(`${val}`))
    }
    case "in": {
      const ruleValueSet = new Set(ruleValues)
      return valuesToCheck.some((val) => ruleValueSet.has(`${val}`))
    }
    case "ne": {
      const ruleValueSet = new Set(ruleValues)
      return valuesToCheck.every((val) => !ruleValueSet.has(`${val}`))
    }
    case "gt":
      return valuesToCheck.every((val) =>
        ruleValues.some((ruleVal) => MathBN.gt(val, ruleVal))
      )
    case "gte":
      return valuesToCheck.every((val) =>
        ruleValues.some((ruleVal) => MathBN.gte(val, ruleVal))
      )
    case "lt":
      return valuesToCheck.every((val) =>
        ruleValues.some((ruleVal) => MathBN.lt(val, ruleVal))
      )
    case "lte":
      return valuesToCheck.every((val) =>
        ruleValues.some((ruleVal) => MathBN.lte(val, ruleVal))
      )
    default:
      return false
  }
}
