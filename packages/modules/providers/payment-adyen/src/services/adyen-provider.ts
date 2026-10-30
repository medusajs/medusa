import crypto from "crypto"

import {
  CheckoutAPI,
  Client,
  EnvironmentEnum,
  hmacValidator,
  Types,
} from "@adyen/api-library"
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
  DeletePaymentMethodInput,
  DeletePaymentMethodOutput,
  InitiatePaymentInput,
  InitiatePaymentOutput,
  ListPaymentMethodsInput,
  ListPaymentMethodsOutput,
  Logger,
  ProviderWebhookPayload,
  RefundPaymentInput,
  RefundPaymentOutput,
  RetrieveAccountHolderInput,
  RetrieveAccountHolderOutput,
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
  MedusaError,
  PaymentActions,
  PaymentSessionStatus,
} from "@medusajs/framework/utils"

import { AdyenClientData, AdyenOptions, AdyenSessionData } from "../types"
import { fromMinorUnits, toMinorUnits } from "../utils/amounts"

type AccountHolderContext = {
  account_holder?: { data?: Record<string, unknown> }
}

type InjectedDependencies = {
  logger: Logger
}

type AdyenPaymentResponse =
  Types.checkout.PaymentResponse | Types.checkout.PaymentDetailsResponse

const ResultCode = Types.checkout.PaymentResponse.ResultCodeEnum
// Cards and wallets return their result to the storefront's request. Methods
// that complete through a redirect or are confirmed asynchronously need the
// webhook to authorize the session.
// TODO: support them once webhook results can be stored on the session.
const SUPPORTED_PAYMENT_METHODS = ["scheme", "applepay", "googlepay"]
const CARD_ON_FILE =
  Types.checkout.PaymentRequest.RecurringProcessingModelEnum.CardOnFile
const UNSCHEDULED_CARD_ON_FILE =
  Types.checkout.PaymentRequest.RecurringProcessingModelEnum
    .UnscheduledCardOnFile
const EventCode = Types.notification.NotificationRequestItem.EventCodeEnum

// Identifies payments processed through Medusa to Adyen, for partner revenue
// sharing. Adyen matches on the exact name, so it must not change.
const APPLICATION_INFO: Types.checkout.ApplicationInfo = {
  externalPlatform: { name: "Medusa", integrator: "medusajs" },
}

const SESSION_ID_PREFIX = "payses_"
const MAX_IDEMPOTENCY_KEY_LENGTH = 64

const hash = (value: unknown) =>
  crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex")

// Adyen limits idempotency keys to 64 characters.
const toIdempotencyKey = (key?: string) => {
  if (!key || key.length <= MAX_IDEMPOTENCY_KEY_LENGTH) {
    return key
  }

  return hash(key)
}

class AdyenProviderService extends AbstractPaymentProvider<AdyenOptions> {
  static identifier = "adyen"

  protected readonly options_: AdyenOptions
  protected readonly logger_: Logger
  protected readonly checkout_: CheckoutAPI
  protected readonly hmacValidator_ = new hmacValidator()

