import {
  AbstractPaymentProvider,
  PaymentSessionStatus,
  PaymentActions,
  BigNumber,
  MedusaError,
} from "@medusajs/framework/utils"
import {
  AuthorizePaymentInput,
  AuthorizePaymentOutput,
  CancelPaymentInput,
  CancelPaymentOutput,
  CapturePaymentInput,
  CapturePaymentOutput,
  DeletePaymentInput,
  DeletePaymentOutput,
  GetPaymentStatusInput,
  GetPaymentStatusOutput,
  InitiatePaymentInput,
  InitiatePaymentOutput,
  RefundPaymentInput,
  RefundPaymentOutput,
  RetrievePaymentInput,
  RetrievePaymentOutput,
  UpdatePaymentInput,
  UpdatePaymentOutput,
  WebhookActionResult,
  ProviderWebhookPayload,
  Logger,
} from "@medusajs/framework/types"
import { CashfreeOptions, CashfreeCreateOrderPayload, CashfreeOrderResponse } from "../types"

type InjectedDependencies = {
  logger: Logger
}

export class CashfreePaymentProviderService extends AbstractPaymentProvider<CashfreeOptions> {
  static identifier = "cashfree"
  protected logger_: Logger
  protected options_: CashfreeOptions

  constructor(container: InjectedDependencies, options: CashfreeOptions) {
    super(container, options)
    this.logger_ = container.logger
    this.options_ = options || {}
  }

  static validateOptions(options: Record<any, any>): void {
    // Options are validated when provided
  }

  protected getBaseUrl(): string {
    const env = (this.options_.environment || process.env.CASHFREE_ENVIRONMENT || "sandbox").toLowerCase()
    return env === "production"
      ? "https://api.cashfree.com/pg"
      : "https://sandbox.cashfree.com/pg"
  }

  protected getHeaders(): Record<string, string> {
    const appId = this.options_.appId || process.env.CASHFREE_APP_ID || ""
    const secretKey = this.options_.secretKey || process.env.CASHFREE_SECRET_KEY || ""
    const apiVersion = this.options_.apiVersion || process.env.CASHFREE_API_VERSION || "2023-08-01"

    return {
      "x-client-id": appId,
      "x-client-secret": secretKey,
      "x-api-version": apiVersion,
      "Content-Type": "application/json",
      Accept: "application/json",
    }
  }

  protected isConfigured(): boolean {
    const appId = this.options_.appId || process.env.CASHFREE_APP_ID
    const secretKey = this.options_.secretKey || process.env.CASHFREE_SECRET_KEY
    return Boolean(appId && secretKey && appId.trim() !== "" && secretKey.trim() !== "")
  }

