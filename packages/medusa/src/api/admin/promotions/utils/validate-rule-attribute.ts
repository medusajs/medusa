import { MedusaError } from "@medusajs/utils"
import { getRuleAttributesMap } from "./rule-attributes-map"

export function validateRuleAttribute(
  promotionType: string | undefined,
  ruleType: string,
  ruleAttributeId: string
) {
  const ruleAttributes = getRuleAttributesMap(promotionType)[ruleType] || []
  const ruleAttribute = ruleAttributes.find((obj) => obj.id === ruleAttributeId)

  if (!ruleAttribute) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Invalid rule attribute - ${ruleAttributeId}`
    )
  }
}
