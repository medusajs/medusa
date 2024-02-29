import { PaymentProviderContext } from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

interface StepInput {
  payment_collection_id: string
  provider_id: string
  amount: number
  currency_code: string
  context: PaymentProviderContext
  data: Record<string, unknown>
}

export const createPaymentSessionStepId = "module:create-payment-session"
export const createPaymentSessionStep = createStep(
  createPaymentSessionStepId,
  async (data: StepInput, { container }) => {

    const service = container.resolve("paymentSessionService")

    const created = await service.create({
      provider_id: data.provider_id,
      amount: data.amount,
      currency_code: data.currency_code,
      payment_collection: data.payment_collection_id,
      data: data.data,
    })

    return new StepResponse(created, created.id)
  },
  async (createdSession, { container }) => {
    if (!createdSession) {
      return
    }

    const service = container.resolve("paymentSessionService")

    await service.delete(createdSession)
  }
)
