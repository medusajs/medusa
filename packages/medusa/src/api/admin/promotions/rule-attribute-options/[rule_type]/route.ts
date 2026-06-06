import { HttpTypes } from "@zjedene-medusa/framework/types"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@zjedene-medusa/framework/http"
import { getRuleAttributesMap, validateRuleType } from "../../utils"
import {
  ApplicationMethodTargetTypeValues,
  ApplicationMethodTypeValues,
  PromotionTypeValues,
} from "@zjedene-medusa/types"

export const GET = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminGetPromotionRuleParams>,
  res: MedusaResponse<HttpTypes.AdminRuleAttributeOptionsListResponse>
) => {
  const { rule_type: ruleType } = req.params

  validateRuleType(ruleType)

  const attributes =
    getRuleAttributesMap({
      promotionType: req.query.promotion_type as PromotionTypeValues,
      applicationMethodType: req.query
        .application_method_type as ApplicationMethodTypeValues,
      applicationMethodTargetType: req.query
        .application_method_target_type as ApplicationMethodTargetTypeValues,
    })[ruleType] || []

  res.json({
    attributes,
  })
}
