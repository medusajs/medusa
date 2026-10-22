import { PaymentSessionDTO } from "@medusajs/framework/types"
import { MedusaError, PaymentSessionStatus } from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

/**
 * The details of the payment session update to validate.
 */
export interface ValidatePaymentSessionUpdateStepInput {
  payment_collection_id: string
  payment_session_id: string
  payment_session?: Pick<
    PaymentSessionDTO,
    "id" | "payment_collection_id" | "status"
  >
}

// Other statuses mean authorization is in progress or done.
const UPDATABLE_STATUSES: string[] = [
  PaymentSessionStatus.PENDING,
  PaymentSessionStatus.REQUIRES_MORE,
  PaymentSessionStatus.ERROR,
]

export const validatePaymentSessionUpdateStepId =
  "validate-payment-session-update"
/**
 * This step validates that a payment session belongs to a payment collection and
 * that its status is `pending`, `requires_more`, or `error`.
 *
 * @example
 * const data = validatePaymentSessionUpdateStep({
 *   payment_collection_id: "paycol_123",
 *   payment_session_id: "payses_123",
 *   payment_session: {
 *     id: "payses_123",
 *     payment_collection_id: "paycol_123",
 *     status: "pending",
 *   }
 * })
 */
export const validatePaymentSessionUpdateStep = createStep(
  validatePaymentSessionUpdateStepId,
  async (data: ValidatePaymentSessionUpdateStepInput) => {
    const { payment_session: session } = data

    if (
      !session ||
      session.payment_collection_id !== data.payment_collection_id
    ) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Payment session with id: ${data.payment_session_id} was not found in payment collection ${data.payment_collection_id}`
      )
    }

    if (!UPDATABLE_STATUSES.includes(session.status)) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        `Payment session with id: ${session.id} can't be updated because its status is ${session.status}`
      )
    }

    return new StepResponse(void 0)
  }
)
