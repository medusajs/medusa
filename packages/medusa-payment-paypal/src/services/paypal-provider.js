import { humanizeAmount, zeroDecimalCurrencies } from "medusa-core-utils"
import PayPal from "@paypal/checkout-server-sdk"
import {
  PaymentSessionStatus,
  AbstractPaymentService,
  PaymentSessionData,
} from "@medusajs/medusa"

function roundToTwo(num, currency) {
  if (zeroDecimalCurrencies.includes(currency.toLowerCase())) {
    return `${num}`
  }
  return num.toFixed(2)
}

class PayPalProviderService extends AbstractPaymentService {
  static identifier = "paypal"

  constructor({ totalsService, regionService }, options) {
    super({ totalsService, regionService }, options)

    /**
     * Required PayPal options:
     *  {
     *    sandbox: [default: false],
     *    client_id: "CLIENT_ID", REQUIRED
     *    client_secret: "CLIENT_SECRET", REQUIRED
     *    auth_webhook_id: REQUIRED for webhook to work
     *  }
     */
    this.options_ = options

    let environment
    if (this.options_.sandbox) {
      environment = new PayPal.core.SandboxEnvironment(
        options.client_id,
        options.client_secret
      )
    } else {
      environment = new PayPal.core.LiveEnvironment(
        options.client_id,
        options.client_secret
      )
    }

    /** @private @const {PayPalHttpClient} */
    this.paypal_ = new PayPal.core.PayPalHttpClient(environment)

    /** @private @const {RegionService} */
    this.regionService_ = regionService

    /** @private @const {TotalsService} */
    this.totalsService_ = totalsService
  }

  /**
   * Fetches an open PayPal order and maps its status to Medusa payment
   * statuses.
   * @param {PaymentSessionData} paymentData - the data stored with the payment session
   * @return {Promise<PaymentSessionStatus>} the status of the order
   */
  async getStatus(paymentSessionData) {
    const order = await this.retrievePayment(paymentSessionData)

    const status = PaymentSessionStatus.PENDING

    switch (order.status) {
      case "CREATED":
        return PaymentSessionStatus.PENDING
      case "COMPLETED":
        return PaymentSessionStatus.AUTHORIZED
      case "SAVED":
      case "APPROVED":
      case "PAYER_ACTION_REQUIRED":
        return PaymentSessionStatus.REQUIRES_MORE
      case "VOIDED":
        return PaymentSessionStatus.CANCELED
      default:
        return status
    }
  }

  /**
   * Not supported
   */
  async retrieveSavedMethods(customer) {
    return Promise.resolve([])
  }

