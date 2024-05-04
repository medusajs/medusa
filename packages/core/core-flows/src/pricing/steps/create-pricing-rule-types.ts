import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { CreateRuleTypeDTO, IPricingModuleService } from "@medusajs/types"
import { createStep, StepResponse } from "@medusajs/workflows-sdk"

export const createPricingRuleTypesStepId = "create-pricing-rule-types"
export const createPricingRuleTypesStep = createStep(
  createPricingRuleTypesStepId,
  async (data: CreateRuleTypeDTO[], { container }) => {
    if (!data?.length) {
      return
    }

    const pricingModule = container.resolve<IPricingModuleService>(
      ModuleRegistrationName.PRICING
    )

    const existingRuleTypes = await pricingModule.listRuleTypes({
      rule_attribute: data.map((d) => d.rule_attribute),
    })

    const existingRuleTypeAttributes = new Set(
      existingRuleTypes.map((ruleType) => ruleType.rule_attribute)
    )

    const ruleTypesToCreate = data.filter(
      (dataItem) => !existingRuleTypeAttributes.has(dataItem.rule_attribute)
    )

    const ruleTypes = await pricingModule.createRuleTypes(ruleTypesToCreate)

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
