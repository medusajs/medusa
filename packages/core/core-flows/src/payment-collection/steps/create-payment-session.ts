import {
  BigNumberInput,
  IPaymentModuleService,
  PaymentProviderContext,
} from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The data to create a payment session.
 */
export interface CreatePaymentSessionStepInput {
  /**
   * The ID of the payment collection that the session belongs to.
   */
  payment_collection_id: string
  /**
   * The ID of the payment provider that the payment session is associated with.
   */
  provider_id: string
  /**
   * The payment session's amount.
   */
  amount: BigNumberInput
  /**
   * The currency code of the payment session.
   *
   * @example
   * usd
   */
  currency_code: string
  /**
   * Additional context that's useful for the payment provider to process the payment session.
   */
  context?: PaymentProviderContext
  /**
   * Custom data relevant for the payment provider to process the payment session.
   * Learn more in [this documentation](https://docs.medusajs.com/resources/commerce-modules/payment/payment-session#data-property).
   */
  data?: Record<string, unknown>

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown>
}

export const createPaymentSessionStepId = "create-payment-session"
/**
 * This step creates a payment session.
 */
export const createPaymentSessionStep = createStep(
  createPaymentSessionStepId,
  async (input: CreatePaymentSessionStepInput, { container }) => {
    const service = container.resolve<IPaymentModuleService>(Modules.PAYMENT)

    const session = await service.createPaymentSession(
      input.payment_collection_id,
      {
        provider_id: input.provider_id,
        currency_code: input.currency_code,
        amount: input.amount,
        data: input.data ?? {},
        context: input.context,
        metadata: input.metadata ?? {},
      }
    )

    return new StepResponse(session, session.id)
  },
  async (createdSession, { container }) => {
    if (!createdSession) {
      return
    }

    const service = container.resolve<IPaymentModuleService>(Modules.PAYMENT)

    await service.deletePaymentSession(createdSession)
  }
)
