import { RuleOperator } from "@medusajs/framework/utils"

export const operatorsMap = {
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
}

// Numeric comparison operators are kept separate from operatorsMap, as the
// latter is spread into every multiselect attribute's operator options.
export const numericOperatorsMap = {
  [RuleOperator.GT]: {
    id: RuleOperator.GT,
    value: RuleOperator.GT,
    label: "Greater than",
  },
  [RuleOperator.GTE]: {
    id: RuleOperator.GTE,
    value: RuleOperator.GTE,
    label: "Greater than or equal to",
  },
  [RuleOperator.LT]: {
    id: RuleOperator.LT,
    value: RuleOperator.LT,
    label: "Less than",
  },
  [RuleOperator.LTE]: {
    id: RuleOperator.LTE,
    value: RuleOperator.LTE,
    label: "Less than or equal to",
  },
}

export const allOperatorsMap = {
  ...operatorsMap,
  ...numericOperatorsMap,
}
