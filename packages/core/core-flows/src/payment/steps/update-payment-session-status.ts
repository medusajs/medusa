import { IPaymentModuleService } from "@medusajs/framework/types"
import { Modules, PaymentSessionStatus } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export type UpdatePaymentSessionStatusStepInput = {
  id: string
  status: PaymentSessionStatus
}

export const updatePaymentSessionStatusStepId = "update-payment-session-status"

// Webhooks aren't guaranteed to arrive in order, so a status reported for an
// earlier attempt can show up after the payment has settled. Only a session
// that is still in flight is updated, which keeps a late failure or
// cancelation from overwriting an authorized or captured session.
const UPDATABLE_SESSION_STATUSES = [
  PaymentSessionStatus.PENDING,
  PaymentSessionStatus.REQUIRES_MORE,
  PaymentSessionStatus.PENDING_AUTHORIZATION,
]

export const updatePaymentSessionStatusStep = createStep(
  updatePaymentSessionStatusStepId,
  async (input: UpdatePaymentSessionStatusStepInput, { container }) => {
    if (!input.id || !input.status) {
      return new StepResponse(void 0)
    }

    const paymentModule = container.resolve<IPaymentModuleService>(
      Modules.PAYMENT
    )

    const session = await paymentModule.retrievePaymentSession(input.id)

    if (
      session.status === input.status ||
      !UPDATABLE_SESSION_STATUSES.includes(
        session.status as PaymentSessionStatus
      )
    ) {
      return new StepResponse(void 0)
    }

    await paymentModule.updatePaymentSession({
      id: input.id,
      status: input.status,
    })

    return new StepResponse(void 0, {
      id: input.id,
      status: session.status,
    })
  },
  async (previous, { container }) => {
    if (!previous) {
      return
    }

    const paymentModule = container.resolve<IPaymentModuleService>(
      Modules.PAYMENT
    )

    await paymentModule.updatePaymentSession({
      id: previous.id,
      status: previous.status,
    })
  }
)
