import Stripe from "stripe"
import { setTimeout } from "timers/promises"
import {
  AuthorizePaymentInput,
  AuthorizePaymentOutput,
  CancelPaymentInput,
  CancelPaymentOutput,
  CapturePaymentInput,
  CapturePaymentOutput,
  CreateAccountHolderInput,
  CreateAccountHolderOutput,
  DeleteAccountHolderInput,
  DeleteAccountHolderOutput,
  DeletePaymentInput,
  DeletePaymentOutput,
  GetPaymentStatusInput,
  GetPaymentStatusOutput,
  InitiatePaymentInput,
  InitiatePaymentOutput,
  ListPaymentMethodsInput,
  ListPaymentMethodsOutput,
  ProviderWebhookPayload,
  RefundPaymentInput,
  RefundPaymentOutput,
  RetrievePaymentInput,
  RetrievePaymentOutput,
  SavePaymentMethodInput,
  SavePaymentMethodOutput,
  UpdateAccountHolderInput,
  UpdateAccountHolderOutput,
  UpdatePaymentInput,
  UpdatePaymentOutput,
  WebhookActionResult,
} from "@medusajs/framework/types"
import {
  AbstractPaymentProvider,
  isDefined,
  isPresent,
  PaymentActions,
  PaymentSessionStatus,
} from "@medusajs/framework/utils"
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

type StripeIndeterminateState = {
  indeterminate_due_to: string
}

type StripeErrorData = Stripe.PaymentIntent | StripeIndeterminateState
type HandledErrorType =
  | { retry: true }
  | { retry: false; data: StripeErrorData }

abstract class StripeBase extends AbstractPaymentProvider<StripeOptions> {
  protected readonly options_: StripeOptions
  protected stripe_: Stripe
  protected container_: Record<string, unknown>

  static validateOptions(options: StripeOptions): void {
    if (!isDefined(options.apiKey)) {
      throw new Error("Required option `apiKey` is missing in Stripe plugin")
    }
  }

  protected constructor(
    cradle: Record<string, unknown>,
    options: StripeOptions
  ) {
    // @ts-ignore
    super(...arguments)

    this.container_ = cradle
    this.options_ = options

    this.stripe_ = new Stripe(options.apiKey)
  }

  abstract get paymentIntentOptions(): PaymentIntentOptions

  get options(): StripeOptions {
    return this.options_
  }

  normalizePaymentIntentParameters(
    extra?: Record<string, unknown>
  ): Partial<Stripe.PaymentIntentCreateParams> {
    const res = {} as Partial<Stripe.PaymentIntentCreateParams>

    res.description = (extra?.payment_description ??
      this.options_?.paymentDescription) as string

    res.capture_method =
      (extra?.capture_method as "automatic" | "manual") ??
      this.paymentIntentOptions.capture_method ??
      (this.options_.capture ? "automatic" : "manual")

    res.setup_future_usage =
      (extra?.setup_future_usage as "off_session" | "on_session" | undefined) ??
      this.paymentIntentOptions.setup_future_usage

    res.payment_method_types =
      (extra?.payment_method_types as string[]) ??
      (this.paymentIntentOptions.payment_method_types as string[])

    res.payment_method_data =
      extra?.payment_method_data as Stripe.PaymentIntentCreateParams.PaymentMethodData

    res.payment_method_options =
      (extra?.payment_method_options as Stripe.PaymentIntentCreateParams.PaymentMethodOptions) ??
      this.paymentIntentOptions.payment_method_options

    res.automatic_payment_methods =
      (extra?.automatic_payment_methods as { enabled: true } | undefined) ??
      (this.options_?.automaticPaymentMethods ? { enabled: true } : undefined)

    res.off_session = extra?.off_session as boolean | undefined

    res.confirm = extra?.confirm as boolean | undefined

    res.payment_method = extra?.payment_method as string | undefined

    res.return_url = extra?.return_url as string | undefined

    // @ts-expect-error - Need to update Stripe SDK
    res.shared_payment_token = extra?.shared_payment_token as string | undefined

    return res
  }

