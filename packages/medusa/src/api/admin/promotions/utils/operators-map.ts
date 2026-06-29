import { RuleOperator } from "@zjedene-medusa/framework/utils"

const operatorOptions = {
  [RuleOperator.IN]: {
    id: RuleOperator.IN,
    value: RuleOperator.IN,
    label: "In",
  },
  [RuleOperator.EQ]: {
    id: RuleOperator.EQ,
    value: RuleOperator.EQ,
    label: "Equals",
  },
  [RuleOperator.NE]: {
    id: RuleOperator.NE,
    value: RuleOperator.NE,
    label: "Not In",
  },
  [RuleOperator.GT]: {
    id: RuleOperator.GT,
    value: RuleOperator.GT,
    label: "Greater than",
  },
  [RuleOperator.GTE]: {
    id: RuleOperator.GTE,
    value: RuleOperator.GTE,
    label: "Greater than or equal",
  },
  [RuleOperator.LT]: {
    id: RuleOperator.LT,
    value: RuleOperator.LT,
    label: "Less than",
  },
  [RuleOperator.LTE]: {
    id: RuleOperator.LTE,
    value: RuleOperator.LTE,
    label: "Less than or equal",
  },
}

/**
 * Operators offered for set-membership (id/text) rule attributes.
 */
export const operatorsMap = {
  [RuleOperator.IN]: operatorOptions[RuleOperator.IN],
  [RuleOperator.EQ]: operatorOptions[RuleOperator.EQ],
  [RuleOperator.NE]: operatorOptions[RuleOperator.NE],
}

/**
 * Operators offered for numeric rule attributes (e.g. cart total, order count,
 * time-of-day). The runtime evaluator already implements gt/gte/lt/lte against
 * a flattened cart context.
 */
export const numericOperatorsMap = {
  [RuleOperator.EQ]: operatorOptions[RuleOperator.EQ],
  [RuleOperator.NE]: operatorOptions[RuleOperator.NE],
  [RuleOperator.GT]: operatorOptions[RuleOperator.GT],
  [RuleOperator.GTE]: operatorOptions[RuleOperator.GTE],
  [RuleOperator.LT]: operatorOptions[RuleOperator.LT],
  [RuleOperator.LTE]: operatorOptions[RuleOperator.LTE],
}
