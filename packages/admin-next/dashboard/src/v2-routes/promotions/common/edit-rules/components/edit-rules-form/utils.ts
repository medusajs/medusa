import { PromotionDTO } from "@medusajs/types"
import { RuleType } from "../../edit-rules"

// We are disguising couple of database columns as rules here, namely
// apply_to_quantity and buy_rules_min_quantity.
// We need to transform the database value into a disugised "rule" shape
// for the form
export function getDisguisedRules(
  promotion: PromotionDTO,
  requiredAttributes: any[],
  ruleType: string
) {
  if (ruleType === RuleType.RULES && !requiredAttributes?.length) {
    return []
  }

  const applyToQuantityRule = requiredAttributes.find(
    (attr) => attr.id === "apply_to_quantity"
  )

  const buyRulesMinQuantityRule = requiredAttributes.find(
    (attr) => attr.id === "buy_rules_min_quantity"
  )

  if (ruleType === RuleType.TARGET_RULES) {
    return [
      {
        id: "apply_to_quantity",
        attribute: "apply_to_quantity",
        operator: "eq",
        required: applyToQuantityRule?.required,
        field_type: applyToQuantityRule?.field_type,
        values: [{ value: promotion?.application_method?.apply_to_quantity }],
      },
    ]
  }

  if (ruleType === RuleType.BUY_RULES) {
    return [
      {
        id: "buy_rules_min_quantity",
        attribute: "buy_rules_min_quantity",
        operator: "eq",
        required: buyRulesMinQuantityRule?.required,
        field_type: buyRulesMinQuantityRule?.field_type,
        values: [
          { value: promotion?.application_method?.buy_rules_min_quantity },
        ],
      },
    ]
  }
}
