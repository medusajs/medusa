import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const processProductsStepId = "process-products-step"
export const processProductsStep = createStep(
  processProductsStepId,
  async (data, { container }) => {
    // process products
    return new StepResponse({ products: [] })
  }
)
