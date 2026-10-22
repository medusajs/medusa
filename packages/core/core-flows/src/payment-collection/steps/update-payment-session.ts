import {
  BigNumberInput,
  IPaymentModuleService,
} from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

/**
 * The data to update a payment session.
 */
export interface UpdatePaymentSessionStepInput {
  id: string
  amount: BigNumberInput
  currency_code: string
  data: Record<string, unknown>
}

export const updatePaymentSessionStepId = "update-payment-session"
/**
 * This step updates a payment session through its payment provider.
 *
 * @example
 * const data = updatePaymentSessionStep({
 *   id: "payses_123",
 *   amount: 20,
 *   currency_code: "usd",
 *   data: {
 *     client: {
 *       payment_method: "pm_123"
 *     }
 *   }
 * })
 */
export const updatePaymentSessionStep = createStep(
  updatePaymentSessionStepId,
  async (input: UpdatePaymentSessionStepInput, { container }) => {
    const service = container.resolve<IPaymentModuleService>(Modules.PAYMENT)

    const previous = await service.retrievePaymentSession(input.id, {
      select: ["id", "amount", "currency_code", "data"],
    })

    const session = await service.updatePaymentSession({
      id: input.id,
      amount: input.amount,
      currency_code: input.currency_code,
      data: input.data,
    })

    return new StepResponse(session, {
      id: previous.id,
      amount: previous.amount,
      currency_code: previous.currency_code,
      data: previous.data ?? {},
    })
  },
  async (previous, { container }) => {
    if (!previous) {
      return
    }

    const service = container.resolve<IPaymentModuleService>(Modules.PAYMENT)

    await service.updatePaymentSession(previous)
  }
)