  handleStripeError(error: any): HandledErrorType {
    switch (error.type) {
      case "StripeCardError":
        // Stripe has created a payment intent but it failed
        // Extract and return paymentIntent object to be stored in payment_session
        // Allows for reference to the failed intent and potential webhook reconciliation
        const stripeError = error.raw as Stripe.errors.StripeCardError
        if (stripeError.payment_intent) {
          return {
            retry: false,
            data: stripeError.payment_intent,
          }
        } else {
          throw this.buildError(
            "An error occurred in InitiatePayment during creation of stripe payment intent",
            error
          )
        }

      case "StripeConnectionError":
      case "StripeRateLimitError":
        // Connection or rate limit errors indicate an uncertain result
        // Retry the operation
        return {
          retry: true,
        }
      case "StripeAPIError": {
        // API errors should be treated as indeterminate per Stripe documentation
        // Rely on webhooks rather than assuming failure
        return {
          retry: false,
          data: {
            indeterminate_due_to: "stripe_api_error",
          },
        }
      }
      default:
        // For all other errors, there was likely an issue creating the session
        // on Stripe's servers. Throw an error which will trigger cleanup
        // and deletion of the payment session.
        throw this.buildError(
          "An error occurred in InitiatePayment during creation of stripe payment intent",
          error
        )
    }
  }

  async executeWithRetry<T>(
    apiCall: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000,
    currentAttempt: number = 1
  ): Promise<T | StripeErrorData> {
    try {
      return await apiCall()
    } catch (error) {
      const handledError = this.handleStripeError(error)

      if (!handledError.retry) {
        // If retry is false, we know data exists per the type definition
        return handledError.data
      }

      if (handledError.retry && currentAttempt <= maxRetries) {
        // Logic for retrying
        const delay =
          baseDelay *
          Math.pow(2, currentAttempt - 1) *
          (0.5 + Math.random() * 0.5)
        await setTimeout(delay)
        return this.executeWithRetry(
          apiCall,
          maxRetries,
          baseDelay,
          currentAttempt + 1
        )
      }
      // Retries are exhausted
      throw this.buildError(
        "An error occurred in InitiatePayment during creation of stripe payment intent",
        error
      )
    }
  }

  async getPaymentStatus(
    input: GetPaymentStatusInput
  ): Promise<GetPaymentStatusOutput> {
    const id = input?.data?.id as string
    if (!id) {
      throw this.buildError(
        "No payment intent ID provided while getting payment status",
        new Error("No payment intent ID provided")
      )
    }

    const paymentIntent = await this.stripe_.paymentIntents.retrieve(id)
    const statusResponse = this.getStatus(paymentIntent)

    return statusResponse as unknown as GetPaymentStatusOutput
  }

  async initiatePayment({
    currency_code,
    amount,
    data,
    context,
  }: InitiatePaymentInput): Promise<InitiatePaymentOutput> {
    const additionalParameters = this.normalizePaymentIntentParameters(data)

    const intentRequest: Stripe.PaymentIntentCreateParams = {
      amount: getSmallestUnit(amount, currency_code),
      currency: currency_code,
      metadata: {
        ...(data?.metadata ?? {}),
        session_id: data?.session_id as string,
      },
      ...additionalParameters,
    }

    intentRequest.customer = context?.account_holder?.data?.id as
      | string
      | undefined

    const sessionData = await this.executeWithRetry<Stripe.PaymentIntent>(() =>
      this.stripe_.paymentIntents.create(intentRequest, {
        idempotencyKey: context?.idempotency_key,
      })
    )
    const isPaymentIntent = "id" in sessionData
    return {
      id: isPaymentIntent ? sessionData.id : (data?.session_id as string),
      ...(this.getStatus(
        sessionData as unknown as Stripe.PaymentIntent
      ) as unknown as Pick<InitiatePaymentOutput, "data" | "status">),
    }
  }

  async authorizePayment(
    input: AuthorizePaymentInput
  ): Promise<AuthorizePaymentOutput> {
    return this.getPaymentStatus(input)
  }

