import {
  BigNumberInput,
  IPaymentModuleService,
} from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"
import { createStep, StepResponse } from "@zjedene-medusa/framework/workflows-sdk"

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
