import { EOL } from "os"

import Stripe from "stripe"

import {
  CreatePaymentProviderSession,
  MedusaContainer,
  PaymentProviderError,
  PaymentProviderSessionResponse,
  ProviderWebhookPayload,
  UpdatePaymentProviderSession,
  WebhookActionResult,
} from "@medusajs/types"
import {
  AbstractPaymentProvider,
  MedusaError,
  PaymentActions,
  PaymentSessionStatus,
  isDefined,
  isPaymentProviderError,
} from "@medusajs/utils"
import {
  ErrorCodes,
  ErrorIntentStatus,
  PaymentIntentOptions,
  StripeOptions,
} from "../types"
import {
  getAmountFromSmallestUnit,
  getSmallestUnit,
} from "../utils/get-smallest-unit"

abstract class StripeBase extends AbstractPaymentProvider<StripeOptions> {
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

    return new Stripe(this.config.apiKey)
  }

  abstract get paymentIntentOptions(): PaymentIntentOptions

  private validateOptions(options: StripeOptions): void {
    if (!isDefined(options.apiKey)) {
      throw new Error("Required option `apiKey` is missing in Stripe plugin")
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
    input: CreatePaymentProviderSession
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse> {
    const intentRequestData = this.getPaymentIntentOptions()
    const { email, extra, resource_id, customer } = input.context
    const { currency_code, amount } = input

    const description = (extra?.payment_description ??
      this.options_?.paymentDescription) as string

    const intentRequest: Stripe.PaymentIntentCreateParams = {
      description,
      amount: getSmallestUnit(amount, currency_code),
      currency: currency_code,
      metadata: { resource_id: resource_id ?? "Medusa Payment" },
      capture_method: this.options_.capture ? "automatic" : "manual",
      ...intentRequestData,
    }

    if (this.options_?.automaticPaymentMethods) {
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

    let sessionData
    try {
      sessionData = (await this.stripe_.paymentIntents.create(
        intentRequest
      )) as unknown as Record<string, unknown>
    } catch (e) {
      return this.buildError(
        "An error occurred in InitiatePayment during the creation of the stripe payment intent",
        e
      )
    }

    return {
      data: sessionData,
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
      const { currency } = paymentSessionData
      await this.stripe_.refunds.create({
        amount: getSmallestUnit(refundAmount, currency as string),
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

      intent.amount = getAmountFromSmallestUnit(intent.amount, intent.currency)

      return intent as unknown as PaymentProviderSessionResponse["data"]
    } catch (e) {
      return this.buildError("An error occurred in retrievePayment", e)
    }
  }

  async updatePayment(
    input: UpdatePaymentProviderSession
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse> {
    const { context, data, currency_code, amount } = input

    const amountNumeric = getSmallestUnit(amount, currency_code)

    const stripeId = context.customer?.metadata?.stripe_id

    if (stripeId !== data.customer) {
      const result = await this.initiatePayment(input)
      if (isPaymentProviderError(result)) {
        return this.buildError(
          "An error occurred in updatePayment during the initiate of the new payment for the new customer",
          result
        )
      }

      return result
    } else {
      if (amount && data.amount === amountNumeric) {
        return { data }
      }

      try {
        const id = data.id as string
        const sessionData = (await this.stripe_.paymentIntents.update(id, {
          amount: amountNumeric,
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

  async getWebhookActionAndData(
    webhookData: ProviderWebhookPayload["payload"]
  ): Promise<WebhookActionResult> {
    const event = this.constructWebhookEvent(webhookData)
    const intent = event.data.object as Stripe.PaymentIntent

    const { currency } = intent
    switch (event.type) {
      case "payment_intent.amount_capturable_updated":
        return {
          action: PaymentActions.AUTHORIZED,
          data: {
            resource_id: intent.metadata.resource_id,
            amount: getAmountFromSmallestUnit(
              intent.amount_capturable,
              currency
            ), // NOTE: revisit when implementing multicapture
          },
        }
      case "payment_intent.succeeded":
        return {
          action: PaymentActions.SUCCESSFUL,
          data: {
            resource_id: intent.metadata.resource_id,
            amount: getAmountFromSmallestUnit(intent.amount_received, currency),
          },
        }
      case "payment_intent.payment_failed":
        return {
          action: PaymentActions.FAILED,
          data: {
            resource_id: intent.metadata.resource_id,
            amount: getAmountFromSmallestUnit(intent.amount, currency),
          },
        }
      default:
        return { action: PaymentActions.NOT_SUPPORTED }
    }
  }

  /**
   * Constructs Stripe Webhook event
   * @param {object} data - the data of the webhook request: req.body
   *    ensures integrity of the webhook event
   * @return {object} Stripe Webhook event
   */
  constructWebhookEvent(data: ProviderWebhookPayload["payload"]): Stripe.Event {
    const signature = data.headers["stripe-signature"] as string

    return this.stripe_.webhooks.constructEvent(
      data.rawData as string | Buffer,
      signature,
      this.config.webhookSecret
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
