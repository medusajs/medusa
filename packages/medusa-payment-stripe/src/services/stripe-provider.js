import Stripe from "stripe"
import { PaymentService } from "medusa-interfaces"
import { PaymentSessionStatus } from '@medusajs/medusa/dist'

class StripeProviderService extends PaymentService {
  static identifier = "stripe"

  constructor({ customerService, totalsService, regionService }, options) {
    super()

    /**
     * Required Stripe options:
     *  {
     *    api_key: "stripe_secret_key", REQUIRED
     *    webhook_secret: "stripe_webhook_secret", REQUIRED
     *    // Use this flag to capture payment immediately (default is false)
     *    capture: true
     *  }
     */
    this.options_ = options

    /** @private @const {Stripe} */
    this.stripe_ = Stripe(options.api_key)

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
    const { id } = paymentData
    const paymentIntent = await this.stripe_.paymentIntents.retrieve(id)

    switch (paymentIntent.status) {
      case "requires_payment_method":
      case "requires_confirmation":
      case "processing":
        return PaymentSessionStatus.PENDING
      case "requires_action":
        return PaymentSessionStatus.REQUIRES_MORE
      case "canceled":
        return PaymentSessionStatus.CANCELED
      case "requires_capture":
      case "succeeded":
        return PaymentSessionStatus.AUTHORIZED
      default:
        return PaymentSessionStatus.PENDING
    }
  }

  /**
   * Fetches a customers saved payment methods if registered in Stripe.
   * @param {object} customer - customer to fetch saved cards for
   * @returns {Promise<Array<object>>} saved payments methods
   */
  async retrieveSavedMethods(customer) {
    if (customer.metadata && customer.metadata.stripe_id) {
      const methods = await this.stripe_.paymentMethods.list({
        customer: customer.metadata.stripe_id,
        type: "card",
      })

      return methods.data
    }

    return Promise.resolve([])
  }

  /**
   * Fetches a Stripe customer
   * @param {string} customerId - Stripe customer id
   * @returns {Promise<object>} Stripe customer
   */
  async retrieveCustomer(customerId) {
    if (!customerId) {
      return Promise.resolve()
    }
    return this.stripe_.customers.retrieve(customerId)
  }

  /**
   * Creates a Stripe customer using a Medusa customer.
   * @param {object} customer - Customer data from Medusa
   * @returns {Promise<object>} Stripe customer
   */
  async createCustomer(customer) {
    try {
      const stripeCustomer = await this.stripe_.customers.create({
        email: customer.email,
      })

      if (customer.id) {
        await this.customerService_.update(customer.id, {
          metadata: { stripe_id: stripeCustomer.id },
        })
      }

      return stripeCustomer
    } catch (error) {
      throw error
    }
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

    const intentRequest = {
      description: cart?.context?.payment_description ?? this.options_?.payment_description,
      amount: Math.round(amount),
      currency: currency_code,
      setup_future_usage: "on_session",
      capture_method: this.options_.capture ? "automatic" : "manual",
      metadata: { cart_id: `${cart.id}` },
    }

    if (customer_id) {
      const customer = await this.customerService_.retrieve(customer_id)

      if (customer.metadata?.stripe_id) {
        intentRequest.customer = customer.metadata.stripe_id
      } else {
        const stripeCustomer = await this.createCustomer({
          email,
          id: customer_id,
        })

        intentRequest.customer = stripeCustomer.id
      }
    } else {
      const stripeCustomer = await this.createCustomer({
        email,
      })

      intentRequest.customer = stripeCustomer.id
    }

    return await this.stripe_.paymentIntents.create(
      intentRequest
    )
  }

  /**
   * Retrieves Stripe payment intent.
   * @param {object} data - the data of the payment to retrieve
   * @returns {Promise<object>} Stripe payment intent
   */
  async retrievePayment(data) {
    try {
      return this.stripe_.paymentIntents.retrieve(data.id)
    } catch (error) {
      throw error
    }
  }

  /**
   * Gets a Stripe payment intent and returns it.
   * @param {object} sessionData - the data of the payment to retrieve
   * @returns {Promise<object>} Stripe payment intent
   */
  async getPaymentData(sessionData) {
    try {
      return this.stripe_.paymentIntents.retrieve(sessionData.data.id)
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
  async authorizePayment(sessionData, context = {}) {
    const stat = await this.getStatus(sessionData.data)

    try {
      return { data: sessionData.data, status: stat }
    } catch (error) {
      throw error
    }
  }

  async updatePaymentData(sessionData, update) {
    try {
      return this.stripe_.paymentIntents.update(sessionData.id, {
        ...update.data,
      })
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
      const stripeId = cart.customer?.metadata?.stripe_id || undefined

      if (stripeId !== sessionData.customer) {
        return this.createPayment(cart)
      } else {
        if (cart.total && sessionData.amount === Math.round(cart.total)) {
          return sessionData
        }

        return this.stripe_.paymentIntents.update(sessionData.id, {
          amount: Math.round(cart.total),
        })
      }
    } catch (error) {
      throw error
    }
  }

  async deletePayment(payment) {
    try {
      const { id } = payment.data
      return this.stripe_.paymentIntents.cancel(id).catch((err) => {
        if (err.statusCode === 400) {
          return
        }
        throw err
      })
    } catch (error) {
      throw error
    }
  }

  /**
   * Updates customer of Stripe payment intent.
   * @param {string} paymentIntentId - id of payment intent to update
   * @param {string} customerId - id of new Stripe customer
   * @returns {object} Stripe payment intent
   */
  async updatePaymentIntentCustomer(paymentIntentId, customerId) {
    try {
      return this.stripe_.paymentIntents.update(paymentIntentId, {
        customer: customerId,
      })
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
    const { id } = payment.data
    try {
      const intent = await this.stripe_.paymentIntents.capture(id)
      return intent
    } catch (error) {
      if (error.code === "payment_intent_unexpected_state") {
        if (error.payment_intent.status === "succeeded") {
          return error.payment_intent
        }
      }
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
    const { id } = payment.data
    try {
      await this.stripe_.refunds.create({
        amount: Math.round(amountToRefund),
        payment_intent: id,
      })

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
    const { id } = payment.data
    try {
      return await this.stripe_.paymentIntents.cancel(id)
    } catch (error) {
      if (error.payment_intent.status === "canceled") {
        return error.payment_intent
      }

      throw error
    }
  }

  /**
   * Constructs Stripe Webhook event
   * @param {object} data - the data of the webhook request: req.body
   * @param {object} signature - the Stripe signature on the event, that
   *    ensures integrity of the webhook event
   * @returns {object} Stripe Webhook event
   */
  constructWebhookEvent(data, signature) {
    return this.stripe_.webhooks.constructEvent(
      data,
      signature,
      this.options_.webhook_secret
    )
  }
}

export default StripeProviderService
