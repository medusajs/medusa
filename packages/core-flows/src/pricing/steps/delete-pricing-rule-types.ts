import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IPricingModuleService } from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const deletePricingRuleTypesStepId = "delete-pricing-rule-types"
export const deletePricingRuleTypesStep = createStep(
  deletePricingRuleTypesStepId,
  async (ids: string[], { container }) => {
    const pricingModule = container.resolve<IPricingModuleService>(
      ModuleRegistrationName.PRICING
    )

    // TODO: implement soft deleting rule types
    // await pricingModule.softDeleteRuleTypes(ids)
    await pricingModule.deleteRuleTypes(ids)

    return new StepResponse(void 0, ids)
  },
  async (ids, { container }) => {
    if (!ids?.length) {
      return
    }

    const pricingModule = container.resolve<IPricingModuleService>(
      ModuleRegistrationName.PRICING
    )

    // TODO: implement restoring soft deleted rule types
    // await pricingModule.restoreRuleTypes(ids)
  }
)
