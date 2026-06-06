import {
  IPricingModuleService,
  PricingWorkflow,
} from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The price preferences to create.
 */
export type CreatePricePreferencesStepInput = PricingWorkflow.CreatePricePreferencesWorkflowInput[]

export const createPricePreferencesStepId = "create-price-preferences"
/**
 * This step creates one or more price preferences.
 * 
 * @example
 * const data = createPricePreferencesStep([{
 *   attribute: "region_id",
 *   value: "reg_123",
 *   is_tax_inclusive: true
 * }])
 */
export const createPricePreferencesStep = createStep(
  createPricePreferencesStepId,
  async (
    data: CreatePricePreferencesStepInput,
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
