import {
  CreateOrder,
  CreateOrderResponse,
  GetOrderResponse,
  PatchOrder,
  PaypalApiPath,
  PaypalSdkOptions,
} from "./types"
import {
  CaptureAuthorizedPayment,
  CapturesAuthorizationResponse,
  CapturesRefundResponse,
  GetAuthorizationPaymentResponse,
  RefundPayment,
} from "./types/payment"
import { PaypalHttpClient } from "./paypal-http-client"
import { VerifyWebhookSignature } from "./types/webhook"

export class PaypalSdk {
  protected readonly httpClient_: PaypalHttpClient

  constructor(options: PaypalSdkOptions) {
    this.httpClient_ = new PaypalHttpClient(options)
  }

  /**
   * Create a new order.
   * @param data
   */
  async createOrder(data: CreateOrder): Promise<CreateOrderResponse> {
    const url = PaypalApiPath.CREATE_ORDER
    return await this.httpClient_.request({ url, data })
  }

  /**
   * Retrieve an order.
   * @param orderId
   */
  async getOrder(orderId: string): Promise<GetOrderResponse> {
    const url = PaypalApiPath.GET_ORDER.replace("{id}", orderId)
    return await this.httpClient_.request({ url, method: "GET" })
  }

  /**
   * Patch an order.
   * @param orderId
   * @param data
   */
  async patchOrder(orderId: string, data?: PatchOrder[]): Promise<void> {
    const url = PaypalApiPath.PATCH_ORDER.replace("{id}", orderId)
    return await this.httpClient_.request({ url, method: "PATCH" })
  }

  /**
   * Authorizes payment for an order. To successfully authorize payment for an order,
   * the buyer must first approve the order or a valid payment_source must be provided in the request.
   * A buyer can approve the order upon being redirected to the rel:approve URL that was returned in the HATEOAS links in the create order response.
   * @param orderId
   */
  async authorizeOrder(orderId: string): Promise<CreateOrderResponse> {
    const url = PaypalApiPath.AUTHORIZE_ORDER.replace("{id}", orderId)

    return await this.httpClient_.request({ url })
  }

  /**
   * Refunds a captured payment, by ID. For a full refund, include an empty
   * payload in the JSON request body. For a partial refund, include an amount
   * object in the JSON request body.
   * @param paymentId
   * @param data
   */
  async refundPayment(
    paymentId: string,
    data?: RefundPayment
  ): Promise<CapturesRefundResponse> {
    const url = PaypalApiPath.CAPTURE_REFUND.replace("{id}", paymentId)
    return await this.httpClient_.request({ url, data })
  }

  /**
   * Voids, or cancels, an authorized payment, by ID. You cannot void an authorized payment that has been fully captured.
   * @param authorizationId
   */
  async cancelAuthorizedPayment(authorizationId: string): Promise<void> {
    const url = PaypalApiPath.AUTHORIZATION_VOID.replace(
      "{id}",
      authorizationId
    )

    return await this.httpClient_.request({ url })
  }

  /**
   * Captures an authorized payment, by ID.
   * @param authorizationId
   * @param data
   */
  async captureAuthorizedPayment(
    authorizationId: string,
    data?: CaptureAuthorizedPayment
  ): Promise<CapturesAuthorizationResponse> {
    const url = PaypalApiPath.AUTHORIZATION_CAPTURE.replace(
      "{id}",
      authorizationId
    )

    return await this.httpClient_.request({ url, data })
  }

  /**
   * Captures an authorized payment, by ID.
   * @param authorizationId
   */
  async getAuthorizationPayment(
    authorizationId: string
  ): Promise<GetAuthorizationPaymentResponse> {
    const url = PaypalApiPath.AUTHORIZATION_GET.replace("{id}", authorizationId)

    return await this.httpClient_.request({ url })
  }

  async verifyWebhook(data: VerifyWebhookSignature) {
    const url = PaypalApiPath.VERIFY_WEBHOOK_SIGNATURE
    return await this.httpClient_.request({ url, data })
  }
}
