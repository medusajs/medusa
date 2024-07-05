import {
  isObject,
  isString,
  MedusaError,
  pickValueFromObject,
  RuleOperator,
} from "@medusajs/utils"

/**
 * The rule engine here is kept inside the module as of now, but it could be moved
 * to the utils package and be used across the different modules that provides context
 * based rule filtering.
 *
 * TODO: discussion around that should happen at some point
 */

export type Rule = {
  attribute: string
  operator: Lowercase<keyof typeof RuleOperator>
  value: string | string[] | null
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
export function isContextValid(
  context: Record<string, any>,
  rules: Rule[],
  options: {
    someAreValid: boolean
  } = {
    someAreValid: false,
  }
): boolean {
  const { someAreValid } = options

  const loopComparator = someAreValid ? rules.some : rules.every
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
export function validateRule(rule: Record<string, unknown>): boolean {
  if (!rule.attribute || !rule.operator || !rule.value) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Rule must have an attribute, an operator and a value"
    )
  }

  if (!isString(rule.attribute)) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Rule attribute must be a string"
    )
  }

  if (!isString(rule.operator)) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Rule operator must be a string"
    )
  }

  if (!availableOperators.includes(rule.operator as RuleOperator)) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Rule operator ${
        rule.operator
      } is not supported. Must be one of ${availableOperators.join(", ")}`
    )
  }

  if (rule.operator === RuleOperator.IN || rule.operator === RuleOperator.NIN) {
    if (!Array.isArray(rule.value)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Rule value must be an array for in/nin operators"
      )
    }
  } else {
    if (Array.isArray(rule.value) || isObject(rule.value)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Rule value must be a string, bool, number value for the selected operator ${rule.operator}`
      )
    }
  }

  return true
}

export function normalizeRulesValue<T extends Partial<Rule>>(rules: T[]): void {
  rules.forEach((rule) => {
    /**
     * If a string is provided, then we don't want jsonb to convert to the primitive value based on the RFC
     */
    if (rule.value === "true" || rule.value === "false") {
      rule.value = rule.value === "true" ? '"true"' : '"false"'
    }

    return rule
  })
}

export function validateAndNormalizeRules<T extends Partial<Rule>>(rules: T[]) {
  rules.forEach(validateRule)
  normalizeRulesValue(rules)
}

/**
 * Validate contextValue set of rules
 * @param rules
 */
export function validateRules(rules: Record<string, unknown>[]): boolean {
  rules.forEach(validateRule)
  return true
}
