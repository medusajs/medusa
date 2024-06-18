import { MedusaError } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

interface StepInput {
  idsToDelete: string[]
  idsDeleted: string[]
}

export const validateDeletedPaymentSessionsStepId =
  "validate-deleted-payment-sessions"
export const validateDeletedPaymentSessionsStep = createStep(
  validateDeletedPaymentSessionsStepId,
  async (input: StepInput) => {
    const { idsToDelete = [], idsDeleted = [] } = input

    if (idsToDelete.length !== idsDeleted.length) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Could not delete all payment sessions`
      )
    }

    return new StepResponse(void 0)
  }
)
