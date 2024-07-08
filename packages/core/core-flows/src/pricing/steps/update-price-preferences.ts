import { PricingWorkflow, IPricingModuleService } from "@medusajs/types"
import {
  ModuleRegistrationName,
  getSelectsAndRelationsFromObjectArray,
} from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

type StepInput = PricingWorkflow.UpdatePricePreferencesWorkflowInput

export const updatePricePreferencesStepId = "update-price-preferences"
export const updatePricePreferencesStep = createStep(
  updatePricePreferencesStepId,
  async (input: StepInput, { container }) => {
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