  async cancelPayment({
    data,
    context,
  }: CancelPaymentInput): Promise<CancelPaymentOutput> {
    try {
      const id = data?.id as string

      if (!id) {
        return { data: data }
      }

      const res = await this.stripe_.paymentIntents.cancel(id, {
        idempotencyKey: context?.idempotency_key,
      })
      return { data: res as unknown as Record<string, unknown> }
    } catch (error) {
      if (error.payment_intent?.status === ErrorIntentStatus.CANCELED) {
        return { data: error.payment_intent }
      }

      throw this.buildError("An error occurred in cancelPayment", error)
    }
  }

  async capturePayment({
    data,
    context,
  }: CapturePaymentInput): Promise<CapturePaymentOutput> {
    const id = data?.id as string

    try {
      const intent = await this.stripe_.paymentIntents.capture(id, {
        idempotencyKey: context?.idempotency_key,
      })
      return { data: intent as unknown as Record<string, unknown> }
    } catch (error) {
      if (error.code === ErrorCodes.PAYMENT_INTENT_UNEXPECTED_STATE) {
        if (error.payment_intent?.status === ErrorIntentStatus.SUCCEEDED) {
          return { data: error.payment_intent }
        }
      }

      throw this.buildError("An error occurred in capturePayment", error)
    }
  }

  async deletePayment(input: DeletePaymentInput): Promise<DeletePaymentOutput> {
    return await this.cancelPayment(input)
  }

  async refundPayment({
    amount,
    data,
    context,
  }: RefundPaymentInput): Promise<RefundPaymentOutput> {
    const id = data?.id as string
    if (!id) {
      throw this.buildError(
        "No payment intent ID provided while refunding payment",
        new Error("No payment intent ID provided")
      )
    }

    try {
      const currencyCode = data?.currency as string
      await this.stripe_.refunds.create(
        {
          amount: getSmallestUnit(amount, currencyCode),
          payment_intent: id as string,
        },
        {
          idempotencyKey: context?.idempotency_key,
        }
      )
    } catch (e) {
      if (e.code !== ErrorCodes.CHARGE_ALREADY_REFUNDED) {
        throw this.buildError("An error occurred in refundPayment", e)
      }
    }

    return { data }
  }

  async retrievePayment({
    data,
  }: RetrievePaymentInput): Promise<RetrievePaymentOutput> {
    try {
      const id = data?.id as string
      const intent = await this.stripe_.paymentIntents.retrieve(id)

      intent.amount = getAmountFromSmallestUnit(intent.amount, intent.currency)

      return { data: intent as unknown as Record<string, unknown> }
    } catch (e) {
      throw this.buildError("An error occurred in retrievePayment", e)
    }
  }

  async updatePayment({
    data,
    currency_code,
    amount,
    context,
  }: UpdatePaymentInput): Promise<UpdatePaymentOutput> {
    const amountNumeric = getSmallestUnit(amount, currency_code)
    if (isPresent(amount) && data?.amount === amountNumeric) {
      return this.getStatus(
        data as unknown as Stripe.PaymentIntent
      ) as unknown as UpdatePaymentOutput
    }

    try {
      const id = data?.id as string
      const sessionData = (await this.stripe_.paymentIntents.update(
        id,
        {
          amount: amountNumeric,
        },
        {
          idempotencyKey: context?.idempotency_key,
        }
      )) as unknown as Record<string, unknown>

      return this.getStatus(
        sessionData as unknown as Stripe.PaymentIntent
      ) as unknown as UpdatePaymentOutput
    } catch (e) {
      throw this.buildError("An error occurred in updatePayment", e)
    }
  }

