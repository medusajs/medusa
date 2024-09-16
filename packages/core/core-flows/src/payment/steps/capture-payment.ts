import { BigNumberInput, IPaymentModuleService } from "@medusajs/types"
import { Modules } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export type CapturePaymentStepInput = {
  payment_id: string
  captured_by?: string
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
)
