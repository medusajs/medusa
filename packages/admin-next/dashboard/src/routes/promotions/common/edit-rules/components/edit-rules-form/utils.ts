import { PromotionRuleResponse } from "@medusajs/types"

export const generateRuleAttributes = (rules?: PromotionRuleResponse[]) =>
  (rules || []).map((rule) => ({
    id: rule.id,
    required: rule.required,
    field_type: rule.field_type,
    disguised: rule.disguised,
    attribute: rule.attribute!,
    operator: rule.operator!,
    values:
      rule.field_type === "number" || rule.operator === "eq"
        ? typeof rule.values === "object"
          ? rule.values[0]?.value
          : rule.values
        : rule?.values?.map((v: { value: string }) => v.value!),
  }))
