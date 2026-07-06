import { RuleWithFormAttributes } from "../rules-form-field"

export const getRuleValue = (rule: RuleWithFormAttributes) => {
  if (rule.field_type === "number") {
    return parseInt(rule.values as unknown as string)
  }

  return rule.values
}
