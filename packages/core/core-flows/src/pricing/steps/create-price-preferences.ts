import { IPricingModuleService } from "@medusajs/types"
import { PricingWorkflow } from "@medusajs/types/dist/workflow"
import { ModuleRegistrationName } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

type StepInput = PricingWorkflow.CreatePricePreferencesWorkflowInput[]

export const createPricePreferencesStepId = "create-price-preferences"
export const createPricePreferencesStep = createStep(
  createPricePreferencesStepId,
  async (data: StepInput, { container }) => {
    const pricingModule = container.resolve<IPricingModuleService>(
      ModuleRegistrationName.PRICING
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
      ModuleRegistrationName.PRICING
    )

    await pricingModule.deletePricePreferences(pricePreferences)
  }
)
