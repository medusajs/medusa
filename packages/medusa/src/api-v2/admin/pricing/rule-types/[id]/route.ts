import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IPricingModuleService } from "@medusajs/types"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../types/routing"
import { AdminGetPricingRuleTypesRuleTypeParams } from "../../validators"

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
