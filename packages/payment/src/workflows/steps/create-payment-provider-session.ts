import { PaymentProviderContext } from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

interface StepInput {
  provider_id: string
  data: {
    context: PaymentProviderContext
    amount: number
    currency_code: string
  }
}

export const createPaymentProviderSessionStepId =
  "module:create-payment-provider-session"
export const createPaymentProviderSessionStep = createStep(
  createPaymentProviderSessionStepId,
  async (input: StepInput, { container }) => {
    const service = container.resolve("paymentProviderService")

    const session = await service.createSession(input.provider_id, input.data)

    return new StepResponse(session, {
      session,
      provider_id: input.provider_id,
    })
  },
  async (createdSession, { container }) => {
    if (!createdSession) {
      return
    }

    const service = container.resolve("paymentProviderService")

    await service.deleteSession(
      createdSession.provider_id,
      createdSession.session
    )
  }
)