  static validateOptions(options: Record<string, unknown>) {
    for (const key of ["apiKey", "merchantAccount"]) {
      if (!options[key]) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Required option \`${key}\` is missing in the Adyen payment provider`
        )
      }
    }

    if (options.environment === "LIVE" && !options.liveEndpointUrlPrefix) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Option `liveEndpointUrlPrefix` is required when `environment` is `LIVE` in the Adyen payment provider"
      )
    }
  }

  constructor(container: InjectedDependencies, options: AdyenOptions) {
    super(container, options)

    this.options_ = options
    this.logger_ = container.logger
    this.checkout_ = new CheckoutAPI(
      new Client({
        apiKey: options.apiKey,
        environment:
          options.environment === "LIVE"
            ? EnvironmentEnum.LIVE
            : EnvironmentEnum.TEST,
        liveEndpointUrlPrefix: options.liveEndpointUrlPrefix,
      })
    )
  }

  async initiatePayment({
    amount,
    currency_code,
    data,
    context,
  }: InitiatePaymentInput): Promise<InitiatePaymentOutput> {
    const sessionId = data?.session_id as string
    const currency = currency_code.toUpperCase()
    const value = toMinorUnits(amount, currency)
    const countryCode =
      (data?.country_code as string | undefined) ??
      context?.customer?.billing_address?.country_code ??
      undefined
    const shopperReference = this.getShopperReference(context)
    const offSessionPaymentMethod = this.getOffSessionPaymentMethod(
      data,
      shopperReference
    )

    // With a shopper reference, the response includes the shopper's saved
    // cards in `storedPaymentMethods`, which Drop-in renders.
    const paymentMethods = await this.request("initiatePayment", () =>
      this.checkout_.PaymentsApi.paymentMethods({
        merchantAccount: this.options_.merchantAccount,
        amount: { currency, value },
        countryCode: countryCode?.toUpperCase(),
        channel: Types.checkout.PaymentMethodsRequest.ChannelEnum.Web,
        shopperReference,
        allowedPaymentMethods: SUPPORTED_PAYMENT_METHODS,
      })
    )

    // Every provider-owned key is set explicitly, so data that the storefront
    // passed when initializing the session can't take their place.
    const sessionData: AdyenSessionData = {
      session_id: sessionId,
      amount: value,
      currency,
      capture: !!this.options_.capture,
      shopper_email: context?.customer?.email ?? null,
      shopper_reference: shopperReference ?? null,
      payment_methods: paymentMethods,
      psp_reference: null,
      capture_psp_reference: null,
      attempt: 0,
      off_session_payment_method: offSessionPaymentMethod ?? null,
      result_code: null,
      action: null,
    }

    return {
      id: sessionId,
      status: PaymentSessionStatus.PENDING,
      data: sessionData as unknown as Record<string, unknown>,
    }
  }

  async updatePayment({
    amount,
    currency_code,
    data,
  }: UpdatePaymentInput): Promise<UpdatePaymentOutput> {
    const session = data as unknown as AdyenSessionData
    const currency = currency_code.toUpperCase()
    const updated = {
      ...data,
      amount: toMinorUnits(amount, currency),
      currency,
    }

    // A new payment method after a refusal or an abandoned action starts a new
    // attempt. Carts can't be completed with a session in the `error` status.
    if (
      session.client?.payment_method &&
      session.result_code !== ResultCode.Authorised
    ) {
      return {
        status: PaymentSessionStatus.PENDING,
        data: {
          ...updated,
          attempt: (session.attempt ?? 0) + 1,
          psp_reference: null,
          result_code: null,
          action: null,
        },
      }
    }

    return { data: updated }
  }

  async authorizePayment({
    data,
  }: AuthorizePaymentInput): Promise<AuthorizePaymentOutput> {
    const session = data as unknown as AdyenSessionData
    const client: AdyenClientData = session.client ?? {}

    if (session.result_code === ResultCode.Authorised) {
      return { status: this.getAuthorizedStatus(session), data }
    }

    let response: AdyenPaymentResponse

    if (client.details) {
      const request: Types.checkout.PaymentDetailsRequest = {
        details: client.details,
      }
      const paymentData = (session.action as { paymentData?: string } | null)
        ?.paymentData
      if (paymentData) {
        request.paymentData = paymentData
      }

      response = await this.request("authorizePayment", () =>
        this.checkout_.PaymentsApi.paymentsDetails(request, {
          idempotencyKey: toIdempotencyKey(
            `${session.session_id}-${hash(client.details).slice(0, 16)}`
          ),
        })
      )
    } else if (client.payment_method) {
      const request = this.buildPaymentRequest(session, client)

      // Keyed on the submission, so retrying it is safe while a new submission
      // (for example, after a refusal) is a new payment, even with the same card.
      response = await this.request("authorizePayment", () =>
        this.checkout_.PaymentsApi.payments(request, {
          idempotencyKey: toIdempotencyKey(
            `${session.session_id}-${session.attempt ?? 0}`
          ),
        })
      )
    } else if (session.off_session_payment_method) {
      const request = this.buildOffSessionPaymentRequest(session)

      response = await this.request("authorizePayment", () =>
        this.checkout_.PaymentsApi.payments(request, {
          idempotencyKey: toIdempotencyKey(
            `${session.session_id}-${session.attempt ?? 0}`
          ),
        })
      )
    } else {
      // Nothing was submitted, for example when a webhook authorizes the session.
      return { status: this.getStatus(session), data }
    }

    if (response.resultCode !== ResultCode.Authorised) {
      this.logger_.info(
        `Adyen payment for session ${session.session_id} returned ${
          response.resultCode
        }${response.refusalReason ? `: ${response.refusalReason}` : ""}`
      )
    }

    const action =
      "action" in response && response.action ? response.action : null

    const isAuthorised = response.resultCode === ResultCode.Authorised
    const updated: AdyenSessionData = {
      ...session,
      psp_reference: response.pspReference ?? session.psp_reference,
      result_code: response.resultCode ?? null,
      action,
      // Kept until authorization so the storefront can render Drop-in again,
      // but not copied into the payment's data.
      payment_methods: isAuthorised ? null : session.payment_methods,
      // Don't retain the shopper's payment details once they're submitted.
      client: {
        ...client,
        payment_method: null,
        browser_info: null,
        details: null,
      },
    }

    return {
      status: this.getStatus(updated),
      data: updated as unknown as Record<string, unknown>,
    }
  }

  async getPaymentStatus({
    data,
  }: GetPaymentStatusInput): Promise<GetPaymentStatusOutput> {
    return {
      status: this.getStatus(data as unknown as AdyenSessionData),
      data,
    }
  }

  async retrievePayment({
    data,
  }: RetrievePaymentInput): Promise<RetrievePaymentOutput> {
    // Adyen has no API to retrieve a payment, so the stored data is the latest known state.
    return { data }
  }

  async capturePayment({
    data,
    context,
  }: CapturePaymentInput): Promise<CapturePaymentOutput> {
    const session = data as unknown as AdyenSessionData

    // Medusa doesn't pass the capture amount to providers, so the first capture
    // is always for the full amount and later partial captures only record it.
    // TODO: capture the requested amount once Medusa passes it.
    if (session.capture || session.capture_psp_reference) {
      return { data }
    }

    const pspReference = this.getPspReference(session)

    // Adyen confirms the capture asynchronously with a CAPTURE webhook.
    // TODO: reflect captures that later fail (CAPTURE_FAILED) in Medusa.
    const response = await this.request("capturePayment", () =>
      this.checkout_.ModificationsApi.captureAuthorisedPayment(
        pspReference,
        {
          merchantAccount: this.options_.merchantAccount,
          amount: { currency: session.currency, value: session.amount },
          reference: session.session_id,
          applicationInfo: APPLICATION_INFO,
        },
        { idempotencyKey: toIdempotencyKey(context?.idempotency_key) }
      )
    )

    return {
      data: { ...data, capture_psp_reference: response.pspReference },
    }
  }

  async refundPayment({
    amount,
    data,
    context,
  }: RefundPaymentInput): Promise<RefundPaymentOutput> {
    const session = data as unknown as AdyenSessionData
    const pspReference = this.getPspReference(session)

    // Adyen confirms the refund asynchronously with a REFUND webhook.
    // TODO: reflect refunds that later fail (REFUND_FAILED) in Medusa.
    await this.request("refundPayment", () =>
      this.checkout_.ModificationsApi.refundCapturedPayment(
        pspReference,
        {
          merchantAccount: this.options_.merchantAccount,
          amount: {
            currency: session.currency,
            value: toMinorUnits(amount, session.currency),
          },
          reference: session.session_id,
          applicationInfo: APPLICATION_INFO,
        },
        { idempotencyKey: toIdempotencyKey(context?.idempotency_key) }
      )
    )

    return { data }
  }

  async cancelPayment({
    data,
    context,
  }: CancelPaymentInput): Promise<CancelPaymentOutput> {
    const session = data as unknown as AdyenSessionData

    if (
      !session.psp_reference ||
      session.result_code !== ResultCode.Authorised
    ) {
      return { data }
    }

    const request = {
      merchantAccount: this.options_.merchantAccount,
      reference: session.session_id,
      applicationInfo: APPLICATION_INFO,
    }
    const options = {
      idempotencyKey: toIdempotencyKey(context?.idempotency_key),
    }

    // Auto-captured payments can't be canceled, only reversed (refunded).
    await this.request("cancelPayment", () =>
      session.capture
        ? this.checkout_.ModificationsApi.refundOrCancelPayment(
            session.psp_reference!,
            request,
            options
          )
        : this.checkout_.ModificationsApi.cancelAuthorisedPaymentByPspReference(
            session.psp_reference!,
            request,
            options
          )
    )

    return { data }
  }

  async deletePayment({
    data,
    context,
  }: DeletePaymentInput): Promise<DeletePaymentOutput> {
    const session = data as unknown as AdyenSessionData

    // Release an authorization that will never be used. Auto-captured payments
    // aren't refunded here, as deleting a session shouldn't move money.
    if (!session?.capture) {
      return await this.cancelPayment({ data, context })
    }

    return { data }
  }

  // Adyen has no shopper object: the `shopperReference` sent with payments is
  // the account holder's ID.
  async createAccountHolder({
    context,
  }: CreateAccountHolderInput): Promise<CreateAccountHolderOutput> {
    const { account_holder, customer } = context

    if (account_holder?.data?.id) {
      return { id: account_holder.data.id as string }
    }

    return { id: customer.id, data: { id: customer.id } }
  }

  async retrieveAccountHolder({
    id,
  }: RetrieveAccountHolderInput): Promise<RetrieveAccountHolderOutput> {
    return { id, data: { id } }
  }

  async updateAccountHolder(
    _: UpdateAccountHolderInput
  ): Promise<UpdateAccountHolderOutput> {
    return {}
  }

  // Deleting the account holder also deletes the shopper's saved cards, as
  // nothing could use them afterwards.
  async deleteAccountHolder({
    context,
  }: DeleteAccountHolderInput): Promise<DeleteAccountHolderOutput> {
    const shopperReference = this.getShopperReference(context)
    if (!shopperReference) {
      return {}
    }

    // The account holder is already deleted in Medusa, so every card is
    // attempted rather than stopping at the first failure.
    const paymentMethods = await this.listStoredPaymentMethods(shopperReference)
    const results = await Promise.allSettled(
      paymentMethods.map((paymentMethod) =>
        this.deleteStoredPaymentMethod(paymentMethod.id!, shopperReference)
      )
    )

    const failed = results.filter((result) => result.status === "rejected")
    if (failed.length) {
      this.logger_.error(
        `Adyen failed to delete ${failed.length} of ${paymentMethods.length} saved cards of shopper ${shopperReference}`
      )
    }

    return {}
  }

  async listPaymentMethods({
    context,
  }: ListPaymentMethodsInput): Promise<ListPaymentMethodsOutput> {
    const shopperReference = this.getShopperReference(context)
    if (!shopperReference) {
      return []
    }

    const paymentMethods = await this.listStoredPaymentMethods(shopperReference)

    return paymentMethods.map((paymentMethod) => ({
      id: paymentMethod.id!,
      data: paymentMethod as unknown as Record<string, unknown>,
    }))
  }

  // Stores the card that Drop-in collected, passed as `data.payment_method`,
  // without making a payment. With `data.usage` set to `off_session`, the card
  // can also be charged without the shopper present.
  async savePaymentMethod({
    data,
    context,
  }: SavePaymentMethodInput): Promise<SavePaymentMethodOutput> {
    const shopperReference = this.requireShopperReference(context)

    const paymentMethod = await this.request("savePaymentMethod", () =>
      this.checkout_.RecurringApi.storedPaymentMethods(
        {
          merchantAccount: this.options_.merchantAccount,
          shopperReference,
          paymentMethod:
            data?.payment_method as Types.checkout.PaymentMethodToStore,
          recurringProcessingModel:
            data?.usage === "off_session"
              ? Types.checkout.StoredPaymentMethodRequest
                  .RecurringProcessingModelEnum.UnscheduledCardOnFile
              : Types.checkout.StoredPaymentMethodRequest
                  .RecurringProcessingModelEnum.CardOnFile,
          shopperEmail: context?.customer?.email,
        },
        { idempotencyKey: toIdempotencyKey(context?.idempotency_key) }
      )
    )

    return {
      id: paymentMethod.id!,
      data: paymentMethod as unknown as Record<string, unknown>,
    }
  }

  async deletePaymentMethod({
    data,
    context,
  }: DeletePaymentMethodInput): Promise<DeletePaymentMethodOutput> {
    await this.deleteStoredPaymentMethod(
      data.id,
      this.requireShopperReference(context)
    )

    return {}
  }

  protected async listStoredPaymentMethods(shopperReference: string) {
    const response = await this.request("listPaymentMethods", () =>
      this.checkout_.RecurringApi.getTokensForStoredPaymentDetails(
        shopperReference,
        this.options_.merchantAccount
      )
    )

    return response.storedPaymentMethods ?? []
  }

  protected async deleteStoredPaymentMethod(
    id: string,
    shopperReference: string
  ) {
    await this.request("deletePaymentMethod", () =>
      this.checkout_.RecurringApi.deleteTokenForStoredPaymentDetails(
        id,
        shopperReference,
        this.options_.merchantAccount
      )
    )
  }

  async getWebhookActionAndData({
    data,
  }: ProviderWebhookPayload["payload"]): Promise<WebhookActionResult> {
    const notSupported = { action: PaymentActions.NOT_SUPPORTED }
    const items = (
      (data?.notificationItems ?? []) as {
        NotificationRequestItem?: Types.notification.NotificationRequestItem
      }[]
    )
      .map((item) => item.NotificationRequestItem)
      .filter((item): item is Types.notification.NotificationRequestItem =>
        this.isValidNotification(item)
      )

    // Adyen sends a single item per JSON webhook, and the webhook route handles
    // one action per request.
    if (items.length > 1) {
      this.logger_.warn(
        `Adyen webhook contained ${items.length} notifications, only the first is processed`
      )
    }

    const item = items[0]
    if (!item) {
      return notSupported
    }

    const succeeded = item.success === "true"
    const { value = 0, currency } = item.amount ?? {}
    const result = {
      session_id: item.merchantReference,
      amount: currency ? fromMinorUnits(value, currency) : 0,
    }

    switch (item.eventCode) {
      case EventCode.Authorisation:
        if (!succeeded) {
          return { action: PaymentActions.FAILED, data: result }
        }

        return {
          action: this.options_.capture
            ? PaymentActions.SUCCESSFUL
            : PaymentActions.AUTHORIZED,
          data: result,
        }
      case EventCode.Cancellation:
        return succeeded
          ? { action: PaymentActions.CANCELED, data: result }
          : notSupported
      case EventCode.Capture:
      case EventCode.Refund:
        if (!succeeded) {
          // TODO: reflect failed captures and refunds in Medusa.
          this.logger_.error(
            `Adyen ${item.eventCode} for session ${item.merchantReference} failed: ${item.reason}`
          )
        }
        // Captures and refunds are already recorded when Medusa requests them.
        // TODO: sync captures and refunds made outside of Medusa, such as in the Customer Area.
        return notSupported
      case EventCode.CaptureFailed:
      case EventCode.RefundFailed:
        // TODO: reflect failed captures and refunds in Medusa.
        this.logger_.error(
          `Adyen ${item.eventCode} for session ${item.merchantReference}: ${item.reason}`
        )
        return notSupported
      default:
        return notSupported
    }
  }

  protected isValidNotification(
    item?: Types.notification.NotificationRequestItem
  ): boolean {
    if (!item) {
      return false
    }

    if (!this.options_.hmacKey) {
      this.logger_.warn(
        "Adyen webhook rejected because the `hmacKey` option isn't set"
      )
      return false
    }

    let isValid = false
    try {
      isValid = this.hmacValidator_.validateHMAC(item, this.options_.hmacKey)
    } catch {}

    if (!isValid) {
      this.logger_.warn(
        `Adyen webhook for ${item.pspReference} rejected because of an invalid HMAC signature`
      )
      return false
    }

    // A webhook endpoint can be shared by merchant accounts and integrations,
    // so only notifications for payment sessions of this account are handled.
    return (
      item.merchantAccountCode === this.options_.merchantAccount &&
      !!item.merchantReference?.startsWith(SESSION_ID_PREFIX)
    )
  }

  protected buildPaymentRequest(
    session: AdyenSessionData,
    client: AdyenClientData
  ): Types.checkout.PaymentRequest {
    const paymentMethodType = (client.payment_method as { type?: string })?.type
    if (
      paymentMethodType &&
      !SUPPORTED_PAYMENT_METHODS.includes(paymentMethodType)
    ) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Adyen payment method ${paymentMethodType} isn't supported`
      )
    }

    const returnUrl = client.return_url ?? this.options_.returnUrl
    if (!returnUrl) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Adyen requires a return URL. Set the `returnUrl` option or pass `return_url` in the payment session's client data."
      )
    }

    const shopperReference = session.shopper_reference ?? undefined
    const isStoredPaymentMethod = !!(
      client.payment_method as { storedPaymentMethodId?: string }
    ).storedPaymentMethodId
    // Saved cards are tied to the shopper reference set by the provider, so a
    // shopper can't pay with or save to another shopper's cards.
    const storePaymentMethod =
      !!shopperReference && !!client.store_payment_method

    return {
      merchantAccount: this.options_.merchantAccount,
      amount: { currency: session.currency, value: session.amount },
      reference: session.session_id,
      shopperReference,
      ...(storePaymentMethod ? { storePaymentMethod: true } : {}),
      ...(storePaymentMethod || isStoredPaymentMethod
        ? { recurringProcessingModel: CARD_ON_FILE }
        : {}),
      paymentMethod: client.payment_method!,
      browserInfo: client.browser_info ?? undefined,
      origin: client.origin ?? undefined,
      returnUrl,
      shopperEmail: session.shopper_email ?? undefined,
      channel: Types.checkout.PaymentRequest.ChannelEnum.Web,
      shopperInteraction:
        Types.checkout.PaymentRequest.ShopperInteractionEnum.Ecommerce,
      authenticationData: {
        threeDSRequestData: {
          nativeThreeDS:
            Types.checkout.ThreeDSRequestData.NativeThreeDSEnum.Preferred,
        },
      },
      // Both override the merchant account's capture delay, which Medusa can't
      // rely on: it records the payment as captured when `capture` is enabled.
      ...(session.capture
        ? { captureDelayHours: 0 }
        : { additionalData: { manualCapture: "true" } }),
      applicationInfo: APPLICATION_INFO,
    }
  }

  // Only allowed with a shopper reference, which Adyen checks the card was saved with.
  protected getOffSessionPaymentMethod(
    data: Record<string, unknown> | undefined,
    shopperReference: string | undefined
  ): string | undefined {
    if (
      data?.off_session !== true ||
      !shopperReference ||
      typeof data.payment_method !== "string"
    ) {
      return undefined
    }

    return data.payment_method
  }

  protected buildOffSessionPaymentRequest(
    session: AdyenSessionData
  ): Types.checkout.PaymentRequest {
    // A return URL isn't needed, as the shopper isn't redirected.
    const request: Omit<Types.checkout.PaymentRequest, "returnUrl"> = {
      merchantAccount: this.options_.merchantAccount,
      amount: { currency: session.currency, value: session.amount },
      reference: session.session_id,
      shopperReference: session.shopper_reference ?? undefined,
      paymentMethod: {
        type: Types.checkout.CardDetails.TypeEnum.Scheme,
        storedPaymentMethodId: session.off_session_payment_method!,
      },
      shopperEmail: session.shopper_email ?? undefined,
      shopperInteraction:
        Types.checkout.PaymentRequest.ShopperInteractionEnum.ContAuth,
      recurringProcessingModel: UNSCHEDULED_CARD_ON_FILE,
      ...(session.capture
        ? { captureDelayHours: 0 }
        : { additionalData: { manualCapture: "true" } }),
      applicationInfo: APPLICATION_INFO,
    }

    return request as Types.checkout.PaymentRequest
  }

  protected getStatus(session: AdyenSessionData): PaymentSessionStatus {
    switch (session.result_code) {
      case ResultCode.Authorised:
        return this.getAuthorizedStatus(session)
      case ResultCode.RedirectShopper:
      case ResultCode.ChallengeShopper:
      case ResultCode.IdentifyShopper:
        return PaymentSessionStatus.REQUIRES_MORE
      case ResultCode.Cancelled:
        return PaymentSessionStatus.CANCELED
      case ResultCode.Refused:
      case ResultCode.Error:
      case ResultCode.PartiallyAuthorised:
        return PaymentSessionStatus.ERROR
      default:
        return PaymentSessionStatus.PENDING
    }
  }

  protected getAuthorizedStatus(session: AdyenSessionData) {
    return session.capture
      ? PaymentSessionStatus.CAPTURED
      : PaymentSessionStatus.AUTHORIZED
  }

  protected getShopperReference(
    context?: AccountHolderContext
  ): string | undefined {
    return context?.account_holder?.data?.id as string | undefined
  }

  protected requireShopperReference(context?: AccountHolderContext): string {
    const shopperReference = this.getShopperReference(context)
    if (!shopperReference) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Adyen saved payment methods require an account holder"
      )
    }

    return shopperReference
  }

  protected getPspReference(session: AdyenSessionData): string {
    if (!session.psp_reference) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Adyen payment for session ${session.session_id} has no PSP reference`
      )
    }

    return session.psp_reference
  }

  // Adyen's error details are logged, not returned, as provider errors can
  // reach the storefront.
  protected async request<T>(
    operation: string,
    fn: () => Promise<T>
  ): Promise<T> {
    try {
      return await fn()
    } catch (error) {
      const { statusCode, errorCode, responseBody, message } = error as {
        statusCode?: number
        errorCode?: string
        responseBody?: string
        message?: string
      }

      this.logger_.error(
        `Adyen ${operation} failed: ${[
          statusCode,
          errorCode,
          message,
          responseBody,
        ]
          .filter(Boolean)
          .join(" | ")}`
      )

      // Validation errors (for example, invalid payment details) are the
      // shopper's to fix, while authentication and server errors aren't.
      const isValidationError =
        !!statusCode &&
        statusCode >= 400 &&
        statusCode < 500 &&
        ![401, 403].includes(statusCode)

      throw new MedusaError(
        isValidationError
          ? MedusaError.Types.INVALID_DATA
          : MedusaError.Types.UNEXPECTED_STATE,
        `An error occurred in ${operation} with Adyen`
      )
    }
  }
}

export default AdyenProviderService