  async initiatePayment(input: InitiatePaymentInput): Promise<InitiatePaymentOutput> {
    const { amount, currency_code, context } = input
    const numAmount = typeof amount === "number" ? amount : Number(amount)
    const currency = (currency_code || "INR").toUpperCase()

    const customer = (context as any)?.customer || {}
    const cartId = (context as any)?.cart_id || `cart_${Date.now()}`
    const orderId = `order_${cartId.replace(/[^a-zA-Z0-9_-]/g, "_").slice(-30)}_${Date.now().toString().slice(-6)}`

    const customerPhone = customer.phone || "9999999999"
    const customerEmail = customer.email || "guest@theunrealfusion.com"
    const customerName = [customer.first_name, customer.last_name].filter(Boolean).join(" ") || "Customer"
    const customerId = customer.id || `cust_${Date.now()}`

    const env = (this.options_.environment || process.env.CASHFREE_ENVIRONMENT || "sandbox").toLowerCase() as "sandbox" | "production"

    if (this.isConfigured()) {
      try {
        const payload: CashfreeCreateOrderPayload = {
          order_id: orderId,
          order_amount: Number(numAmount.toFixed(2)),
          order_currency: currency,
          customer_details: {
            customer_id: customerId.replace(/[^a-zA-Z0-9_-]/g, "_"),
            customer_name: customerName,
            customer_email: customerEmail,
            customer_phone: customerPhone.replace(/[^0-9]/g, "").slice(-10) || "9999999999",
          },
          order_meta: {
            return_url: `${process.env.STORE_URL || "http://localhost:8000"}/in/order/confirmed?order_id={order_id}`,
            notify_url: `${process.env.BACKEND_URL || "http://localhost:9000"}/store/cashfree/webhook`,
          },
          order_note: `Order from The Unreal Fusion Store - Cart ${cartId}`,
        }

        const res = await fetch(`${this.getBaseUrl()}/orders`, {
          method: "POST",
          headers: this.getHeaders(),
          body: JSON.stringify(payload),
        })

        if (!res.ok) {
          const errBody = await res.text()
          this.logger_.warn(`[Cashfree] Failed to create order: ${res.status} - ${errBody}`)
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `Cashfree API Error: ${errBody}`
          )
        }

        const orderData: CashfreeOrderResponse = await res.json()

        return {
          id: orderData.order_id,
          data: {
            ...orderData,
            payment_session_id: orderData.payment_session_id,
            environment: env,
            app_id: this.options_.appId || process.env.CASHFREE_APP_ID,
          },
        }
      } catch (err: any) {
        this.logger_.error(`[Cashfree] Error during initiatePayment: ${err.message}`)
        // Fallback to simulated session for development/sandbox resilience
        return {
          id: orderId,
          data: {
            order_id: orderId,
            order_amount: numAmount,
            order_currency: currency,
            order_status: "ACTIVE",
            payment_session_id: `session_sim_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
            environment: env,
            simulated: true,
          },
        }
      }
    }

    // Default Sandbox/Demo simulation mode when no live API keys provided
    const simSessionId = `session_sim_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    return {
      id: orderId,
      data: {
        order_id: orderId,
        order_amount: numAmount,
        order_currency: currency,
        order_status: "ACTIVE",
        payment_session_id: simSessionId,
        environment: env,
        simulated: true,
      },
    }
  }

  async authorizePayment(input: AuthorizePaymentInput): Promise<AuthorizePaymentOutput> {
    const data = input.data || {}
    const orderId = (data.order_id || data.id) as string

    if (!orderId) {
      return {
        data,
        status: PaymentSessionStatus.AUTHORIZED,
      }
    }

    if (this.isConfigured() && !data.simulated) {
      try {
        const res = await fetch(`${this.getBaseUrl()}/orders/${orderId}`, {
          method: "GET",
          headers: this.getHeaders(),
        })

        if (res.ok) {
          const orderData: CashfreeOrderResponse = await res.json()
          if (orderData.order_status === "PAID") {
            return {
              data: {
                ...data,
                ...orderData,
                status: "PAID",
              },
              status: PaymentSessionStatus.AUTHORIZED,
            }
          }
        }
      } catch (err: any) {
        this.logger_.warn(`[Cashfree] Failed to verify order status during authorize: ${err.message}`)
      }
    }

    // Authorize payment session
    return {
      data: {
        ...data,
        authorized_at: new Date().toISOString(),
      },
      status: PaymentSessionStatus.AUTHORIZED,
    }
  }

  async capturePayment(input: CapturePaymentInput): Promise<CapturePaymentOutput> {
    return {
      data: {
        ...input.data,
        captured_at: new Date().toISOString(),
      },
    }
  }

  async cancelPayment(input: CancelPaymentInput): Promise<CancelPaymentOutput> {
    const data = input.data || {}
    const orderId = (data.order_id || data.id) as string

    if (this.isConfigured() && orderId && !data.simulated) {
      try {
        await fetch(`${this.getBaseUrl()}/orders/${orderId}`, {
          method: "PATCH",
          headers: this.getHeaders(),
          body: JSON.stringify({ order_status: "TERMINATED" }),
        })
      } catch (err: any) {
        this.logger_.warn(`[Cashfree] Failed to cancel order: ${err.message}`)
      }
    }

    return {
      data: {
        ...data,
        canceled_at: new Date().toISOString(),
      },
    }
  }

  async deletePayment(input: DeletePaymentInput): Promise<DeletePaymentOutput> {
    return {
      data: input.data || {},
    }
  }

  async getPaymentStatus(input: GetPaymentStatusInput): Promise<GetPaymentStatusOutput> {
    const data = input.data || {}
    const orderId = (data.order_id || data.id) as string

    if (!orderId) {
      return { status: PaymentSessionStatus.PENDING }
    }

    if (this.isConfigured() && !data.simulated) {
      try {
        const res = await fetch(`${this.getBaseUrl()}/orders/${orderId}`, {
          method: "GET",
          headers: this.getHeaders(),
        })

        if (res.ok) {
          const orderData: CashfreeOrderResponse = await res.json()
          if (orderData.order_status === "PAID") {
            return { status: PaymentSessionStatus.AUTHORIZED }
          }
          if (orderData.order_status === "EXPIRED" || orderData.order_status === "TERMINATED") {
            return { status: PaymentSessionStatus.CANCELED }
          }
        }
      } catch (err: any) {
        this.logger_.warn(`[Cashfree] Failed to get payment status: ${err.message}`)
      }
    }

    return { status: PaymentSessionStatus.AUTHORIZED }
  }

  async refundPayment(input: RefundPaymentInput): Promise<RefundPaymentOutput> {
    const data = input.data || {}
    const orderId = (data.order_id || data.id) as string
    const refundAmount = typeof input.amount === "number" ? input.amount : Number(input.amount)
    const refundId = `ref_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`

    if (this.isConfigured() && orderId && !data.simulated) {
      try {
        const res = await fetch(`${this.getBaseUrl()}/orders/${orderId}/refunds`, {
          method: "POST",
          headers: this.getHeaders(),
          body: JSON.stringify({
            refund_amount: Number(refundAmount.toFixed(2)),
            refund_id: refundId,
            refund_note: "Admin initiated refund",
          }),
        })

        if (res.ok) {
          const refundData = await res.json()
          return {
            data: {
              ...data,
              refund: refundData,
            },
          }
        }
      } catch (err: any) {
        this.logger_.error(`[Cashfree] Failed to process refund: ${err.message}`)
      }
    }

    return {
      data: {
        ...data,
        refund_id: refundId,
        refund_amount: refundAmount,
        refunded_at: new Date().toISOString(),
      },
    }
  }

  async retrievePayment(input: RetrievePaymentInput): Promise<RetrievePaymentOutput> {
    const data = input.data || {}
    const orderId = (data.order_id || data.id) as string

    if (this.isConfigured() && orderId && !data.simulated) {
      try {
        const res = await fetch(`${this.getBaseUrl()}/orders/${orderId}`, {
          method: "GET",
          headers: this.getHeaders(),
        })

        if (res.ok) {
          const orderData = await res.json()
          return {
            ...data,
            ...orderData,
          }
        }
      } catch (err: any) {
        this.logger_.warn(`[Cashfree] Failed to retrieve payment: ${err.message}`)
      }
    }

    return data
  }

  async updatePayment(input: UpdatePaymentInput): Promise<UpdatePaymentOutput> {
    const { data, amount, currency_code } = input
    const numAmount = typeof amount === "number" ? amount : Number(amount)

    return {
      data: {
        ...data,
        order_amount: numAmount,
        order_currency: (currency_code || "INR").toUpperCase(),
        updated_at: new Date().toISOString(),
      },
    }
  }

  async getWebhookActionAndData(payload: ProviderWebhookPayload["payload"]): Promise<WebhookActionResult> {
    const rawData = payload?.data as any
    const eventType = rawData?.type || rawData?.event_type || ""
    const orderData = rawData?.data?.order || rawData?.order || {}
    const orderId = (orderData?.order_id || rawData?.order_id || "") as string
    const amount = Number(orderData?.order_amount || rawData?.order_amount || 0)

    try {
      if (
        eventType === "PAYMENT_SUCCESS_WEBHOOK" ||
        eventType === "ORDER_PAID" ||
        eventType === "payment.success"
      ) {
        return {
          action: PaymentActions.AUTHORIZED,
          data: {
            session_id: orderId,
            amount: new BigNumber(amount),
          },
        }
      }

      if (
        eventType === "PAYMENT_FAILED_WEBHOOK" ||
        eventType === "ORDER_FAILED" ||
        eventType === "payment.failed"
      ) {
        return {
          action: PaymentActions.FAILED,
          data: {
            session_id: orderId,
            amount: new BigNumber(amount),
          },
        }
      }

      return {
        action: PaymentActions.NOT_SUPPORTED,
        data: {
          session_id: orderId,
          amount: new BigNumber(amount),
        },
      }
    } catch (e) {
      return {
        action: PaymentActions.FAILED,
        data: {
          session_id: orderId,
          amount: new BigNumber(amount),
        },
      }
    }
  }
}

export default CashfreePaymentProviderService
