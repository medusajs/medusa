import { MedusaError } from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The data to validate that the specified payment session IDs were deleted.
 */
export interface ValidateDeletedPaymentSessionsStepInput {
  /**
   * The payment session IDs that were supposed to be deleted.
   */
  idsToDelete: string[]
  /**
   * The payment session IDs that were actually deleted.
   */
  idsDeleted: string[]
}

export const validateDeletedPaymentSessionsStepId =
  "validate-deleted-payment-sessions"
/**
 * This step validates that the specified payment session IDs were deleted.
 * If not all payment sessions were deleted, the step throws an error.
 * 
 * @example
 * const data = validateDeletedPaymentSessionsStep({
 *   idsDeleted: ["pay_123"],
 *   idsToDelete: ["pay_123"]
 * })
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
