import { createStep, StepResponse } from "@medusajs/workflows-sdk"

interface StepInput {
  input: {
    id: string
    prices: (
      | {
          currency_code: string
          amount: number
        }
      | {
          region_id: string
          amount: number
        }
    )[]
  }[]
}

export const setShippingOptionsPricesStepId = "set-shipping-options-prices-step"
export const setShippingOptionsPricesStep = createStep(
  setShippingOptionsPricesStepId,
  async (input: StepInput, { container }) => {
    return new StepResponse([])
  },
  async (ruleIds, { container }) => {}
)
