import { MedusaError } from "@medusajs/utils"
import { getRuleAttributesMap } from "./rule-attributes-map"

export function validateRuleAttribute(attributes: {
  promotionType: string | undefined
  ruleType: string
  ruleAttributeId: string
  applicationMethodType?: string
}) {
  const { promotionType, ruleType, ruleAttributeId, applicationMethodType } =
    attributes

  const ruleAttributes =
    getRuleAttributesMap({
      promotionType,
      applicationMethodType,
    })[ruleType] || []

  const ruleAttribute = ruleAttributes.find((obj) => obj.id === ruleAttributeId)

  if (!ruleAttribute) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Invalid rule attribute - ${ruleAttributeId}`
    )
  }
}