  async createAccountHolder({
    context,
  }: CreateAccountHolderInput): Promise<CreateAccountHolderOutput> {
    const { account_holder, customer, idempotency_key } = context

    if (account_holder?.data?.id) {
      return { id: account_holder.data.id as string }
    }

    if (!customer) {
      throw this.buildError(
        "No customer in context",
        new Error("No customer provided while creating account holder")
      )
    }

    const shipping = customer.billing_address
      ? ({
          address: {
            city: customer.billing_address.city,
            country: customer.billing_address.country_code,
            line1: customer.billing_address.address_1,
            line2: customer.billing_address.address_2,
            postal_code: customer.billing_address.postal_code,
            state: customer.billing_address.province,
          },
        } as Stripe.CustomerCreateParams.Shipping)
      : undefined

    try {
      const stripeCustomer = await this.stripe_.customers.create(
        {
          email: customer.email,
          name:
            customer.company_name ||
            `${customer.first_name ?? ""} ${customer.last_name ?? ""}`.trim() ||
            undefined,
          phone: customer.phone as string | undefined,
          ...shipping,
        },
        {
          idempotencyKey: idempotency_key,
        }
      )

      return {
        id: stripeCustomer.id,
        data: stripeCustomer as unknown as Record<string, unknown>,
      }
    } catch (e) {
      throw this.buildError(
        "An error occurred in createAccountHolder when creating a Stripe customer",
        e
      )
    }
  }

  async updateAccountHolder({
    context,
  }: UpdateAccountHolderInput): Promise<UpdateAccountHolderOutput> {
    const { account_holder, customer, idempotency_key } = context

    if (!account_holder?.data?.id) {
      throw this.buildError(
        "No account holder in context",
        new Error("No account holder provided while updating account holder")
      )
    }

    // If no customer context was provided, we simply don't update anything within the provider
    if (!customer) {
      return {}
    }

    const accountHolderId = account_holder.data.id as string

    const shipping = customer.billing_address
      ? ({
          address: {
            city: customer.billing_address.city,
            country: customer.billing_address.country_code,
            line1: customer.billing_address.address_1,
            line2: customer.billing_address.address_2,
            postal_code: customer.billing_address.postal_code,
            state: customer.billing_address.province,
          },
        } as Stripe.CustomerCreateParams.Shipping)
      : undefined

    try {
      const stripeCustomer = await this.stripe_.customers.update(
        accountHolderId,
        {
          email: customer.email,
          name:
            customer.company_name ||
            `${customer.first_name ?? ""} ${customer.last_name ?? ""}`.trim() ||
            undefined,
          phone: customer.phone as string | undefined,
          ...shipping,
        },
        {
          idempotencyKey: idempotency_key,
        }
      )

      return {
        data: stripeCustomer as unknown as Record<string, unknown>,
      }
    } catch (e) {
      throw this.buildError(
        "An error occurred in updateAccountHolder when updating a Stripe customer",
        e
      )
    }
  }

  async deleteAccountHolder({
    context,
  }: DeleteAccountHolderInput): Promise<DeleteAccountHolderOutput> {
    const { account_holder } = context
    const accountHolderId = account_holder?.data?.id as string | undefined
    if (!accountHolderId) {
      throw this.buildError(
        "No account holder in context",
        new Error("No account holder provided while deleting account holder")
      )
    }

    try {
      await this.stripe_.customers.del(accountHolderId)
      return {}
    } catch (e) {
      throw this.buildError("An error occurred in deleteAccountHolder", e)
    }
  }

  async listPaymentMethods({
    context,
  }: ListPaymentMethodsInput): Promise<ListPaymentMethodsOutput> {
    const accountHolderId = context?.account_holder?.data?.id as
      | string
      | undefined
    if (!accountHolderId) {
      return []
    }

    const paymentMethods = await this.stripe_.customers.listPaymentMethods(
      accountHolderId,
      // In order to keep the interface simple, we just list the maximum payment methods, which should be enough in almost all cases.
      // We can always extend the interface to allow additional filtering, if necessary.
      { limit: 100 }
    )

    return paymentMethods.data.map((method) => ({
      id: method.id,
      data: method as unknown as Record<string, unknown>,
    }))
  }

