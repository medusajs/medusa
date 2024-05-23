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

  const currencyCodeRule = requiredAttributes.find(
    (attr) => attr.id === "currency_code"
  )

  if (ruleType === RuleType.RULES) {
    return [
      {
        id: "currency_code",
        attribute: "currency_code",
        operator: "eq",
        required: currencyCodeRule?.required,
        values: promotion?.application_method?.currency_code?.toLowerCase(),
      },
    ]
  }

  if (ruleType === RuleType.TARGET_RULES) {
    return [
      {
        id: "apply_to_quantity",
        attribute: "apply_to_quantity",
        operator: "eq",
        required: applyToQuantityRule?.required,
        values: promotion?.application_method?.apply_to_quantity,
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
        values: [
          { value: promotion?.application_method?.buy_rules_min_quantity },
        ],
      },
    ]
  }
}
