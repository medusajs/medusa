import {
  IPricingModuleService,
  PricingWorkflow,
} from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export const createPricePreferencesStepId = "create-price-preferences"
/**
 * This step creates one or more price preferences.
 */
export const createPricePreferencesStep = createStep(
  createPricePreferencesStepId,
  async (
    data: PricingWorkflow.CreatePricePreferencesWorkflowInput[],
    { container }
  ) => {
    const pricingModule = container.resolve<IPricingModuleService>(
      Modules.PRICING
    )

    const pricePreferences = await pricingModule.createPricePreferences(data)

    return new StepResponse(
      pricePreferences,
      pricePreferences.map((pricePreference) => pricePreference.id)
    )
  },
  async (pricePreferences, { container }) => {
    if (!pricePreferences?.length) {
      return
    }

    const pricingModule = container.resolve<IPricingModuleService>(
      Modules.PRICING
    )

    await pricingModule.deletePricePreferences(pricePreferences)
  }
)
