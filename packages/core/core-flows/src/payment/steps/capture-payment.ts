import { BigNumberInput, IPaymentModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

type StepInput = {
  payment_id: string
  captured_by?: string
  amount?: BigNumberInput
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
