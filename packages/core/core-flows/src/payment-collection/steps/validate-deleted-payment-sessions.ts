import { MedusaError } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export interface ValidateDeletedPaymentSessionsStepInput {
  idsToDelete: string[]
  idsDeleted: string[]
}

export const validateDeletedPaymentSessionsStepId =
  "validate-deleted-payment-sessions"
/**
 * This step validates that the specified payment session IDs were deleted.
 */
export const validateDeletedPaymentSessionsStep = createStep(
  validateDeletedPaymentSessionsStepId,
  async (input: ValidateDeletedPaymentSessionsStepInput) => {
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
