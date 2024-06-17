import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { BigNumberInput, IPaymentModuleService } from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

type StepInput = {
  payment_id: string
  created_by?: string
  amount?: BigNumberInput
}

export const refundPaymentStepId = "refund-payment-step"
export const refundPaymentStep = createStep(
  refundPaymentStepId,
  async (input: StepInput, { container }) => {
    const paymentModule = container.resolve<IPaymentModuleService>(
      ModuleRegistrationName.PAYMENT
    )

    const payment = await paymentModule.refundPayment(input)

    return new StepResponse(payment)
  }
)
