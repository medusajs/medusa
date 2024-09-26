import { batchPromotionRulesWorkflow } from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../../types/routing"
import { BatchMethodRequest, HttpTypes } from "@medusajs/types"
import {
  AdminCreatePromotionRuleType,
  AdminUpdatePromotionRuleType,
} from "../../../validators"
import { RuleType } from "@medusajs/framework/utils"
import { refetchBatchRules } from "../../../helpers"

export const POST = async (
  req: AuthenticatedMedusaRequest<
    BatchMethodRequest<
      AdminCreatePromotionRuleType,
      AdminUpdatePromotionRuleType
    >
  >,
  res: MedusaResponse<HttpTypes.AdminPromotionRuleBatchResponse>
) => {
  const id = req.params.id
  const { result } = await batchPromotionRulesWorkflow(req.scope).run({
    input: {
      id,
      rule_type: RuleType.BUY_RULES,
      create: req.validatedBody.create,
      update: req.validatedBody.update,
      delete: req.validatedBody.delete,
    },
  })

  const batchResults = await refetchBatchRules(
    result,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json(batchResults)
}