  async savePaymentMethod({
    context,
    data,
  }: SavePaymentMethodInput): Promise<SavePaymentMethodOutput> {
    const accountHolderId = context?.account_holder?.data?.id as
      | string
      | undefined

    if (!accountHolderId) {
      throw this.buildError(
        "Account holder not set while saving a payment method",
        new Error("Missing account holder")
      )
    }

    const resp = await this.stripe_.setupIntents.create(
      {
        customer: accountHolderId,
        ...data,
      },
      {
        idempotencyKey: context?.idempotency_key,
      }
    )

    return { id: resp.id, data: resp as unknown as Record<string, unknown> }
  }

  private getStatus(paymentIntent: Stripe.PaymentIntent): {
    data: Stripe.PaymentIntent
    status: PaymentSessionStatus
  } {
    switch (paymentIntent.status) {
      case "requires_payment_method":
        if (paymentIntent.last_payment_error) {
          return { status: PaymentSessionStatus.ERROR, data: paymentIntent }
        }
        return { status: PaymentSessionStatus.PENDING, data: paymentIntent }
      case "requires_confirmation":
      case "processing":
        return { status: PaymentSessionStatus.PENDING, data: paymentIntent }
      case "requires_action":
        return {
          status: PaymentSessionStatus.REQUIRES_MORE,
          data: paymentIntent,
        }
      case "canceled":
        return { status: PaymentSessionStatus.CANCELED, data: paymentIntent }
      case "requires_capture":
        return { status: PaymentSessionStatus.AUTHORIZED, data: paymentIntent }
      case "succeeded":
        return { status: PaymentSessionStatus.CAPTURED, data: paymentIntent }
      default:
        return { status: PaymentSessionStatus.PENDING, data: paymentIntent }
    }
  }

  async getWebhookActionAndData(
    webhookData: ProviderWebhookPayload["payload"]
  ): Promise<WebhookActionResult> {
    const event = this.constructWebhookEvent(webhookData)
    const intent = event.data.object as Stripe.PaymentIntent

    const { currency } = intent

    switch (event.type) {
      case "payment_intent.created":
      case "payment_intent.processing":
        return {
          action: PaymentActions.PENDING,
          data: {
            session_id: intent.metadata.session_id,
            amount: getAmountFromSmallestUnit(intent.amount, currency),
          },
        }
      case "payment_intent.canceled":
        return {
          action: PaymentActions.CANCELED,
          data: {
            session_id: intent.metadata.session_id,
            amount: getAmountFromSmallestUnit(intent.amount, currency),
          },
        }
      case "payment_intent.payment_failed":
        return {
          action: PaymentActions.FAILED,
          data: {
            session_id: intent.metadata.session_id,
            amount: getAmountFromSmallestUnit(intent.amount, currency),
          },
        }
      case "payment_intent.requires_action":
        return {
          action: PaymentActions.REQUIRES_MORE,
          data: {
            session_id: intent.metadata.session_id,
            amount: getAmountFromSmallestUnit(intent.amount, currency),
          },
        }
      case "payment_intent.amount_capturable_updated":
        return {
          action: PaymentActions.AUTHORIZED,
          data: {
            session_id: intent.metadata.session_id,
            amount: getAmountFromSmallestUnit(
              intent.amount_capturable,
              currency
            ),
          },
        }
      case "payment_intent.partially_funded":
        return {
          action: PaymentActions.REQUIRES_MORE,
          data: {
            session_id: intent.metadata.session_id,
            amount: getAmountFromSmallestUnit(
              intent.next_action?.display_bank_transfer_instructions
                ?.amount_remaining ?? intent.amount,
              currency
            ),
          },
        }
      case "payment_intent.succeeded":
        return {
          action: PaymentActions.SUCCESSFUL,
          data: {
            session_id: intent.metadata.session_id,
            amount: getAmountFromSmallestUnit(intent.amount_received, currency),
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
      this.options_.webhookSecret
    )
  }
  protected buildError(message: string, error: Error): Error {
    const errorDetails =
      "raw" in error ? (error.raw as Stripe.StripeRawError) : error

    return new Error(
      `${message}: ${error.message}. ${
        "detail" in errorDetails ? errorDetails.detail : ""
      }`.trim()
    )
  }
}

export default StripeBase
