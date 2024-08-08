import { PricingWorkflow, IPricingModuleService } from "@medusajs/types"
import {
  ModuleRegistrationName,
  getSelectsAndRelationsFromObjectArray,
} from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const updatePricePreferencesStepId = "update-price-preferences"
/**
 * This step updates price preferences matching the specified filters.
 */
export const updatePricePreferencesStep = createStep(
  updatePricePreferencesStepId,
  async (input: PricingWorkflow.UpdatePricePreferencesWorkflowInput, { container }) => {
    const service = container.resolve<IPricingModuleService>(
      ModuleRegistrationName.PRICING
    )

    const { selects, relations } = getSelectsAndRelationsFromObjectArray([
      input.update,
    ])

    const prevData = await service.listPricePreferences(input.selector, {
      select: selects,
      relations,
    })

    const updatedPricePreferences = await service.updatePricePreferences(
      input.selector,
      input.update
    )

    return new StepResponse(updatedPricePreferences, prevData)
  },
  async (prevData, { container }) => {
    if (!prevData?.length) {
      return
    }

    const service = container.resolve<IPricingModuleService>(
      ModuleRegistrationName.PRICING
    )

    await service.upsertPricePreferences(prevData)
  }
)
