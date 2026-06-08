import { setTimeout } from "timers/promises"
import stripe from "stripe"
import {
  AuthorizePaymentInput,
  AuthorizePaymentOutput,
  CancelPaymentInput,
  CancelPaymentOutput,
  CapturePaymentInput,
  CapturePaymentOutput,
  RetrieveAccountHolderInput,
  RetrieveAccountHolderOutput,
  CreateAccountHolderInput,
  CreateAccountHolderOutput,
  DeleteAccountHolderInput,
  DeleteAccountHolderOutput,
  DeletePaymentMethodInput,
  DeletePaymentMethodOutput,
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
import { MedusaPaymentsOptions } from "../types"
import {
  getAmountFromSmallestUnit,
  getSmallestUnit,
} from "../utils/get-smallest-unit"
import {
  CreateAccountHolderRequest,
  CreatePaymentRequest,
  MedusaAccountHolder,
  MedusaPayment,
  MedusaPaymentMethod,
  MedusaPaymentMethodSession,
  MedusaRefund,
  RefundPaymentRequest,
  UpdateAccountHolderRequest,
} from "../types/medusa-payments"

type HandledErrorType = { retry: true } | { retry: false; data: any }
class CloudServiceError extends Error {
  type: string
  originalType: string
  data: any
  message: string

  constructor(type: string, originalType: string, data: any, message: string) {
    super(message)
    this.type = type
    this.originalType = originalType
    this.data = data
    this.message = message
  }
}

export class MedusaPaymentsProvider extends AbstractPaymentProvider<MedusaPaymentsOptions> {
  static identifier = "medusa-payments"
  protected readonly options_: MedusaPaymentsOptions
  protected container_: Record<string, unknown>
  // The stripe client is used to construct the webhook event, since we construct it the same way as Stripe does.
  protected readonly stripeClient: stripe

  // The provider is loaded in a different a bit differently - it is not passed as a provider but the options are passed to the module's configuration.
  // Due to that, the validation needs to happen in the constructor
  static validateOptions(options: MedusaPaymentsOptions): void {
    return validateOptions(options)
  }

  constructor(cradle: Record<string, unknown>, options: MedusaPaymentsOptions) {
    super(cradle, options)

    validateOptions(options ?? {})
    this.options_ = options
    this.stripeClient = new stripe(options.api_key)
  }

  request<T>(
    url: string,
    options: Omit<RequestInit, "body"> & { body?: object }
  ): Promise<T> {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Basic ${this.options_.api_key}`,
    }
    if (this.options_.environment_handle) {
      headers["x-medusa-environment-handle"] = this.options_.environment_handle
    }
    if (this.options_.sandbox_handle) {
      headers["x-medusa-sandbox-handle"] = this.options_.sandbox_handle
    }

    return fetch(`${this.options_.endpoint}${url}`, {
      ...options,
      body: options.body ? JSON.stringify(options.body) : undefined,
      headers: {
        ...options.headers,
        ...headers,
      },
    }).then(async (res) => {
      const body = await res.json().catch(() => ({}))

      if (!res.ok) {
        throw new CloudServiceError(
          body.type,
          body.originalType,
          body.data,
          body.message
        )
      }

      return body
    })
  }

  normalizePaymentParameters(
    extra?: Record<string, string>
  ): Partial<CreatePaymentRequest> {
    const res = {
      description: extra?.payment_description ?? "",
      capture_method: extra?.capture_method as "automatic" | "manual",
      setup_future_usage: extra?.setup_future_usage,
      payment_method_types: extra?.payment_method_types,
      payment_method_data: extra?.payment_method_data,
      payment_method_options: extra?.payment_method_options,
      automatic_payment_methods: extra?.automatic_payment_methods,
      off_session: extra?.off_session,
      confirm: extra?.confirm,
      payment_method: extra?.payment_method,
      return_url: extra?.return_url,
      shared_payment_token: extra?.shared_payment_token,
    } as Partial<CreatePaymentRequest>

    return res
  }

  handleStripeError(error: CloudServiceError): HandledErrorType {
    let medusaPayment: MedusaPayment | undefined

    switch (error.type) {
      case "MedusaCardError":
        // Medusa has created a payment but it failed
        // Extract and return payment object to be stored in payment_session
        // Allows for reference to the failed intent and potential webhook reconciliation
        medusaPayment = error.data as MedusaPayment | undefined
        if (medusaPayment) {
          return {
            retry: false,
            data: medusaPayment,
          }
        } else {
          throw error
        }
      case "MedusaPaymentUnexpectedStateError":
        medusaPayment = error.data as MedusaPayment | undefined
        if (medusaPayment) {
          return {
            retry: false,
            data: medusaPayment,
          }
        } else {
          throw error
        }
      case "MedusaConnectionError":
      case "MedusaRateLimitError":
        // Connection or rate limit errors indicate an uncertain result
        // Retry the operation
        return {
          retry: true,
        }
      case "MedusaAPIError": {
        // API errors should be treated as indeterminate per Stripe documentation
        // Rely on webhooks rather than assuming failure
        return {
          retry: false,
          data: {
            indeterminate_due_to: "medusa_api_error",
          },
        }
      }
      default:
        throw error
    }
  }

  async executeWithRetry<T>(
    apiCall: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000,
    currentAttempt: number = 1
  ): Promise<T> {
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
      throw error
    }
  }

  async getPaymentStatus(
    input: GetPaymentStatusInput
  ): Promise<GetPaymentStatusOutput> {
    const id = input?.data?.id as string
    if (!id) {
      throw new Error(
        "No payment intent ID provided while getting payment status"
      )
    }

    const payment = await this.retrievePayment({ data: { id } })
    const statusResponse = this.getStatus(
      payment.data as unknown as MedusaPayment
    )

    return statusResponse
  }

  async initiatePayment({
    currency_code,
    amount,
    data,
    context,
  }: InitiatePaymentInput): Promise<InitiatePaymentOutput> {
    const additionalParameters = this.normalizePaymentParameters(
      data as Record<string, string>
    )

    const intentRequest = {
      amount: getSmallestUnit(amount, currency_code),
      currency: currency_code,
      metadata: {
        session_id: data?.session_id as string,
      },
      account_holder_id: context?.account_holder?.data?.id as
        | string
        | undefined,
      idempotency_key: context?.idempotency_key,
      ...additionalParameters,
    } as CreatePaymentRequest

    const payment = (await this.executeWithRetry(() => {
      return this.request<{ payment: any }>("/payments", {
        method: "POST",
        body: intentRequest,
      }).then((data) => data.payment)
    })) as MedusaPayment

    return {
      id: payment.id,
      ...this.getStatus(payment),
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
    const id = data?.id as string

    if (!id) {
      return { data: data }
    }

    const intent = (await this.executeWithRetry(() => {
      return this.request<{ payment: any }>(`/payments/${id}/cancel`, {
        method: "POST",
        body: {
          idempotency_key: context?.idempotency_key,
        },
      }).then((data) => data.payment)
    })) as MedusaPayment

    const status = this.getStatus(intent)
    if (status.status !== PaymentSessionStatus.CANCELED) {
      throw new Error(
        `Payment with id ${id} could not be canceled. Status: ${status.status}`
      )
    }

    return { data: intent as unknown as Record<string, unknown> }
  }

  async capturePayment({
    data,
    context,
  }: CapturePaymentInput): Promise<CapturePaymentOutput> {
    const id = data?.id as string

    const intent = (await this.executeWithRetry(() => {
      return this.request<{ payment: any }>(`/payments/${id}/capture`, {
        method: "POST",
        body: {
          idempotency_key: context?.idempotency_key,
        },
      }).then((data) => data.payment)
    })) as MedusaPayment

    const status = this.getStatus(intent)
    if (status.status !== PaymentSessionStatus.CAPTURED) {
      throw new Error(
        `Payment with id ${id} could not be captured. Status: ${status.status}`
      )
    }

    return { data: intent as unknown as Record<string, unknown> }
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
      throw new Error("No payment intent ID provided while refunding payment")
    }

    const currencyCode = data?.currency as string

    const response = (await this.executeWithRetry(() => {
      return this.request<{ refund: any }>(`/payments/${id}/refund`, {
        method: "POST",
        body: {
          amount: getSmallestUnit(amount, currencyCode),
          idempotency_key: context?.idempotency_key,
        } as RefundPaymentRequest,
      }).then((data) => data.refund)
    })) as MedusaRefund

    return { data: response as unknown as Record<string, unknown> }
  }

  async retrievePayment({
    data,
  }: RetrievePaymentInput): Promise<RetrievePaymentOutput> {
    const id = data?.id as string

    const intent = (await this.executeWithRetry(() => {
      return this.request<{ payment: any }>(`/payments/${id}`, {
        method: "GET",
      }).then((data) => data.payment)
    })) as MedusaPayment

    intent.amount = getAmountFromSmallestUnit(intent.amount, intent.currency)

    return { data: intent as unknown as Record<string, unknown> }
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
        data as unknown as MedusaPayment
      ) as unknown as UpdatePaymentOutput
    }

    const id = data?.id as string

    const sessionData = (await this.executeWithRetry(() => {
      return this.request<{ payment: any }>(`/payments/${id}`, {
        method: "POST",
        body: {
          amount: amountNumeric,
          idempotency_key: context?.idempotency_key,
        },
      }).then((data) => data.payment)
    })) as MedusaPayment

    return this.getStatus(sessionData)
  }

  async retrieveAccountHolder({
    id,
  }: RetrieveAccountHolderInput): Promise<RetrieveAccountHolderOutput> {
    if (!id) {
      throw new Error(
        "No account holder ID provided while getting account holder"
      )
    }

    const res = (await this.executeWithRetry(() => {
      return this.request<{ account_holder: any }>(`/account-holders/${id}`, {
        method: "GET",
      }).then((data) => data.account_holder)
    })) as MedusaAccountHolder

    return {
      id: res.id,
      data: res as unknown as Record<string, unknown>,
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
      throw new Error("No customer provided while creating account holder")
    }

    const shipping = customer.billing_address
      ? {
          address: {
            city: customer.billing_address.city,
            country: customer.billing_address.country_code,
            line1: customer.billing_address.address_1,
            line2: customer.billing_address.address_2,
            postal_code: customer.billing_address.postal_code,
            state: customer.billing_address.province,
          },
        }
      : undefined

    const accountHolder = (await this.executeWithRetry(() => {
      return this.request<{ account_holder: any }>(`/account-holders`, {
        method: "POST",
        body: {
          email: customer.email,
          name:
            customer.company_name ||
            `${customer.first_name ?? ""} ${customer.last_name ?? ""}`.trim() ||
            undefined,
          phone: customer.phone as string | undefined,
          ...shipping,
          idempotency_key: idempotency_key,
        } as CreateAccountHolderRequest,
      }).then((data) => data.account_holder)
    })) as MedusaAccountHolder

    return {
      id: accountHolder.id,
      data: accountHolder as unknown as Record<string, unknown>,
    }
  }

  async updateAccountHolder({
    context,
  }: UpdateAccountHolderInput): Promise<UpdateAccountHolderOutput> {
    const { account_holder, customer, idempotency_key } = context

    if (!account_holder?.data?.id) {
      throw new Error(
        "No account holder in context while updating account holder"
      )
    }

    // If no customer context was provided, we simply don't update anything within the provider
    if (!customer) {
      return {}
    }

    const accountHolderId = account_holder.data.id as string

    const shipping = customer.billing_address
      ? {
          address: {
            city: customer.billing_address.city,
            country: customer.billing_address.country_code,
            line1: customer.billing_address.address_1,
            line2: customer.billing_address.address_2,
            postal_code: customer.billing_address.postal_code,
            state: customer.billing_address.province,
          },
        }
      : undefined

    const accountHolder = (await this.executeWithRetry(() => {
      return this.request<{ account_holder: any }>(
        `/account-holders/${accountHolderId}`,
        {
          method: "POST",
          body: {
            email: customer.email,
            name:
              customer.company_name ||
              `${customer.first_name ?? ""} ${
                customer.last_name ?? ""
              }`.trim() ||
              undefined,
            phone: customer.phone as string | undefined,
            ...shipping,
            idempotency_key: idempotency_key,
          } as UpdateAccountHolderRequest,
        }
      ).then((data) => data.account_holder)
    })) as MedusaAccountHolder

    return {
      data: accountHolder as unknown as Record<string, unknown>,
    }
  }

  async deleteAccountHolder({
    context,
  }: DeleteAccountHolderInput): Promise<DeleteAccountHolderOutput> {
    const { account_holder } = context
    const accountHolderId = account_holder?.data?.id as string | undefined
    if (!accountHolderId) {
      throw new Error(
        "No account holder in context while deleting account holder"
      )
    }

    await this.executeWithRetry(() => {
      return this.request<{ account_holder: any }>(
        `/account-holders/${accountHolderId}`,
        {
          method: "DELETE",
        }
      )
    })

    return {}
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

    const paymentMethods = (await this.executeWithRetry(() => {
      return this.request<{ payment_methods: any[] }>(
        `/payment-methods?account_holder_id=${accountHolderId}`,
        {
          method: "GET",
        }
      ).then((data) => data.payment_methods)
    })) as MedusaPaymentMethod[]

    return paymentMethods.map((method) => ({
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
      throw new Error("Account holder not set while saving a payment method")
    }

    const paymentMethodSession = (await this.executeWithRetry(() => {
      return this.request<{ payment_method_session: any }>(`/payment-methods`, {
        method: "POST",
        body: {
          account_holder_id: accountHolderId,
          ...data,
          idempotency_key: context?.idempotency_key,
        },
      }).then((data) => data.payment_method_session)
    })) as MedusaPaymentMethodSession

    return {
      id: paymentMethodSession.id,
      data: paymentMethodSession as unknown as Record<string, unknown>,
    }
  }

  async deletePaymentMethod({
    context,
    data,
  }: DeletePaymentMethodInput): Promise<DeletePaymentMethodOutput> {
    const paymentMethodId = data?.id as string | undefined

    if (!paymentMethodId) {
      throw new Error(
        "Payment method ID not set while deleting a payment method"
      )
    }

    await this.executeWithRetry(() => {
      return this.request<{ payment_method: any }>(
        `/payment-methods/${paymentMethodId}`,
        {
          method: "DELETE",
          body: {
            idempotency_key: context?.idempotency_key,
          },
        }
      )
    })

    return {}
  }

  private getStatus(payment: MedusaPayment) {
    const paymenAsRecord = payment as unknown as Record<string, unknown>

    switch (payment.status) {
      case "requires_payment_method":
        if (payment.last_payment_error) {
          return { status: PaymentSessionStatus.ERROR, data: paymenAsRecord }
        }
        return { status: PaymentSessionStatus.PENDING, data: paymenAsRecord }
      case "requires_confirmation":
      case "processing":
        return { status: PaymentSessionStatus.PENDING, data: paymenAsRecord }
      case "requires_action":
        return {
          status: PaymentSessionStatus.REQUIRES_MORE,
          data: paymenAsRecord,
        }
      case "canceled":
        return { status: PaymentSessionStatus.CANCELED, data: paymenAsRecord }
      case "requires_capture":
        return { status: PaymentSessionStatus.AUTHORIZED, data: paymenAsRecord }
      case "succeeded":
        return { status: PaymentSessionStatus.CAPTURED, data: paymenAsRecord }
      default:
        return { status: PaymentSessionStatus.PENDING, data: paymenAsRecord }
    }
  }

  async getWebhookActionAndData(
    webhookData: ProviderWebhookPayload["payload"]
  ): Promise<WebhookActionResult> {
    const event = this.constructWebhookEvent(webhookData)
    const intent = event.data.object as stripe.PaymentIntent

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
   * Constructs Medusa Payments Webhook event
   * @param {object} data - the data of the webhook request: req.body
   *    ensures integrity of the webhook event
   * @return {object} Medusa Payments Webhook event
   */
  constructWebhookEvent(data: ProviderWebhookPayload["payload"]) {
    const signature = data.headers["medusa-payments-signature"] as string

    const stripeEvent = this.stripeClient.webhooks.constructEvent(
      data.rawData as string | Buffer,
      signature,
      this.options_.webhook_secret
    )

    return stripeEvent
  }
}

const validateOptions = (options: MedusaPaymentsOptions): void => {
  if (!isDefined(options.endpoint)) {
    throw new Error(
      "Required option `endpoint` is missing in Medusa payments plugin"
    )
  }
  if (!isDefined(options.webhook_secret)) {
    throw new Error(
      "Required option `webhook_secret` is missing in Medusa payments plugin"
    )
  }
  if (!isDefined(options.api_key)) {
    throw new Error(
      "Required option `api_key` is missing in Medusa payments plugin"
    )
  }

  if (
    !isDefined(options.environment_handle) &&
    !isDefined(options.sandbox_handle)
  ) {
    throw new Error(
      "Required option `environment_handle` or `sandbox_handle` is missing in Medusa payments plugin"
    )
  }
}
