import {
  deletePricingRuleTypesWorkflow,
  updatePricingRuleTypesWorkflow,
} from "@medusajs/core-flows"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IPricingModuleService } from "@medusajs/types"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../types/routing"
import { cleanResponseData } from "../../../../../utils/clean-response-data"
import { defaultAdminPricingRuleTypeFields } from "../../query-config"
import {
  AdminDeletePricingRuleTypesRuleTypeReq,
  AdminGetPricingRuleTypesRuleTypeParams,
  AdminPostPricingRuleTypesRuleTypeReq,
} from "../../validators"

export const GET = async (
  req: AuthenticatedMedusaRequest<AdminGetPricingRuleTypesRuleTypeParams>,
  res: MedusaResponse
) => {
  const pricingModule: IPricingModuleService = req.scope.resolve(
    ModuleRegistrationName.PRICING
  )

  const ruleType = await pricingModule.retrieveRuleType(req.params.id, {
    select: req.retrieveConfig.select,
    relations: req.retrieveConfig.relations,
  })

  res.status(200).json({ rule_type: ruleType })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminPostPricingRuleTypesRuleTypeReq>,
  res: MedusaResponse
) => {
  const workflow = updatePricingRuleTypesWorkflow(req.scope)
  const { result, errors } = await workflow.run({
    input: {
      data: [{ ...req.validatedBody, id: req.params.id }],
    },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  res.status(200).json({
    rule_type: cleanResponseData(result[0], defaultAdminPricingRuleTypeFields),
  })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest<AdminDeletePricingRuleTypesRuleTypeReq>,
  res: MedusaResponse
) => {
  const id = req.params.id
  const workflow = deletePricingRuleTypesWorkflow(req.scope)

  const { errors } = await workflow.run({
    input: { ids: [id] },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  res.status(200).json({
    id,
    object: "rule_type",
    deleted: true,
  })
}
