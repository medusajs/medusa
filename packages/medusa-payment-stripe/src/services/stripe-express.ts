import type { PaymentProcessorContext, PaymentProcessorError, PaymentProcessorSessionResponse } from "@medusajs/medusa"
import StripeBase from "../core/stripe-base"
import { PaymentIntentOptions, PaymentProviderKeys } from "../types"

class ExpressProviderService extends StripeBase {
  static identifier = PaymentProviderKeys.STRIPE_EXPRESS

  constructor(_, options) {
    super(_, options)
  }

  get paymentIntentOptions(): PaymentIntentOptions {
    return {}
  }

  async updatePayment(
    context: PaymentProcessorContext
  ): Promise<PaymentProcessorError | PaymentProcessorSessionResponse | void> {
    const { amount, customer, paymentSessionData } = context

    if (amount && paymentSessionData.amount === Math.round(amount)) {
      return
    }

    try {
      const id = paymentSessionData.id as string
      const sessionData = (await this.stripe_.paymentIntents.update(id, {
        amount: Math.round(amount),
      })) as unknown as PaymentProcessorSessionResponse["session_data"]

      return { session_data: sessionData }
    } catch (e) {
      return this.buildError("An error occurred in updatePayment", e)
    }
  }
}

export default ExpressProviderService
