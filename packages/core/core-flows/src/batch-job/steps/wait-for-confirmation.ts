import { createStep } from "@medusajs/workflows-sdk"

export const waitForConfirmationStepId = "wait-for-confirmation"
export const waitForConfirmationStep = createStep(
    waitForConfirmationStepId,
  async (_, { container }) => {
    // preprocess products
    return
  }
)
