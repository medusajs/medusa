import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const preprocessProductsStepId = "preprocess-products-step"
export const preprocessProductsStep = createStep(
  preprocessProductsStepId,
  async (data, { container }) => {
    // preprocess products
    return new StepResponse({ success: true })
  }
)
