import {
  BigNumberInput,
  IPaymentModuleService,
} from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The data to capture a payment.
 */
export type CapturePaymentStepInput = {
  /**
   * The ID of the payment to capture.
   */
  payment_id: string
  /**
   * The ID of the user that captured the payment.
   */
  captured_by?: string
  /**
   * The amount to capture. If not provided, the full payment amount will be captured.
   */
  amount?: BigNumberInput
}

export const capturePaymentStepId = "capture-payment-step"
/**
 * This step captures a payment.
 */
export const capturePaymentStep = createStep(
  capturePaymentStepId,
  async (input: CapturePaymentStepInput, { container }) => {
    const paymentModule = container.resolve<IPaymentModuleService>(
      Modules.PAYMENT
    )

    const payment = await paymentModule.capturePayment(input)

    return new StepResponse(payment)
  }
  // We don't want to compensate a capture automatically as the actual funds have already been taken.
  // The only want to compensate here is to issue a refund, but it's better to leave that as a manual operation for now.
)
