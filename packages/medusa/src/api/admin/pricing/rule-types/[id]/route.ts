import {
  deletePricingRuleTypesWorkflow,
  updatePricingRuleTypesWorkflow,
} from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../types/routing"
import {
  AdminGetPricingRuleTypeParamsType,
  AdminUpdatePricingRuleTypeType,
} from "../../validators"
import { refetchRuleType } from "../../helpers"
import { MedusaError } from "@medusajs/utils"

export const GET = async (
  req: AuthenticatedMedusaRequest<AdminGetPricingRuleTypeParamsType>,
  res: MedusaResponse
) => {
  const ruleType = await refetchRuleType(
    req.params.id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  if (!ruleType) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `RuleType with id: ${req.params.id} was not found`
    )
  }

  res.status(200).json({ rule_type: ruleType })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminUpdatePricingRuleTypeType>,
  res: MedusaResponse
) => {
  const workflow = updatePricingRuleTypesWorkflow(req.scope)
  await workflow.run({
    input: {
      data: [{ ...req.validatedBody, id: req.params.id }],
    },
  })

  const ruleType = await refetchRuleType(
    req.params.id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({
    rule_type: ruleType,
  })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const id = req.params.id
  const workflow = deletePricingRuleTypesWorkflow(req.scope)

  await workflow.run({
    input: { ids: [id] },
  })

  res.status(200).json({
    id,
    object: "rule_type",
    deleted: true,
  })
}
