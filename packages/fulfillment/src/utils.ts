import { isString, MedusaError } from "@medusajs/utils"

type Rule = {
  attribute: string
  operator: keyof typeof operatorsPredicate
  value: any
}

const availableOperators = ["in", "eq", "ne", "gt", "gte", "lt", "lte", "nin"]
const operatorsPredicate = {
  in: (a: unknown[], b: unknown) => a.includes(b),
  nin: (a: unknown[], b: unknown) => !a.includes(b),
  eq: (a: unknown, b: unknown) => a === b,
  ne: (a: unknown, b: unknown) => a !== b,
  gt: (a: number, b: number) => a > b,
  gte: (a: number, b: number) => a >= b,
  lt: (a: number, b: number) => a < b,
  lte: (a: number, b: number) => a <= b,
}

/**
 * Validate a context object from a set of rules.
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
  }
) {
  let { atLeastOneValidRule } = options
  atLeastOneValidRule ??= false

  function getDeepValue(obj: Record<string, any>, path: string): any {
    return path.split(".").reduce((acc, key) => acc[key], obj)
  }

  const loopComparator = atLeastOneValidRule ? rules.some : rules.every

  return loopComparator((rule) => {
    const { attribute, operator, value } = rule
    const contextValue = getDeepValue(context, attribute)
    return operatorsPredicate[operator](contextValue, value)
  })
}

export function validateRule(rule: Rule) {
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
}
