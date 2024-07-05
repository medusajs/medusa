import { RuleOperator } from "@medusajs/utils"

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
