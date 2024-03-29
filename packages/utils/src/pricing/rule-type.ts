import { MedusaError } from "../common"

type RuleAttributeInput = string | undefined

export const ReservedPricingRuleAttributes = [
  "quantity",
  "currency_code",
  "price_list_id",
]

export const getInvalidRuleAttributes = (
  ruleAttributes: RuleAttributeInput[]
): string[] => {
  const invalidRuleAttributes: string[] = []

  for (const attribute of ReservedPricingRuleAttributes) {
    if (ruleAttributes.indexOf(attribute) > -1) {
      invalidRuleAttributes.push(attribute)
    }
  }

  return invalidRuleAttributes
}

export const validateRuleAttributes = (
  ruleAttributes: RuleAttributeInput[]
): void => {
  const invalidRuleAttributes = getInvalidRuleAttributes(ruleAttributes)

  if (invalidRuleAttributes.length) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Can't create rule_attribute with reserved keywords [${ReservedPricingRuleAttributes.join(
        ", "
      )}] - ${invalidRuleAttributes.join(", ")}`
    )
  }
}
