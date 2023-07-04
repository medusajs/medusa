import Stripe from "stripe"
import { EOL } from "os"
import {
  AbstractPaymentProcessor,
  isPaymentProcessorError,
  PaymentProcessorContext,
  PaymentProcessorError,
  PaymentProcessorSessionResponse,
  PaymentSessionStatus,
} from "@medusajs/medusa"
import {
  ErrorCodes,
  ErrorIntentStatus,
  PaymentIntentOptions,
  StripeOptions,
} from "../types"

abstract class StripeBase extends AbstractPaymentProcessor {
  static identifier = ""

  protected readonly options_: StripeOptions
  protected stripe_: Stripe

  protected constructor(_, options) {
    super(_, options)

    this.options_ = options

    this.init()
  }

  protected init(): void {
    this.stripe_ =
      this.stripe_ ||
      new Stripe(this.options_.api_key, {
        apiVersion: "2022-11-15",
      })
  }

  abstract get paymentIntentOptions(): PaymentIntentOptions

  getPaymentIntentOptions(): PaymentIntentOptions {
    const options: PaymentIntentOptions = {}

    if (this?.paymentIntentOptions?.capture_method) {
      options.capture_method = this.paymentIntentOptions.capture_method
    }

    if (this?.paymentIntentOptions?.setup_future_usage) {
      options.setup_future_usage = this.paymentIntentOptions.setup_future_usage
    }

    if (this?.paymentIntentOptions?.payment_method_types) {
      options.payment_method_types =
        this.paymentIntentOptions.payment_method_types
    }

    return options
  }

  async getPaymentStatus(
    paymentSessionData: Record<string, unknown>
  ): Promise<PaymentSessionStatus> {
    const id = paymentSessionData.id as string
    const paymentIntent = await this.stripe_.paymentIntents.retrieve(id)

    switch (paymentIntent.status) {
      case "requires_payment_method":
      case "requires_confirmation":
      case "processing":
        return PaymentSessionStatus.PENDING
      case "requires_action":
        return PaymentSessionStatus.REQUIRES_MORE
      case "canceled":
        return PaymentSessionStatus.CANCELED
      case "requires_capture":
      case "succeeded":
        return PaymentSessionStatus.AUTHORIZED
      default:
        return PaymentSessionStatus.PENDING
    }
  }

  async initiatePayment(
    context: PaymentProcessorContext
  ): Promise<PaymentProcessorError | PaymentProcessorSessionResponse> {
    const intentRequestData = this.getPaymentIntentOptions()
    const {
      email,
      context: cart_context,
      currency_code,
      amount,
      resource_id,
      customer,
    } = context

    const description = (cart_context.payment_description ??
      this.options_?.payment_description) as string

    const intentRequest: Stripe.PaymentIntentCreateParams = {
      description,
      amount: Math.round(amount),
      currency: currency_code,
      metadata: { resource_id },
      capture_method: this.options_.capture ? "automatic" : "manual",
      ...intentRequestData,
    }

    if (this.options_?.automatic_payment_methods) {
      intentRequest.automatic_payment_methods = { enabled: true }
    }

    if (customer?.metadata?.stripe_id) {
      intentRequest.customer = customer.metadata.stripe_id as string
    } else {
      let stripeCustomer
      try {
        stripeCustomer = await this.stripe_.customers.create({
          email,
        })
      } catch (e) {
        return this.buildError(
          "An error occurred in initiatePayment when creating a Stripe customer",
          e
        )
      }

      intentRequest.customer = stripeCustomer.id
    }

    let session_data
    try {
      session_data = (await this.stripe_.paymentIntents.create(
        intentRequest
      )) as unknown as Record<string, unknown>
    } catch (e) {
      return this.buildError(
        "An error occurred in InitiatePayment during the creation of the stripe payment intent",
        e
      )
    }

    return {
      session_data,
      update_requests: customer?.metadata?.stripe_id
        ? undefined
        : {
            customer_metadata: {
              stripe_id: intentRequest.customer,
            },
          },
    }
  }