  /**
   * Creates a PayPal order, with an Authorize intent. The plugin doesn't
   * support shipping details at the moment.
   * Reference docs: https://developer.paypal.com/docs/api/orders/v2/
   * @param {Cart} cart - cart to create a payment for
   * @return {Promise<PaymentSessionData>} the data to be stored with the payment session.
   */
  async createPayment(cart) {
    const { region_id } = cart
    const { currency_code } = await this.regionService_.retrieve(region_id)

    const amount = await this.totalsService_.getTotal(cart)

    const request = new PayPal.orders.OrdersCreateRequest()
    request.requestBody({
      intent: "AUTHORIZE",
      application_context: {
        shipping_preference: "NO_SHIPPING",
      },
      purchase_units: [
        {
          custom_id: cart.id,
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

    const res = await this.paypal_.execute(request)

    return { id: res.result.id }
  }

  /**
   * Retrieves a PayPal order.
   * @param {PaymentData} paymentData - the data stored with the payment
   * @return {Promise<Data>} PayPal order
   */
  async retrievePayment(paymentData) {
    try {
      const request = new PayPal.orders.OrdersGetRequest(paymentData.id)
      const res = await this.paypal_.execute(request)
      return res.result
    } catch (error) {
      throw error
    }
  }

  /**
   * Gets the payment data from a payment session
   * @param {PaymentSession} paymentSession - the session to fetch payment data for.
   * @return {Promise<PaymentData>} the PayPal order object
   */
  async getPaymentData(paymentSession) {
    try {
      return await this.retrievePayment(paymentSession.data)
    } catch (error) {
      throw error
    }
  }

  /**
   * This method does not call the PayPal authorize function, but fetches the
   * status of the payment as it is expected to have been authorized client side.
   * @param {PaymentSession} paymentSession - payment session
   * @param {Data} context - properties relevant to current context
   * @return {Promise<{data: PaymentSessionData; status: PaymentSessionStatus}>} result with data and status
   */
  async authorizePayment(paymentSession, context = {}) {
    const stat = await this.getStatus(paymentSession.data)

    try {
      return { data: paymentSession.data, status: stat }
    } catch (error) {
      throw error
    }
  }

  /**
   * Updates the data stored with the payment session.
   * @param {PaymentSessionData} paymentSessionData - the currently stored data.
   * @param {Data} data - the update data to store.
   * @return {Promise<PaymentSessionData>} the merged data of the two arguments.
   */
  async updatePaymentData(paymentSessionData, data) {
    try {
      return {
        ...paymentSessionData,
        ...update.data,
      }
    } catch (error) {
      throw error
    }
  }

  /**
   * Updates the PayPal order.
   * @param {PaymentSessionData} paymentSessionData - payment session data.
   * @param {Cart} cart - the cart to update by.
   * @return {Promise<PaymentSessionData>} the resulting order object.
   */
  async updatePayment(paymentSessionData, cart) {
    try {
      const { region_id } = cart
      const { currency_code } = await this.regionService_.retrieve(region_id)

      const request = new PayPal.orders.OrdersPatchRequest(
        paymentSessionData.id
      )
      request.requestBody([
        {
          op: "replace",
          path: "/purchase_units/@reference_id=='default'",
          value: {
            amount: {
              currency_code: currency_code.toUpperCase(),
              value: roundToTwo(
                humanizeAmount(cart.total, currency_code),
                currency_code
              ),
            },
          },
        },
      ])

      await this.paypal_.execute(request)

      return paymentSessionData
    } catch (error) {
      return this.createPayment(cart)
    }
  }

  /**
   * Not suported
   */
  async deletePayment(paymentSession) {
    return
  }

  /**
   * Captures a previously authorized order.
   * @param {Payment} payment - the payment to capture
   * @return {Promise<PaymentData>} the PayPal order
   */
  async capturePayment(payment) {
    const { purchase_units } = payment.data

    const id = purchase_units[0].payments.authorizations[0].id

    try {
      const request = new PayPal.payments.AuthorizationsCaptureRequest(id)
      await this.paypal_.execute(request)
      return await this.retrievePayment(payment.data)
    } catch (error) {
      throw error
    }
  }

  /**
   * Refunds a given amount.
   * @param {Payment} payment - payment to refund
   * @param {number} amountToRefund - amount to refund
   * @return {Promise<PaymentData>} the resulting PayPal order
   */
  async refundPayment(payment, amountToRefund) {
    const { purchase_units } = payment.data

    try {
      const payments = purchase_units[0].payments
      if (!(payments && payments.captures.length)) {
        throw new Error("Order not yet captured")
      }

      const payId = payments.captures[0].id
      const request = new PayPal.payments.CapturesRefundRequest(payId)

      request.requestBody({
        amount: {
          currency_code: payment.currency_code.toUpperCase(),
          value: roundToTwo(
            humanizeAmount(amountToRefund, payment.currency_code),
            payment.currency_code
          ),
        },
      })

      await this.paypal_.execute(request)

      return await this.retrievePayment(payment.data)
    } catch (error) {
      throw error
    }
  }

  /**
   * Cancels payment for paypal payment.
   * @param {Payment} payment - payment object
   * @return {Promise<PaymentData>} canceled payment intent
   */
  async cancelPayment(payment) {
    const order = await this.retrievePayment(payment.data)
    const isAlreadyCanceled = order.status === "VOIDED"
    const isCanceledAndFullyRefund =
      order.status === "COMPLETED" && !!order.invoice_id
    if (isAlreadyCanceled || isCanceledAndFullyRefund) {
      return order
    }

    try {
      const { purchase_units } = payment.data
      if (payment.captured_at) {
        const payments = purchase_units[0].payments

        const payId = payments.captures[0].id
        const request = new PayPal.payments.CapturesRefundRequest(payId)
        await this.paypal_.execute(request)
      } else {
        const id = purchase_units[0].payments.authorizations[0].id
        const request = new PayPal.payments.AuthorizationsVoidRequest(id)
        await this.paypal_.execute(request)
      }

      return await this.retrievePayment(payment.data)
    } catch (error) {
      throw error
    }
  }

  /**
   * Given a PayPal authorization object the method will find the order that
   * created the authorization, by following the HATEOAS link to the order.
   * @param {object} auth - the authorization object.
   * @return {Promise<object>} the PayPal order object
   */
  async retrieveOrderFromAuth(auth) {
    const link = auth.links.find((l) => l.rel === "up")
    const parts = link.href.split("/")
    const orderId = parts[parts.length - 1]
    const orderReq = new PayPal.orders.OrdersGetRequest(orderId)
    const res = await this.paypal_.execute(orderReq)
    return res.result ?? null
  }

  /**
   * Retrieves a PayPal authorization.
   * @param {string} id - the id of the authorization.
   * @return {Promise<object>} the authorization.
   */
  async retrieveAuthorization(id) {
    const authReq = new PayPal.payments.AuthorizationsGetRequest(id)
    const res = await this.paypal_.execute(authReq)
    return res.result ?? null
  }

  /**
   * Checks if a webhook is verified.
   * @param {object} data - the verficiation data.
   * @return {Promise<object>} the response of the verification request.
   */
  async verifyWebhook(data) {
    const verifyReq = {
      verb: "POST",
      path: "/v1/notifications/verify-webhook-signature",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        webhook_id: this.options_.auth_webhook_id,
        ...data,
      },
    }

    return await this.paypal_.execute(verifyReq)
  }

  /**
   * Upserts a webhook that listens for order authorizations.
   */
  async ensureWebhooks() {
    if (!this.options_.backend_url) {
      return
    }

    const webhookReq = {
      verb: "GET",
      path: "/v1/notifications/webhooks",
    }
    const webhookRes = await this.paypal_.execute(webhookReq)

    console.log(webhookRes.result.webhooks)
    let found
    if (webhookRes.result && webhookRes.result.webhooks) {
      found = webhookRes.result.webhooks.find((w) => {
        const notificationType = w.event_types.find(
          (e) => e.name === "PAYMENT.AUTHORIZATION.CREATED"
        )
        return (
          !!notificationType &&
          w.url === `${this.options_.backend_url}/paypal/hooks`
        )
      })
    }

    if (!found) {
      const whCreateReq = {
        verb: "POST",
        path: "/v1/notifications/webhooks",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          id: "medusa-auth-notification",
          url: `${this.options_.backend_url}/paypal/hooks`,
          event_types: [
            {
              name: "PAYMENT.AUTHORIZATION.CREATED",
            },
          ],
        },
      }

      await await this.paypal_.execute(whCreateReq)
    }
  }
}

export default PayPalProviderService
