import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IPaymentModuleService, PaymentProviderContext } from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

interface StepInput {
  payment_collection_id: string
  provider_id: string
  amount: number
  currency_code: string
  context: PaymentProviderContext
  data: Record<string, unknown>
}

export const createPaymentSessionStepId = "create-payment-session"
export const createPaymentSessionStep = createStep(
  createPaymentSessionStepId,
  async (input: StepInput, { container }) => {
    const service = container.resolve<IPaymentModuleService>(
      ModuleRegistrationName.PAYMENT
    )

    const session = await service.createPaymentSession(
      input.payment_collection_id,
      {
        provider_id: input.provider_id,
        data: input.data,
        currency_code: input.currency_code,
        amount: input.amount,
        context: input.context,
      }
    )

    return new StepResponse(session, session.id)
  }
)
