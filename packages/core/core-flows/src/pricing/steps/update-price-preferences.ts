import {
  IPricingModuleService,
  PricingWorkflow,
} from "@zjedene-medusa/framework/types"
import {
  Modules,
  getSelectsAndRelationsFromObjectArray,
} from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

export const updatePricePreferencesStepId = "update-price-preferences"
/**
 * This step updates price preferences matching the specified filters.
 * 
 * @example
 * const data = updatePricePreferencesStep({
 *   selector: {
 *     id: ["pp_123"]
 *   },
 *   update: {
 *     is_tax_inclusive: true
 *   }
 * })
 */
export const updatePricePreferencesStep = createStep(
  updatePricePreferencesStepId,
  async (
    input: PricingWorkflow.UpdatePricePreferencesWorkflowInput,
    { container }
  ) => {
    const service = container.resolve<IPricingModuleService>(Modules.PRICING)

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

    const service = container.resolve<IPricingModuleService>(Modules.PRICING)

    await service.upsertPricePreferences(prevData)
  }
)
