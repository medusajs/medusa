import {
  IPaymentModuleService,
  PaymentSessionDTO,
} from "@medusajs/framework/types"
import { MedusaError, Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"
import { CreatePaymentSessionStepInput } from "./create-payment-session"

/**
 * The result of trying to create a payment session.
 */
export interface TryCreatePaymentSessionStepOutput {
  /**
   * The created payment session, if any.
   */
  session?: PaymentSessionDTO
  /**
   * Whether the payment provider no longer has the account holder in the context, so it has to be replaced
   * before the payment session can be created.
   */
  account_holder_not_found: boolean
}

export const tryCreatePaymentSessionStepId = "try-create-payment-session"
/**
 * This step creates a payment session, like `createPaymentSessionStep`, but reports an account holder
 * that the payment provider no longer has instead of failing.
 */
export const tryCreatePaymentSessionStep = createStep(
  tryCreatePaymentSessionStepId,
  async (
    input: CreatePaymentSessionStepInput,
    { container }
  ): Promise<StepResponse<TryCreatePaymentSessionStepOutput, string>> => {
    const service = container.resolve<IPaymentModuleService>(Modules.PAYMENT)

    try {
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

      return new StepResponse(
        { session, account_holder_not_found: false },
        session.id
      )
    } catch (error) {
      if (
        input.context?.account_holder &&
        MedusaError.isMedusaError(error) &&
        error.code === MedusaError.Codes.ACCOUNT_HOLDER_NOT_FOUND
      ) {
        return new StepResponse({ account_holder_not_found: true })
      }

      throw error
    }
  },
  async (createdSession, { container }) => {
    if (!createdSession) {
      return
    }

    const service = container.resolve<IPaymentModuleService>(Modules.PAYMENT)

    await service.deletePaymentSession(createdSession)
  }
)
