import { MedusaError } from "@zjedene-medusa/framework/utils"
import { getRuleAttributesMap } from "./rule-attributes-map"
import {
  ApplicationMethodTargetTypeValues,
  ApplicationMethodTypeValues,
  PromotionTypeValues,
  RuleTypeValues,
} from "@zjedene-medusa/types"

export function validateRuleAttribute(attributes: {
  promotionType: PromotionTypeValues | undefined
  ruleType: RuleTypeValues
  ruleAttributeId: string
  applicationMethodType?: ApplicationMethodTypeValues
  applicationMethodTargetType?: ApplicationMethodTargetTypeValues
}) {
  const {
    promotionType,
    ruleType,
    ruleAttributeId,
    applicationMethodType,
    applicationMethodTargetType,
  } = attributes

  const ruleAttributes =
    getRuleAttributesMap({
      promotionType,
      applicationMethodType,
      applicationMethodTargetType,
    })[ruleType] || []

  const ruleAttribute = ruleAttributes.find((obj) => obj.id === ruleAttributeId)

  if (!ruleAttribute) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Invalid rule attribute - ${ruleAttributeId}`
    )
  }
}
