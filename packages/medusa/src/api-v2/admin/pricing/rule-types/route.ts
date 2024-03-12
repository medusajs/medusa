import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IPricingModuleService } from "@medusajs/types"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../types/routing"
import { AdminGetPricingRuleTypesParams } from "../validators"

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
