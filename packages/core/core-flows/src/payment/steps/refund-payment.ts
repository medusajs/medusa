import {
  BigNumberInput,
  IPaymentModuleService,
} from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

/**
 * The data to refund a payment.
 */
export type RefundPaymentStepInput = {
  /**
   * The ID of the payment to refund.
   */
  payment_id: string
  /**
   * The ID of the user that refunded the payment.
   */
  created_by?: string
  /**
   * The amount to refund. If not provided, the full refundable amount is refunded.
   */
  amount?: BigNumberInput
  /**
   * The note to attach to the refund.
   */
  note?: string
  /**
   * The ID of the refund reason to attach to the refund.
   */
  refund_reason_id?: string
  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown>
  /**
   * A caller-supplied key that makes the refund idempotent at the payment
   * provider. Retrying with the same key never moves funds twice.
   */
  idempotency_key?: string
}

export const refundPaymentStepId = "refund-payment-step"
/**
 * This step refunds a payment.
 */
export const refundPaymentStep = createStep(
  refundPaymentStepId,
  async (input: RefundPaymentStepInput, { container }) => {
    const paymentModule = container.resolve<IPaymentModuleService>(
      Modules.PAYMENT
    )

    const payment = await paymentModule.refundPayment(input)

    return new StepResponse(payment)
  }
  // We don't want to compensate a refund automatically as the actual funds have already been sent
  // And in most cases we can't simply do another capture/authorization
)
