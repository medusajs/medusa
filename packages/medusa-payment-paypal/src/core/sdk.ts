import {
  CreateOrder,
  CreateOrderResponse,
  PAYPAL_API_PATH,
  PaypalSdkOptions,
} from "./types"
import { Logger } from "@medusajs/medusa"
import { CapturesRefund, CapturesRefundResponse } from "./types/payment"
import { PaypalHttpClient } from "./paypal-http-client"

export class PaypalSdk {
  protected readonly baseUrl_: string = "https://api-m.paypal.com/v2"
  protected readonly httpClient_: PaypalHttpClient
  protected readonly options_: PaypalSdkOptions
  protected readonly logger_?: Logger

  protected accessToken_: string

  constructor(options: PaypalSdkOptions) {
    this.options_ = options

    this.logger_ = options.logger

    if (options.useSandbox) {
      this.baseUrl_ = "https://api-m.sandbox.paypal.com"
    }

    this.httpClient_ = new PaypalHttpClient(options)
  }

  /**
   * Create a new order
   * @param data
   */
  async createOrder(data: CreateOrder): Promise<CreateOrderResponse> {
    const url = PAYPAL_API_PATH.CREATE_ORDER
    return await this.httpClient_.request({ url, data })
  }

  /**
   * Refunds a captured payment, by ID. For a full refund, include an empty
   * payload in the JSON request body. For a partial refund, include an amount
   * object in the JSON request body.
   * @param paymentId
   * @param data
   */
  async capturesRefund(
    paymentId: string,
    data?: CapturesRefund
  ): Promise<CapturesRefundResponse> {
    const url = PAYPAL_API_PATH.CAPTURE_REFUND.replace("{id}", paymentId)

    return await this.httpClient_.request({ url, data })
  }
}
