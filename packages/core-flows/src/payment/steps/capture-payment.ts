import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IPaymentModuleService } from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

type StepInput = {
  payment_id: string
  captured_by?: string
  amount?: number
}

export const capturePaymentStepId = "capture-payment-step"
export const capturePaymentStep = createStep(
  capturePaymentStepId,
  async (input: StepInput, { container }) => {
    const paymentModule = container.resolve<IPaymentModuleService>(
      ModuleRegistrationName.PAYMENT
    )

    const payment = await paymentModule.capturePayment(input)

    return new StepResponse(payment)
  }
)
