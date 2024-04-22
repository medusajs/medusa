import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../../../types/routing"

import { removeRulesFromPromotionsWorkflow } from "@medusajs/core-flows"
import { RuleType } from "@medusajs/utils"
import { AdminRemoveBatchRulesType } from "../../../../validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminRemoveBatchRulesType>,
  res: MedusaResponse
) => {
  const id = req.params.id
  const workflow = removeRulesFromPromotionsWorkflow(req.scope)
  const validatedBody = req.validatedBody

  const { errors } = await workflow.run({
    input: {
      rule_type: RuleType.RULES,
      data: { id, ...validatedBody },
    },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  res.status(200).json({
    ids: validatedBody.rule_ids,
    object: "promotion-rule",
    deleted: true,
  })
}
