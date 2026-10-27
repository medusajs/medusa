import type {
  BigNumberInput,
  PaymentSessionDTO,
} from "@medusajs/framework/types"
import {
  MathBN,
  MedusaError,
  PaymentSessionStatus,
} from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

/**
 * The details of the payment sessions to validate.
 */
export interface ValidatePaymentSessionsDeletableStepInput {
  /**
   * The payment sessions to validate, with their payment's `canceled_at`,
   * `captured_at`, `raw_amount`, and `refunds.raw_amount`.
   */
  payment_sessions: Pick<PaymentSessionDTO, "id" | "status" | "payment">[]
}

const AUTHORIZED_STATUSES: string[] = [
  PaymentSessionStatus.AUTHORIZED,
  PaymentSessionStatus.CAPTURED,
]

export const validatePaymentSessionsDeletableStepId =
  "validate-payment-sessions-deletable"
/**
 * This step validates that payment sessions can be deleted. A payment session can't be
 * deleted if its authorization is in progress (`pending_authorization`), or if it has a
 * payment that isn't canceled or fully refunded, as deleting it would detach an authorized
 * or captured payment from its payment collection.
 *
 * @example
 * const data = validatePaymentSessionsDeletableStep({
 *   payment_sessions: [{
 *     id: "payses_123",
 *     status: "authorized",
 *     payment: {
 *       id: "pay_123",
 *       canceled_at: null,
 *       captured_at: null,
 *       raw_amount: { value: "10", precision: 20 },
 *       refunds: [],
 *       // other payment details...
 *     }
 *   }]
 * })
 */
export const validatePaymentSessionsDeletableStep = createStep(
  validatePaymentSessionsDeletableStepId,
  async (data: ValidatePaymentSessionsDeletableStepInput) => {
    for (const session of data.payment_sessions ?? []) {
      if (session.status === PaymentSessionStatus.PENDING_AUTHORIZATION) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          `Payment session with id: ${session.id} can't be replaced because its status is ${session.status}`
        )
      }

      if (!AUTHORIZED_STATUSES.includes(session.status)) {
        continue
      }

      const payment = session.payment

      if (payment?.canceled_at) {
        continue
      }

      const refundedAmount = (payment?.refunds ?? []).reduce(
        (total, refund) =>
          MathBN.add(total, refund.raw_amount as BigNumberInput),
        MathBN.convert(0)
      )

      if (
        !payment?.captured_at ||
        MathBN.lt(
          refundedAmount,
          (payment.raw_amount ?? payment.amount) as BigNumberInput
        )
      ) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          `Payment session with id: ${session.id} can't be replaced because it has an authorized or captured payment`
        )
      }
    }

    return new StepResponse(void 0)
  }
)
