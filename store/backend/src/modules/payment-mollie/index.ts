import {
  AbstractPaymentProvider,
  PaymentProviderError,
  PaymentProviderSessionResponse,
  MedusaContainer,
} from "@medusajs/framework/utils"
import {
  CreatePaymentProviderSession,
  UpdatePaymentProviderSession,
  ProviderWebhookPayload,
  WebhookActionResult,
  PaymentSessionStatus,
} from "@medusajs/framework/types"
import MollieClient, { PaymentStatus } from "@mollie/api-client"

type MollieOptions = {
  apiKey: string
  redirectBaseUrl: string
  webhookBaseUrl: string
  profileId?: string
}

type MolliePaymentData = {
  id: string
  status: string
  checkoutUrl?: string
  method?: string
}

export class MolliePaymentProvider extends AbstractPaymentProvider<MollieOptions> {
  static identifier = "mollie"

  private mollie: ReturnType<typeof MollieClient>
  private redirectBaseUrl: string
  private webhookBaseUrl: string

  constructor(container: MedusaContainer, options: MollieOptions) {
    super(container, options)
    this.mollie = MollieClient({ apiKey: options.apiKey })
    this.redirectBaseUrl = options.redirectBaseUrl
    this.webhookBaseUrl = options.webhookBaseUrl
  }

  async initiatePayment(
    data: CreatePaymentProviderSession
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse> {
    try {
      const { amount, currency_code, context } = data
      const orderId = context?.resource_id || `order_${Date.now()}`

      const payment = await this.mollie.payments.create({
        amount: {
          value: (amount / 100).toFixed(2),
          currency: currency_code.toUpperCase(),
        },
        description: `MemoryLane Gifts — Order ${orderId}`,
        redirectUrl: `${this.redirectBaseUrl}/order/confirm?orderId=${orderId}`,
        webhookUrl: `${this.webhookBaseUrl}/webhooks/mollie`,
        metadata: {
          orderId,
          cartId: context?.cart_id,
        },
      })

      return {
        id: payment.id,
        data: {
          id: payment.id,
          status: payment.status,
          checkoutUrl: payment._links.checkout?.href,
          method: payment.method,
        } as MolliePaymentData,
      }
    } catch (err) {
      return {
        error: "Failed to create Mollie payment",
        code: "mollie_initiate_error",
        detail: err instanceof Error ? err.message : String(err),
      }
    }
  }

  async authorizePayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<PaymentProviderError | { status: PaymentSessionStatus; data: Record<string, unknown> }> {
    try {
      const data = paymentSessionData as MolliePaymentData
      const payment = await this.mollie.payments.get(data.id)

      const statusMap: Record<string, PaymentSessionStatus> = {
        [PaymentStatus.paid]:       "authorized",
        [PaymentStatus.authorized]: "authorized",
        [PaymentStatus.pending]:    "pending",
        [PaymentStatus.open]:       "pending",
        [PaymentStatus.canceled]:   "canceled",
        [PaymentStatus.expired]:    "canceled",
        [PaymentStatus.failed]:     "error",
      }

      return {
        status: statusMap[payment.status] ?? "pending",
        data: { ...data, status: payment.status },
      }
    } catch (err) {
      return {
        error: "Failed to authorize Mollie payment",
        code: "mollie_authorize_error",
        detail: err instanceof Error ? err.message : String(err),
      }
    }
  }

  async capturePayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<PaymentProviderError | Record<string, unknown>> {
    // Mollie auto-captures on payment.paid webhook; for manual capture methods return existing data
    return paymentSessionData
  }

  async refundPayment(
    paymentSessionData: Record<string, unknown>,
    refundAmount: number
  ): Promise<PaymentProviderError | Record<string, unknown>> {
    try {
      const data = paymentSessionData as MolliePaymentData
      const payment = await this.mollie.payments.get(data.id)
      const currency = (payment.amount.currency as string)

      await this.mollie.paymentRefunds.create({
        paymentId: data.id,
        amount: {
          value: (refundAmount / 100).toFixed(2),
          currency,
        },
      })

      return { ...data, refunded: true }
    } catch (err) {
      return {
        error: "Failed to refund Mollie payment",
        code: "mollie_refund_error",
        detail: err instanceof Error ? err.message : String(err),
      }
    }
  }

  async cancelPayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<PaymentProviderError | Record<string, unknown>> {
    try {
      const data = paymentSessionData as MolliePaymentData
      await this.mollie.payments.cancel(data.id)
      return { ...data, status: "canceled" }
    } catch (err) {
      return {
        error: "Failed to cancel Mollie payment",
        code: "mollie_cancel_error",
        detail: err instanceof Error ? err.message : String(err),
      }
    }
  }

  async retrievePayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<PaymentProviderError | Record<string, unknown>> {
    try {
      const data = paymentSessionData as MolliePaymentData
      const payment = await this.mollie.payments.get(data.id)
      return { ...data, status: payment.status }
    } catch (err) {
      return {
        error: "Failed to retrieve Mollie payment",
        code: "mollie_retrieve_error",
        detail: err instanceof Error ? err.message : String(err),
      }
    }
  }

  async updatePayment(
    context: UpdatePaymentProviderSession
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse> {
    // For amount changes, cancel and re-initiate
    await this.cancelPayment(context.data)
    return this.initiatePayment(context)
  }

  async getPaymentStatus(
    paymentSessionData: Record<string, unknown>
  ): Promise<PaymentSessionStatus> {
    try {
      const data = paymentSessionData as MolliePaymentData
      const payment = await this.mollie.payments.get(data.id)
      const statusMap: Record<string, PaymentSessionStatus> = {
        [PaymentStatus.paid]:       "authorized",
        [PaymentStatus.authorized]: "authorized",
        [PaymentStatus.pending]:    "pending",
        [PaymentStatus.open]:       "pending",
        [PaymentStatus.canceled]:   "canceled",
        [PaymentStatus.expired]:    "canceled",
        [PaymentStatus.failed]:     "error",
      }
      return statusMap[payment.status] ?? "pending"
    } catch {
      return "error"
    }
  }

  async getWebhookActionAndData(
    webhookData: ProviderWebhookPayload["payload"]
  ): Promise<WebhookActionResult> {
    try {
      const { id: paymentId } = webhookData.data as { id: string }
      const payment = await this.mollie.payments.get(paymentId)

      if (payment.status === PaymentStatus.paid || payment.status === PaymentStatus.authorized) {
        return {
          action: "authorized",
          data: {
            session_id: payment.metadata?.cartId as string,
            amount: Math.round(parseFloat(payment.amount.value) * 100),
          },
        }
      }

      if (payment.status === PaymentStatus.failed || payment.status === PaymentStatus.expired) {
        return {
          action: "failed",
          data: { session_id: payment.metadata?.cartId as string, amount: 0 },
        }
      }

      return { action: "not_supported" }
    } catch {
      return { action: "not_supported" }
    }
  }
}

export default MolliePaymentProvider
