import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { CreateRuleTypeDTO, IPricingModuleService } from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const createPricingRuleTypesStepId = "create-pricing-rule-types"
export const createPricingRuleTypesStep = createStep(
  createPricingRuleTypesStepId,
  async (data: CreateRuleTypeDTO[], { container }) => {
    const pricingModule = container.resolve<IPricingModuleService>(
      ModuleRegistrationName.PRICING
    )

    const ruleTypes = await pricingModule.createRuleTypes(data)

    return new StepResponse(
      ruleTypes,
      ruleTypes.map((ruleType) => ruleType.id)
    )
  },
  async (ruleTypeIds, { container }) => {
    if (!ruleTypeIds?.length) {
      return
    }

    const pricingModule = container.resolve<IPricingModuleService>(
      ModuleRegistrationName.PRICING
    )

    await pricingModule.delete(ruleTypeIds)
  }
)
