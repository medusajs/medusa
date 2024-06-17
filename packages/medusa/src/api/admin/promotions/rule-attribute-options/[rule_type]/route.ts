import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../types/routing"
import { getRuleAttributesMap, validateRuleType } from "../../utils"
import { AdminGetPromotionRuleParamsType } from "../../validators"

export const GET = async (
  req: AuthenticatedMedusaRequest<AdminGetPromotionRuleParamsType>,
  res: MedusaResponse
) => {
  const { rule_type: ruleType } = req.params

  validateRuleType(ruleType)

  const attributes =
    getRuleAttributesMap(req.query.promotion_type as string)[ruleType] || []

  res.json({
    attributes,
  })
}
