import { isString, MedusaError, pickValueFromObject } from "@medusajs/utils"

type Rule = {
  attribute: string
  operator: RuleOperator
  value: string | string[]
}

export enum RuleOperator {
  IN = "in",
  EQ = "eq",
  NE = "ne",
  GT = "gt",
  GTE = "gte",
  LT = "lt",
  LTE = "lte",
  NIN = "nin",
}

export const availableOperators = Object.values(RuleOperator)

const isDate = (str: string) => {
  return !isNaN(Date.parse(str))
}

const operatorsPredicate = {
  in: (contextValue: string, ruleValue: string[]) =>
    ruleValue.includes(contextValue),
  nin: (contextValue: string, ruleValue: string[]) =>
    !ruleValue.includes(contextValue),
  eq: (contextValue: string, ruleValue: string) => contextValue === ruleValue,
  ne: (contextValue: string, ruleValue: string) => contextValue !== ruleValue,
  gt: (contextValue: string, ruleValue: string) => {
    if (isDate(contextValue) && isDate(ruleValue)) {
      return new Date(contextValue) > new Date(ruleValue)
    }
    return Number(contextValue) > Number(ruleValue)
  },
  gte: (contextValue: string, ruleValue: string) => {
    if (isDate(contextValue) && isDate(ruleValue)) {
      return new Date(contextValue) >= new Date(ruleValue)
    }
    return Number(contextValue) >= Number(ruleValue)
  },
  lt: (contextValue: string, ruleValue: string) => {
    if (isDate(contextValue) && isDate(ruleValue)) {
      return new Date(contextValue) < new Date(ruleValue)
    }
    return Number(contextValue) < Number(ruleValue)
  },
  lte: (contextValue: string, ruleValue: string) => {
    if (isDate(contextValue) && isDate(ruleValue)) {
      return new Date(contextValue) <= new Date(ruleValue)
    }
    return Number(contextValue) <= Number(ruleValue)
  },
}

/**
 * Validate contextValue context object from contextValue set of rules.
 * By default, all rules must be valid to return true unless the option atLeastOneValidRule is set to true.
 * @param context
 * @param rules
 * @param options
 */
export function isContextValidForRules(
  context: Record<string, any>,
  rules: Rule[],
  options: {
    atLeastOneValidRule: boolean
  } = {
    atLeastOneValidRule: false,
  }
) {
  const { atLeastOneValidRule } = options

  const loopComparator = atLeastOneValidRule ? rules.some : rules.every
  const predicate = (rule) => {
    const { attribute, operator, value } = rule
    const contextValue = pickValueFromObject(attribute, context)
    return operatorsPredicate[operator](
      contextValue,
      value as string & string[]
    )
  }

  return loopComparator.apply(rules, [predicate])
}

/**
 * Validate contextValue rule object
 * @param rule
 */
export function validateRule(rule: Rule): boolean {
  if (!rule.attribute || !rule.operator || !rule.value) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Rule must have an attribute, an operator and contextValue value"
    )
  }

  if (!isString(rule.attribute)) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Rule attribute must be contextValue string"
    )
  }

  if (!isString(rule.operator)) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Rule operator must be contextValue string"
    )
  }

  if (!availableOperators.includes(rule.operator)) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Rule operator ${
        rule.operator
      } is not supported. Must be one of ${availableOperators.join(",")}`
    )
  }

  if (rule.operator === "in" || rule.operator === "nin") {
    if (!Array.isArray(rule.value)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Rule value must be an array for in/nin operators"
      )
    }
  }

  return true
}

/**
 * Validate contextValue set of rules
 * @param rules
 */
export function validateRules(rules: Rule[]): boolean {
  rules.forEach(validateRule)
  return true
}
