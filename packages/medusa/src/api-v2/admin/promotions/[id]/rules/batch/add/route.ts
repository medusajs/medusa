import { addRulesToPromotionsWorkflow } from "@medusajs/core-flows"
import { RuleType } from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../../../types/routing"
import { refetchPromotion } from "../../../../helpers"
import { AdminCreateBatchRulesType } from "../../../../validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminCreateBatchRulesType>,
  res: MedusaResponse
) => {
  const id = req.params.id
  const workflow = addRulesToPromotionsWorkflow(req.scope)

  const { errors } = await workflow.run({
    input: {
      rule_type: RuleType.RULES,
      data: { id, ...req.validatedBody },
    },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  const promotion = await refetchPromotion(
    id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ promotion })
}
