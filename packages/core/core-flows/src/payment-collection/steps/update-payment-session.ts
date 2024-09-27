import { IPaymentModuleService } from "@medusajs/types"
import { Modules } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export interface UpdatePaymentSessionStepInput {
  id: string
  provider_id: string
  data?: Record<string, unknown>
  context?: Record<string, unknown>
}

export const updatePaymentSessionStepId = "update-payment-session"
/**
 * This step updates a payment session.
 */
export const updatePaymentSessionStep = createStep(
  updatePaymentSessionStepId,
  async (input: UpdatePaymentSessionStepInput, { container }) => {
    const service = container.resolve<IPaymentModuleService>(Modules.PAYMENT)

    const prevSession = await service.retrievePaymentSession(input.id, {
      select: ["id", "data", "provider_id"],
    })

    const session = await service.updatePaymentSession({
      id: input.id,
      data: input.data ?? {},
      provider_id: input.provider_id,
      context: input.context ?? {},
    })

    return new StepResponse(session, {
      ...prevSession,
      context: input.context ?? {},
    })
  },
  async (previousSession, { container }) => {
    if (!previousSession) {
      return
    }

    const service = container.resolve<IPaymentModuleService>(Modules.PAYMENT)

    await service.updatePaymentSession(previousSession)
  }
)
