import { EOL } from "os"

import Stripe from "stripe"

import {
  MedusaContainer,
  PaymentSessionStatus,
  PaymentProviderContext,
  PaymentProviderError,
  PaymentProviderSessionResponse,
} from "@medusajs/types"
import {
  AbstractPaymentProvider,
  isPaymentProviderError,
  MedusaError,
} from "@medusajs/utils"
import { isDefined } from "medusa-core-utils"

import { handlePaymentHook } from "../utils/webhook-handlers"

import {
  ErrorCodes,
  ErrorIntentStatus,
  PaymentIntentOptions,
  StripeCredentials,
  StripeOptions,
} from "../types"

type StripeWebhookEventData = {
  data: string | Buffer
  headers: {
    "stripe-signature": string | string[] | Buffer
  } & Record<string, unknown>
}

abstract class StripeBase extends AbstractPaymentProvider<StripeCredentials> {
  protected readonly options_: StripeOptions
  protected stripe_: Stripe
  protected container_: MedusaContainer

  protected constructor(container: MedusaContainer, options: StripeOptions) {
    // @ts-ignore
    super(...arguments)

    this.container_ = container
    this.options_ = options

    this.stripe_ = this.init()
  }

  protected init() {
    this.validateOptions(this.config)

    return new Stripe(this.config.api_key)
  }

  abstract get paymentIntentOptions(): PaymentIntentOptions

  private validateOptions(options: StripeCredentials): void {
    if (!isDefined(options.api_key)) {
      throw new Error("Required option `api_key` is missing in Stripe plugin")
    }
  }

  get options(): StripeOptions {
    return this.options_
  }

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
    context: PaymentProviderContext
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse> {
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
      data: session_data,
      // TODO: REVISIT
      // update_requests: customer?.metadata?.stripe_id
      //   ? undefined
      //   : {
      //       customer_metadata: {
      //         stripe_id: intentRequest.customer,
      //       },
      //     },
    }
  }

  async authorizePayment(
    paymentSessionData: Record<string, unknown>,
    context: Record<string, unknown>
  ): Promise<
    | PaymentProviderError
    | {
        status: PaymentSessionStatus
        data: PaymentProviderSessionResponse["data"]
      }
  > {
    const status = await this.getPaymentStatus(paymentSessionData)
    return { data: paymentSessionData, status }
  }

  async cancelPayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse["data"]> {
    try {
      const id = paymentSessionData.id as string
      return (await this.stripe_.paymentIntents.cancel(
        id
      )) as unknown as PaymentProviderSessionResponse["data"]
    } catch (error) {
      if (error.payment_intent?.status === ErrorIntentStatus.CANCELED) {
        return error.payment_intent
      }

      return this.buildError("An error occurred in cancelPayment", error)
    }
  }

  async capturePayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse["data"]> {
    const id = paymentSessionData.id as string
    try {
      const intent = await this.stripe_.paymentIntents.capture(id)
      return intent as unknown as PaymentProviderSessionResponse["data"]
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
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse["data"]> {
    return await this.cancelPayment(paymentSessionData)
  }

  async refundPayment(
    paymentSessionData: Record<string, unknown>,
    refundAmount: number
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse["data"]> {
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
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse["data"]> {
    try {
      const id = paymentSessionData.id as string
      const intent = await this.stripe_.paymentIntents.retrieve(id)
      return intent as unknown as PaymentProviderSessionResponse["data"]
    } catch (e) {
      return this.buildError("An error occurred in retrievePayment", e)
    }
  }

  async updatePayment(
    context: PaymentProviderContext
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse> {
    const { amount, customer, payment_session_data } = context
    const stripeId = customer?.metadata?.stripe_id

    if (stripeId !== payment_session_data.customer) {
      const result = await this.initiatePayment(context)
      if (isPaymentProviderError(result)) {
        return this.buildError(
          "An error occurred in updatePayment during the initiate of the new payment for the new customer",
          result
        )
      }

      return result
    } else {
      if (amount && payment_session_data.amount === Math.round(amount)) {
        return { data: payment_session_data }
      }

      try {
        const id = payment_session_data.id as string
        const sessionData = (await this.stripe_.paymentIntents.update(id, {
          amount: Math.round(amount),
        })) as unknown as PaymentProviderSessionResponse["data"]

        return { data: sessionData }
      } catch (e) {
        return this.buildError("An error occurred in updatePayment", e)
      }
    }
  }

  async updatePaymentData(sessionId: string, data: Record<string, unknown>) {
    try {
      // Prevent from updating the amount from here as it should go through
      // the updatePayment method to perform the correct logic
      if (data.amount) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Cannot update amount, use updatePayment instead"
        )
      }

      return (await this.stripe_.paymentIntents.update(sessionId, {
        ...data,
      })) as unknown as PaymentProviderSessionResponse["data"]
    } catch (e) {
      return this.buildError("An error occurred in updatePaymentData", e)
    }
  }

  /**
   * Called when a webhook event is received.
   *
   * @param {object} data - webhook payload
   */
  async onWebhookReceived(data: StripeWebhookEventData): Promise<void> {
    const event = this.constructWebhookEvent(data)
    const paymentIntent = await this.stripe_.paymentIntents.retrieve(
      (event.data.object as Stripe.PaymentIntent).id
    )

    await handlePaymentHook({
      event,
      paymentIntent,
      container: this.container_,
    })
  }

  /**
   * Constructs Stripe Webhook event
   * @param {object} data - the data of the webhook request: req.body
   * @param {object} signature - the Stripe signature on the event, that
   *    ensures integrity of the webhook event
   * @return {object} Stripe Webhook event
   */
  constructWebhookEvent(data: StripeWebhookEventData): Stripe.Event {
    const signature = data.headers["stripe-signature"]

    return this.stripe_.webhooks.constructEvent(
      data.data,
      signature,
      this.config.webhook_secret
    )
  }

  protected buildError(
    message: string,
    error: Stripe.StripeRawError | PaymentProviderError | Error
  ): PaymentProviderError {
    return {
      error: message,
      code: "code" in error ? error.code : "unknown",
      detail: isPaymentProviderError(error)
        ? `${error.error}${EOL}${error.detail ?? ""}`
        : "detail" in error
        ? error.detail
        : error.message ?? "",
    }
  }
}

export default StripeBase
