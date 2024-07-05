import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IPaymentModuleService } from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

interface StepInput {
  payment_session_id?: string
}

export const deletePaymentSessionStepId = "delete-payment-session"
export const deletePaymentSessionStep = createStep(
  deletePaymentSessionStepId,
  async (input: StepInput, { container }) => {
    const service = container.resolve<IPaymentModuleService>(
      ModuleRegistrationName.PAYMENT
    )

    if (!input.payment_session_id) {
      return new StepResponse(void 0, null)
    }

    const [session] = await service.listPaymentSessions({
      id: input.payment_session_id,
    })

    await service.deletePaymentSession(input.payment_session_id)

    return new StepResponse(input.payment_session_id, session)
  },
  async (input, { container }) => {
    const service = container.resolve<IPaymentModuleService>(
      ModuleRegistrationName.PAYMENT
    )

    if (!input || !input.payment_collection) {
      return
    }

    await service.createPaymentSession(input.payment_collection.id, {
      provider_id: input.provider_id,
      currency_code: input.currency_code,
      amount: input.amount,
      data: input.data ?? {},
      context: input.context,
    })
  }
)