  async authorizePayment(
    paymentSessionData: Record<string, unknown>,
    context: Record<string, unknown>
  ): Promise<
    | PaymentProcessorError
    | {
        status: PaymentSessionStatus
        data: PaymentProcessorSessionResponse["session_data"]
      }
  > {
    const status = await this.getPaymentStatus(paymentSessionData)
    return { data: paymentSessionData, status }
  }

  async cancelPayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<
    PaymentProcessorError | PaymentProcessorSessionResponse["session_data"]
  > {
    try {
      const id = paymentSessionData.id as string
      return (await this.stripe_.paymentIntents.cancel(
        id
      )) as unknown as PaymentProcessorSessionResponse["session_data"]
    } catch (error) {
      if (error.payment_intent?.status === ErrorIntentStatus.CANCELED) {
        return error.payment_intent
      }

      return this.buildError("An error occurred in cancelPayment", error)
    }
  }

  async capturePayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<
    PaymentProcessorError | PaymentProcessorSessionResponse["session_data"]
  > {
    const id = paymentSessionData.id as string
    try {
      const intent = await this.stripe_.paymentIntents.capture(id)
      return intent as unknown as PaymentProcessorSessionResponse["session_data"]
    } catch (error) {
      if (error.code === ErrorCodes.PAYMENT_INTENT_UNEXPECTED_STATE) {
        if (error.payment_intent?.status === ErrorIntentStatus.SUCCEEDED) {
          return error.payment_intent
        }
      }

      return this.buildError("An error occurred in capturePayment", error)
    }
  }

  async deletePayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<
    PaymentProcessorError | PaymentProcessorSessionResponse["session_data"]
  > {
    return await this.cancelPayment(paymentSessionData)
  }

  async refundPayment(
    paymentSessionData: Record<string, unknown>,
    refundAmount: number
  ): Promise<
    PaymentProcessorError | PaymentProcessorSessionResponse["session_data"]
  > {
    const id = paymentSessionData.id as string

    try {
      await this.stripe_.refunds.create({
        amount: Math.round(refundAmount),
        payment_intent: id as string,
      })
    } catch (e) {
      return this.buildError("An error occurred in refundPayment", e)
    }

    return paymentSessionData
  }

  async retrievePayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<
    PaymentProcessorError | PaymentProcessorSessionResponse["session_data"]
  > {
    try {
      const id = paymentSessionData.id as string
      const intent = await this.stripe_.paymentIntents.retrieve(id)
      return intent as unknown as PaymentProcessorSessionResponse["session_data"]
    } catch (e) {
      return this.buildError("An error occurred in retrievePayment", e)
    }
  }

  async updatePayment(
    context: PaymentProcessorContext
  ): Promise<PaymentProcessorError | PaymentProcessorSessionResponse | void> {
    const { amount, customer, paymentSessionData } = context
    const stripeId = customer?.metadata?.stripe_id

    if (stripeId !== paymentSessionData.customer) {
      const result = await this.initiatePayment(context)
      if (isPaymentProcessorError(result)) {
        return this.buildError(
          "An error occurred in updatePayment during the initiate of the new payment for the new customer",
          result
        )
      }

      return result
    } else {
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

  /**
   * Constructs Stripe Webhook event
   * @param {object} data - the data of the webhook request: req.body
   * @param {object} signature - the Stripe signature on the event, that
   *    ensures integrity of the webhook event
   * @return {object} Stripe Webhook event
   */
  constructWebhookEvent(data, signature) {
    return this.stripe_.webhooks.constructEvent(
      data,
      signature,
      this.options_.webhook_secret
    )
  }

  protected buildError(
    message: string,
    e: Stripe.StripeRawError | PaymentProcessorError | Error
  ): PaymentProcessorError {
    return {
      error: message,
      code: "code" in e ? e.code : "",
      detail: isPaymentProcessorError(e)
        ? `${e.error}${EOL}${e.detail ?? ""}`
        : "detail" in e
        ? e.detail
        : e.message ?? "",
    }
  }
}

export default StripeBase
