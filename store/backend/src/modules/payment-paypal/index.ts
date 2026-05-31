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
import axios from "axios"

type PayPalOptions = {
  clientId: string
  clientSecret: string
  sandbox?: boolean
  webhookId: string
}

type PayPalPaymentData = {
  orderId: string
  status: string
  captureId?: string
  approvalUrl?: string
}

export class PayPalPaymentProvider extends AbstractPaymentProvider<PayPalOptions> {
  static identifier = "paypal"

  private clientId: string
  private clientSecret: string
  private baseUrl: string
  private webhookId: string

  constructor(container: MedusaContainer, options: PayPalOptions) {
    super(container, options)
    this.clientId = options.clientId
    this.clientSecret = options.clientSecret
    this.baseUrl = options.sandbox
      ? "https://api-m.sandbox.paypal.com"
      : "https://api-m.paypal.com"
    this.webhookId = options.webhookId
  }

  private async getAccessToken(): Promise<string> {
    const credentials = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString("base64")
    const { data } = await axios.post(
      `${this.baseUrl}/v1/oauth2/token`,
      "grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    )
    return data.access_token
  }

  private async paypalRequest(method: string, path: string, body?: unknown) {
    const token = await this.getAccessToken()
    const { data } = await axios({
      method,
      url: `${this.baseUrl}${path}`,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      data: body,
    })
    return data
  }

  async initiatePayment(
    data: CreatePaymentProviderSession
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse> {
    try {
      const { amount, currency_code, context } = data

      const order = await this.paypalRequest("POST", "/v2/checkout/orders", {
        intent: "CAPTURE",
        purchase_units: [
          {
            reference_id: context?.resource_id || `order_${Date.now()}`,
            description: "MemoryLane Gifts — Personalised Gift Order",
            amount: {
              currency_code: currency_code.toUpperCase(),
              value: (amount / 100).toFixed(2),
            },
          },
        ],
        payment_source: {
          paypal: {
            experience_context: {
              brand_name: "MemoryLane Gifts",
              locale: "en-GB",
              user_action: "PAY_NOW",
              return_url: `${process.env.STORE_URL}/order/confirm`,
              cancel_url: `${process.env.STORE_URL}/cart`,
            },
          },
        },
      })

      const approvalUrl = order.links?.find((l: any) => l.rel === "payer-action")?.href

      return {
        id: order.id,
        data: {
          orderId: order.id,
          status: order.status,
          approvalUrl,
        } as PayPalPaymentData,
      }
    } catch (err) {
      return {
        error: "Failed to create PayPal order",
        code: "paypal_initiate_error",
        detail: err instanceof Error ? err.message : String(err),
      }
    }
  }

  async authorizePayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<PaymentProviderError | { status: PaymentSessionStatus; data: Record<string, unknown> }> {
    try {
      const data = paymentSessionData as PayPalPaymentData
      const order = await this.paypalRequest("GET", `/v2/checkout/orders/${data.orderId}`)

      const statusMap: Record<string, PaymentSessionStatus> = {
        COMPLETED:         "authorized",
        APPROVED:          "authorized",
        SAVED:             "pending",
        CREATED:           "pending",
        PAYER_ACTION_REQUIRED: "pending",
        VOIDED:            "canceled",
      }

      return {
        status: statusMap[order.status] ?? "pending",
        data: { ...data, status: order.status },
      }
    } catch (err) {
      return {
        error: "Failed to authorize PayPal payment",
        code: "paypal_authorize_error",
        detail: err instanceof Error ? err.message : String(err),
      }
    }
  }

  async capturePayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<PaymentProviderError | Record<string, unknown>> {
    try {
      const data = paymentSessionData as PayPalPaymentData
      const captured = await this.paypalRequest(
        "POST",
        `/v2/checkout/orders/${data.orderId}/capture`,
        {}
      )
      const captureId = captured.purchase_units?.[0]?.payments?.captures?.[0]?.id
      return { ...data, status: "COMPLETED", captureId }
    } catch (err) {
      return {
        error: "Failed to capture PayPal payment",
        code: "paypal_capture_error",
        detail: err instanceof Error ? err.message : String(err),
      }
    }
  }

  async refundPayment(
    paymentSessionData: Record<string, unknown>,
    refundAmount: number
  ): Promise<PaymentProviderError | Record<string, unknown>> {
    try {
      const data = paymentSessionData as PayPalPaymentData
      if (!data.captureId) throw new Error("No capture ID to refund")

      await this.paypalRequest("POST", `/v2/payments/captures/${data.captureId}/refund`, {
        amount: {
          value: (refundAmount / 100).toFixed(2),
          currency_code: "USD",
        },
      })

      return { ...data, refunded: true }
    } catch (err) {
      return {
        error: "Failed to refund PayPal payment",
        code: "paypal_refund_error",
        detail: err instanceof Error ? err.message : String(err),
      }
    }
  }

  async cancelPayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<PaymentProviderError | Record<string, unknown>> {
    // PayPal orders cannot be voided after approval — return as-is
    return { ...(paymentSessionData as object), status: "VOIDED" }
  }

  async retrievePayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<PaymentProviderError | Record<string, unknown>> {
    try {
      const data = paymentSessionData as PayPalPaymentData
      const order = await this.paypalRequest("GET", `/v2/checkout/orders/${data.orderId}`)
      return { ...data, status: order.status }
    } catch (err) {
      return {
        error: "Failed to retrieve PayPal order",
        code: "paypal_retrieve_error",
        detail: err instanceof Error ? err.message : String(err),
      }
    }
  }

  async updatePayment(
    context: UpdatePaymentProviderSession
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse> {
    await this.cancelPayment(context.data)
    return this.initiatePayment(context)
  }

  async getPaymentStatus(
    paymentSessionData: Record<string, unknown>
  ): Promise<PaymentSessionStatus> {
    try {
      const data = paymentSessionData as PayPalPaymentData
      const order = await this.paypalRequest("GET", `/v2/checkout/orders/${data.orderId}`)
      const map: Record<string, PaymentSessionStatus> = {
        COMPLETED: "authorized",
        APPROVED:  "authorized",
        CREATED:   "pending",
        SAVED:     "pending",
        VOIDED:    "canceled",
      }
      return map[order.status] ?? "pending"
    } catch {
      return "error"
    }
  }

  async getWebhookActionAndData(
    webhookData: ProviderWebhookPayload["payload"]
  ): Promise<WebhookActionResult> {
    const { event_type, resource } = webhookData.data as any

    if (event_type === "PAYMENT.CAPTURE.COMPLETED") {
      return {
        action: "authorized",
        data: {
          session_id: resource?.custom_id,
          amount: Math.round(parseFloat(resource?.amount?.value || "0") * 100),
        },
      }
    }

    if (event_type === "PAYMENT.CAPTURE.DENIED" || event_type === "PAYMENT.CAPTURE.REVERSED") {
      return {
        action: "failed",
        data: { session_id: resource?.custom_id, amount: 0 },
      }
    }

    return { action: "not_supported" }
  }
}

export default PayPalPaymentProvider
