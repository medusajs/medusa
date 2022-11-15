import { humanizeAmount, zeroDecimalCurrencies } from "medusa-core-utils"
import PayPal from "@paypal/checkout-server-sdk"
import { PaymentService } from "medusa-interfaces"

function roundToTwo(num, currency) {
  if (zeroDecimalCurrencies.includes(currency.toLowerCase())) {
    return `${num}`
  }
  return num.toFixed(2)
}

class PayPalProviderService extends PaymentService {
  static identifier = "paypal"

  constructor({ regionService }, options) {
    super()

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
  }

  /**
   * Fetches an open PayPal order and maps its status to Medusa payment
   * statuses.
   * @param {object} paymentData - the data stored with the payment
   * @returns {Promise<string>} the status of the order
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
      default:
        return status
    }
  }

  /**
   * Not supported
   */
  async retrieveSavedMethods(customer) {
    return []
  }

  /**
   * Creates a PayPal order, with an Authorize intent. The plugin doesn't
   * support shipping details at the moment.
   * Reference docs: https://developer.paypal.com/docs/api/orders/v2/
   * @param {object} cart - cart to create a payment for
   * @returns {object} the data to be stored with the payment session.
   */
  async createPayment(cart) {
    const { region_id } = cart
    const { currency_code } = await this.regionService_.retrieve(region_id)

    const amount = cart.total

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

  async createPaymentNew(paymentInput) {
    const { resource_id, currency_code, amount } = paymentInput

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

    const res = await this.paypal_.execute(request)

    return { id: res.result.id }
  }

  /**
   * Retrieves a PayPal order.
   * @param {object} data - the data stored with the payment
   * @returns {Promise<object>} PayPal order
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
   * Gets the payment data from a payment session
   * @param {object} session - the session to fetch payment data for.
   * @returns {Promise<object>} the PayPal order object
   */
  async getPaymentData(session) {
    try {
      return this.retrievePayment(session.data)
    } catch (error) {
      throw error
    }
  }

  /**
   * This method does not call the PayPal authorize function, but fetches the
   * status of the payment as it is expected to have been authorized client side.
   * @param {object} session - payment session
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

  /**
   * Updates the data stored with the payment session.
   * @param {object} data - the currently stored data.
   * @param {object} update - the update data to store.
   * @returns {object} the merged data of the two arguments.
   */
  async updatePaymentData(data, update) {
    try {
      return {
        ...data,
        ...update.data,
      }
    } catch (error) {
      throw error
    }
  }

  /**
   * Updates the PayPal order.
   * @param {object} sessionData - payment session data.
   * @param {object} cart - the cart to update by.
   * @returns {object} the resulting order object.
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
              value: roundToTwo(
                humanizeAmount(cart.total, currency_code),
                currency_code
              ),
            },
          },
        },
      ])

      await this.paypal_.execute(request)

      return sessionData
    } catch (error) {
      return this.createPayment(cart)
    }
  }

  async updatePaymentNew(sessionData, paymentInput) {
    try {
      const { currency_code, amount } = paymentInput

      const request = new PayPal.orders.OrdersPatchRequest(sessionData.id)
      request.requestBody([
        {
          op: "replace",
          path: "/purchase_units/@reference_id=='default'",
          value: {
            amount: {
              currency_code: currency_code.toUpperCase(),
              value: roundToTwo(
                humanizeAmount(amount, currency_code),
                currency_code
              ),
            },
          },
        },
      ])

      await this.paypal_.execute(request)

      return sessionData
    } catch (error) {
      return this.createPaymentNew(paymentInput)
    }
  }

  /**
   * Not suported
   */
  async deletePayment(payment) {
    return
  }

  /**
   * Captures a previously authorized order.
   * @param {object} payment - the payment to capture
   * @returns {object} the PayPal order
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
   * Refunds a given amount.
   * @param {object} payment - payment to refund
   * @param {number} amountToRefund - amount to refund
   * @returns {Promise<Object>} the resulting PayPal order
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

      return this.retrievePayment(payment.data)
    } catch (error) {
      throw error
    }
  }

  /**
   * Cancels payment for paypal payment.
   * @param {Payment} payment - payment object
   * @returns {Promise<object>} canceled payment intent
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
   * @returns {Promise<object>} the PayPal order object
   */
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

  /**
   * Retrieves a PayPal authorization.
   * @param {string} id - the id of the authorization.
   * @returns {Promise<object>} the authorization.
   */
  async retrieveAuthorization(id) {
    const authReq = new PayPal.payments.AuthorizationsGetRequest(id)
    const res = await this.paypal_.execute(authReq)
    if (res.result) {
      return res.result
    }
    return null
  }

  /**
   * Checks if a webhook is verified.
   * @param {object} data - the verficiation data.
   * @returns {Promise<object>} the response of the verification request.
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

    return this.paypal_.execute(verifyReq)
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

      await this.paypal_.execute(whCreateReq)
    }
  }
}

export default PayPalProviderService
