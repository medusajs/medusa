import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const completeProductImportStepId = "complete-product-import"
export const completeProductImportStep = createStep(
  completeProductImportStepId,
  async (data, { container }) => {
    // complete product import
    return new StepResponse({ success: true })
  }
)
