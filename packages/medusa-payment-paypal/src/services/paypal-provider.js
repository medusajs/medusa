import _ from "lodash"
import PayPal from "@paypal/checkout-server-sdk"
import { PaymentService } from "medusa-interfaces"

class PayPalProviderService extends PaymentService {
  static identifier = "paypal"

  constructor({ customerService, totalsService, regionService }, options) {
    super()

    /**
     * Required Stripe options:
     *  {
     *    sandbox: false,
     *    client_id: "CLIENT_ID", REQUIRED
     *    client_secret: "CLIENT_SECRET", REQUIRED
     *    backend_url: REQUIRED
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

    /** @private @const {CustomerService} */
    this.customerService_ = customerService

    /** @private @const {RegionService} */
    this.regionService_ = regionService

    /** @private @const {TotalsService} */
    this.totalsService_ = totalsService
  }

  /**
   * Fetches Stripe payment intent. Check its status and returns the
   * corresponding Medusa status.
   * @param {object} paymentData - payment method data from cart
   * @returns {string} the status of the payment intent
   */
  async getStatus(paymentData) {
    const order = await this.retrievePayment(paymentData)

    let status = "pending"

    switch (order.status) {
      case "CREATED":
        return "pending"
      case "COMPLETED":
        return "authorized"
      case "SAVED":
      case "APPROVED":
      case "PAYER_ACTION_REQUIRED":
        return "requires_more"
      case "VOIDED":
        return "canceled"
      // return "captured"
      default:
        return status
    }
  }

  /**
   * Fetches a customers saved payment methods if registered in Stripe.
   * @param {object} customer - customer to fetch saved cards for
   * @returns {Promise<Array<object>>} saved payments methods
   */
  async retrieveSavedMethods(customer) {
    return Promise.resolve([])
  }

  /**
   * Creates a Stripe payment intent.
   * If customer is not registered in Stripe, we do so.
   * @param {object} cart - cart to create a payment for
   * @returns {object} Stripe payment intent
   */
  async createPayment(cart) {
    const { customer_id, region_id, email } = cart
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
            value: (amount / 100).toFixed(2),
          },
        },
      ],
    })

    const res = await this.paypal_.execute(request)

    return { id: res.result.id }
  }

  /**
   * Retrieves Stripe payment intent.
   * @param {object} data - the data of the payment to retrieve
   * @returns {Promise<object>} Stripe payment intent
   */
  async retrievePayment(data) {
    try {
      const request = new PayPal.orders.OrdersGetRequest(data.id)
      const res = await this.paypal_.execute(request)
      return res.result
    } catch (error) {
      throw error
    }
  }

  /**
   * Gets a Stripe payment intent and returns it.
   * @param {object} sessionData - the data of the payment to retrieve
   * @returns {Promise<object>} Stripe payment intent
   */
  async getPaymentData(paymentSession) {
    try {
      return this.retrievePayment(paymentSession.data)
    } catch (error) {
      throw error
    }
  }

  /**
   * Authorizes Stripe payment intent by simply returning
   * the status for the payment intent in use.
   * @param {object} sessionData - payment session data
   * @param {object} context - properties relevant to current context
   * @returns {Promise<{ status: string, data: object }>} result with data and status
   */
  async authorizePayment(session, context = {}) {
    const stat = await this.getStatus(session.data)

    try {
      return { data: session.data, status: stat }
    } catch (error) {
      throw error
    }
  }

  async updatePaymentData(sessionData, update) {
    try {
      return {
        ...sessionData,
        ...update.data,
      }
    } catch (error) {
      throw error
    }
  }

  /**
   * Updates Stripe payment intent.
   * @param {object} sessionData - payment session data.
   * @param {object} update - objec to update intent with
   * @returns {object} Stripe payment intent
   */
  async updatePayment(sessionData, cart) {
    try {
      const { region_id } = cart
      const { currency_code } = await this.regionService_.retrieve(region_id)

      const request = new PayPal.orders.OrdersPatchRequest(sessionData.id)
      request.requestBody([
        {
          op: "replace",
          path: "/purchase_units/@reference_id=='default'",
          value: {
            amount: {
              currency_code: currency_code.toUpperCase(),
              value: (cart.total / 100).toFixed(),
            },
          },
        },
      ])

      const res = await this.paypal_.execute(request)
      return sessionData
    } catch (error) {
      throw error
    }
  }

  async deletePayment(payment) {
    try {
      return
    } catch (error) {
      throw error
    }
  }

  /**
   * Captures payment for Stripe payment intent.
   * @param {object} paymentData - payment method data from cart
   * @returns {object} Stripe payment intent
   */
  async capturePayment(payment) {
    const { purchase_units } = payment.data

    const id = purchase_units[0].payments.authorizations[0].id

    try {
      const request = new PayPal.payments.AuthorizationsCaptureRequest(id)
      await this.paypal_.execute(request)
      return this.retrievePayment(payment.data)
    } catch (error) {
      throw error
    }
  }

  /**
   * Refunds payment for Stripe payment intent.
   * @param {object} paymentData - payment method data from cart
   * @param {number} amountToRefund - amount to refund
   * @returns {string} refunded payment intent
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
          value: (amountToRefund / 100).toFixed(),
        },
      })

      await this.paypal_.execute(request)

      return payment.data
    } catch (error) {
      throw error
    }
  }

  /**
   * Cancels payment for Stripe payment intent.
   * @param {object} paymentData - payment method data from cart
   * @returns {object} canceled payment intent
   */
  async cancelPayment(payment) {
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

      return this.retrievePayment(payment.data)
    } catch (error) {
      throw error
    }
  }

  async retrieveOrderFromAuth(auth) {
    const link = auth.links.find((l) => l.rel === "up")
    const parts = link.href.split("/")
    const orderId = parts[parts.length - 1]
    const orderReq = new PayPal.orders.OrdersGetRequest(orderId)
    const res = await this.paypal_.execute(orderReq)
    if (res.result) {
      return res.result
    }
    return null
  }

  async retrieveAuthorization(id) {
    const authReq = new PayPal.payments.AuthorizationsGetRequest(id)
    const res = await this.paypal_.execute(authReq)
    if (res.result) {
      return res.result
    }
    return null
  }

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

    return this.paypal_.execute(verifyReq)
  }

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

      await this.paypal_.execute(whCreateReq)
    }
  }
}

export default PayPalProviderService
