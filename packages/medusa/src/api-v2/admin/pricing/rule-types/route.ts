import { createPricingRuleTypesWorkflow } from "@medusajs/core-flows"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IPricingModuleService } from "@medusajs/types"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../types/routing"
import { cleanResponseData } from "../../../../utils/clean-response-data"
import { defaultAdminPricingRuleTypeFields } from "../query-config"
import {
  AdminGetPricingRuleTypesParams,
  AdminPostPricingRuleTypesReq,
} from "../validators"

export const GET = async (
  req: AuthenticatedMedusaRequest<AdminGetPricingRuleTypesParams>,
  res: MedusaResponse
) => {
  const pricingModule: IPricingModuleService = req.scope.resolve(
    ModuleRegistrationName.PRICING
  )

  const [ruleTypes, count] = await pricingModule.listAndCountRuleTypes(
    req.filterableFields,
    req.listConfig
  )

  const { limit, offset } = req.validatedQuery

  res.json({
    count,
    rule_types: ruleTypes,
    offset,
    limit,
  })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminPostPricingRuleTypesReq>,
  res: MedusaResponse
) => {
  const workflow = createPricingRuleTypesWorkflow(req.scope)
  const ruleTypesData = [req.validatedBody]

  const { result, errors } = await workflow.run({
    input: { data: ruleTypesData },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  res.status(200).json({
    rule_type: cleanResponseData(result[0], defaultAdminPricingRuleTypeFields),
  })
}
