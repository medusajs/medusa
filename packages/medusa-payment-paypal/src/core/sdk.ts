import {
  CreateOrder,
  CreateOrderResponse,
  GetOrderResponse,
  PatchOrder,
  PaypalApiPath,
  PaypalSdkOptions,
} from "./types"
import {
  CapturesAuthorization,
  CapturesAuthorizationResponse,
  CapturesRefund,
  CapturesRefundResponse,
} from "./types/payment"
import { PaypalHttpClient } from "./paypal-http-client"

export class PaypalSdk {
  protected readonly httpClient_: PaypalHttpClient

  constructor(options: PaypalSdkOptions) {
    this.httpClient_ = new PaypalHttpClient(options)
  }

  /**
   * Create a new order.
   * @param data
   */
  async createOrders(data: CreateOrder): Promise<CreateOrderResponse> {
    const url = PaypalApiPath.CREATE_ORDER
    return await this.httpClient_.request({ url, data })
  }

  /**
   * Retrieve an order.
   * @param orderId
   */
  async getOrders(orderId: string): Promise<GetOrderResponse> {
    const url = PaypalApiPath.GET_ORDER.replace("{id}", orderId)
    return await this.httpClient_.request({ url, method: "GET" })
  }

  /**
   * Patch an order.
   * @param orderId
   * @param data
   */
  async patchOrders(orderId: string, data?: PatchOrder): Promise<void> {
    const url = PaypalApiPath.PATCH_ORDER.replace("{id}", orderId)
    return await this.httpClient_.request({ url, method: "PATCH" })
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
    const url = PaypalApiPath.CAPTURE_REFUND.replace("{id}", paymentId)
    return await this.httpClient_.request({ url, data })
  }

  /**
   * Voids, or cancels, an authorized payment, by ID. You cannot void an authorized payment that has been fully captured.
   * @param authorizationId
   */
  async authorizationsVoid(authorizationId: string): Promise<void> {
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
  async authorizationsCapture(
    authorizationId: string,
    data?: CapturesAuthorization
  ): Promise<CapturesAuthorizationResponse> {
    const url = PaypalApiPath.AUTHORIZATION_CAPTURE.replace(
      "{id}",
      authorizationId
    )

    return await this.httpClient_.request({ url, data })
  }
}
