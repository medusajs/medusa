import PayPal from "@paypal/checkout-server-sdk"
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
  PaypalOptions,
  PaypalOrder,
  PaypalOrderStatus,
  PurchaseUnits,
} from "../types"
import { humanizeAmount } from "medusa-core-utils";
import { roundToTwo } from "./utils/utils";

class PayPalProviderService extends AbstractPaymentProcessor {
  static identifier = "paypal"

  protected readonly options_: PaypalOptions
  protected paypal_: PayPal

  constructor(_, options) {
    // @ts-ignore
    super(_, options)

    this.options_ = options


  }

  protected init(): void {
    let environment
    if (this.options_.sandbox) {
      environment = new PayPal.core.SandboxEnvironment(
        this.options_.client_id,
        this.options_.client_secret
      )
    } else {
      environment = new PayPal.core.LiveEnvironment(
        this.options_.client_id,
        this.options_.client_secret
      )
    }

    this.paypal_ = new PayPal.core.PayPalHttpClient(environment)
  }

  async getPaymentStatus(
    paymentSessionData: Record<string, unknown>
  ): Promise<PaymentSessionStatus> {
    const order = await this.retrievePayment(paymentSessionData) as PaypalOrder

    switch (order.status) {
      case PaypalOrderStatus.CREATED:
        return PaymentSessionStatus.PENDING
      case PaypalOrderStatus.SAVED:
      case PaypalOrderStatus.APPROVED:
      case PaypalOrderStatus.PAYER_ACTION_REQUIRED:
        return PaymentSessionStatus.REQUIRES_MORE
      case PaypalOrderStatus.VOIDED:
        return PaymentSessionStatus.CANCELED
      case PaypalOrderStatus.COMPLETED:
        return PaymentSessionStatus.AUTHORIZED
      default:
        return PaymentSessionStatus.PENDING
    }
  }

  async initiatePayment(
    context: PaymentProcessorContext
  ): Promise<PaymentProcessorError | PaymentProcessorSessionResponse> {
    const {
      currency_code,
      amount,
      resource_id,
    } = context

    let session_data

    try {
      const request = new PayPal.orders.OrdersCreateRequest()
      request.requestBody({
        intent: "AUTHORIZE",
        application_context: {
          shipping_preference: "NO_SHIPPING",
        },
        purchase_units: [
          {
            custom_id: resource_id,
            amount: {
              currency_code: currency_code.toUpperCase(),
              value: roundToTwo(
                humanizeAmount(amount, currency_code),
                currency_code
              ),
            },
          },
        ],
      })

      session_data = await this.paypal_.execute(request)
    } catch (e) {
      return this.buildError("An error occurred in InitiatePayment", e)
    }

    return {
      session_data
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
    const stat = await this.getPaymentStatus(paymentSessionData)

    try {
      return { data: paymentSessionData, status: stat }
    } catch (error) {
      return this.buildError("An error occurred in authorizePayment", error)
    }
  }

  async cancelPayment(
    paymentSessionData: Record<string, unknown>,
  ): Promise<
    PaymentProcessorError | PaymentProcessorSessionResponse["session_data"]
  > {
    const order = await this.retrievePayment(paymentSessionData) as PaypalOrder

    const isAlreadyCanceled = order.status === PaypalOrderStatus.VOIDED
    const isCanceledAndFullyRefund =
      order.status === PaypalOrderStatus.COMPLETED && !!order.invoice_id

    if (isAlreadyCanceled || isCanceledAndFullyRefund) {
      return order
    }

    try {
      const { purchase_units } = paymentSessionData as { purchase_units: PurchaseUnits }
      const isAlreadyCaptured = purchase_units.some(pu => pu.payments.captures?.length)

      if (isAlreadyCaptured) {
        const payments = purchase_units[0].payments

        const payId = payments.captures[0].id
        const request = new PayPal.payments.CapturesRefundRequest(payId)
        await this.paypal_.execute(request)
      } else {
        const id = purchase_units[0].payments.authorizations[0].id
        const request = new PayPal.payments.AuthorizationsVoidRequest(id)
        await this.paypal_.execute(request)
      }

      return await this.retrievePayment(paymentSessionData) as unknown as PaymentProcessorSessionResponse["session_data"]
    } catch (error) {
      return this.buildError("An error occurred in cancelPayment", error)
    }
  }

  async capturePayment(
    context: PaymentProcessorContext
  ): Promise<
    PaymentProcessorError | PaymentProcessorSessionResponse["session_data"]
  > {
    const paymentSessionData = context.paymentSessionData
    const { purchase_units } = paymentSessionData as { purchase_units: PurchaseUnits}

    const id = purchase_units[0].payments.authorizations[0].id

    try {
      const request = new PayPal.payments.AuthorizationsCaptureRequest(id)
      await this.paypal_.execute(request)
      return this.retrievePayment(paymentSessionData)
    } catch (error) {
      return this.buildError("An error occurred in deletePayment", error)
    }
  }

  /**
   * Paypal does not provide such feature
   * @param paymentSessionData
   */
  async deletePayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<
    PaymentProcessorError | PaymentProcessorSessionResponse["session_data"]
  > {
    return paymentSessionData
  }

  async refundPayment(
    paymentSessionData: Record<string, unknown>,
    refundAmount: number
  ): Promise<
    PaymentProcessorError | PaymentProcessorSessionResponse["session_data"]
  > {
    const { purchase_units } = paymentSessionData as { purchase_units: PurchaseUnits }

    try {
      const purchaseUnit = purchase_units[0]
      const payments = purchaseUnit.payments
      const isAlreadyCaptured = purchase_units.some(pu => pu.payments.captures?.length)

      if (!isAlreadyCaptured) {
        throw new Error("The order has not yet been captured. Unable to refund")
      }

      const paymentId = payments.captures[0].id
      const currencyCode = purchaseUnit.amount.currency_code
      const request = new PayPal.payments.CapturesRefundRequest(paymentId)

      request.requestBody({
        amount: {
          currency_code:currencyCode,
          value: roundToTwo(
            humanizeAmount(refundAmount, currencyCode),
            currencyCode
          ),
        },
      })

      await this.paypal_.execute(request)

      return this.retrievePayment(paymentSessionData)
    } catch (error) {
      return this.buildError("An error occurred in refundPayment", e)
    }
  }

  async retrievePayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<
    PaymentProcessorError | PaymentProcessorSessionResponse["session_data"]
  > {
    try {
      const id = paymentSessionData.id as string
      const request = new PayPal.orders.OrdersGetRequest(id)
      const res = await this.paypal_.execute(request)
      return res.result
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
    e: PaymentProcessorError | Error
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

export default PayPalProviderService
