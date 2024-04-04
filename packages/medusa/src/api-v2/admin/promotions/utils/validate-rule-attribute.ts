import { MedusaError } from "@medusajs/utils"
import { ruleAttributesMap } from "./rule-attributes-map"

export function validateRuleAttribute(
  ruleType: string,
  ruleAttributeId: string
) {
  const ruleAttributes = ruleAttributesMap[ruleType] || []
  const ruleAttribute = ruleAttributes.find((obj) => obj.id === ruleAttributeId)

  if (!ruleAttribute) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Invalid rule attribute - ${ruleAttributeId}`
    )
  }
}
