import _ from "lodash"
import Stripe from "stripe"
import { PaymentService } from "medusa-interfaces"

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

    this.stripe_ = Stripe(options.api_key)

    this.customerService_ = customerService

    this.regionService_ = regionService

    this.totalsService_ = totalsService
  }

  /**
   * Status for Stripe payment intent.
   * @param {Object} paymentData - payment method data from cart
   * @returns {string} the status of the payment intent
   */
  async getStatus(paymentData) {
    const { id } = paymentData

    const paymentIntent = await this.stripe_.paymentIntents.retrieve(id)

    let status = "initial"

    if (paymentIntent.status === "requires_payment_method") {
      return status
    }

    if (paymentIntent.status === "requires_capture") {
      status = "authorized"
    }

    if (paymentIntent.status === "succeeded") {
      status = "succeeded"
    }

    if (paymentIntent.status === "canceled") {
      status = "canceled"
    }

    return status
  }

  /**
   * Fetches a customers saved payment methods if registered in Stripe.
   * @param {Object} customer - customer to fetch saved cards for
   * @returns {Promise<Array<Object>>} saved payments methods
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
   * @returns {Promise<Object>} Stripe customer
   */
  async retrieveCustomer(customerId) {
    if (!customerId) {
      return Promise.resolve()
    }
    return this.stripe_.customers.retrieve(customerId)
  }

  /**
   * Creates a Stripe customer using a Medusa customer.
   * @param {Object} customer - Customer data from Medusa
   * @returns {Promise<Object>} Stripe customer
   */
  async createCustomer(customer) {
    try {
      const stripeCustomer = await this.stripe_.customers.create({
        email: customer.email,
      })

      if (customer._id) {
        await this.customerService_.setMetadata(
          customer._id,
          "stripe_id",
          stripeCustomer.id
        )
      }
      return stripeCustomer
    } catch (error) {
      throw error
    }
  }

  /**
   * Creates a Stripe payment intent.
   * If customer is not registered in Stripe, we do so.
   * @param {Object} cart - cart to create a payment for
   * @returns {Object} Stripe payment intent
   */
  async createPayment(cart) {
    const { customer_id, region_id } = cart
    const { currency_code } = await this.regionService_.retrieve(region_id)

    let stripeCustomerId

    if (!customer_id) {
      const stripeCustomer = await this.createCustomer({ email: cart.email })
      stripeCustomerId = stripeCustomer.id
    } else {
      const customer = await this.customerService_.retrieve(customer_id)

      if (!customer.metadata?.stripe_id) {
        const stripeCustomer = await this.createCustomer(customer)
        stripeCustomerId = stripeCustomer.id
      } else {
        stripeCustomerId = customer.metadata.stripe_id
      }
    }

    const amount = await this.totalsService_.getTotal(cart)
    const paymentIntent = await this.stripe_.paymentIntents.create({
      customer: stripeCustomerId,
      amount: parseInt(amount * 100), // Stripe amount is in cents
      currency: currency_code,
      setup_future_usage: "on_session",
      capture_method: this.options_.capture ? "automatic" : "manual",
      metadata: { cart_id: `${cart._id}` },
    })

    return paymentIntent
  }

  /**
   * Retrieves Stripe payment intent.
   * @param {Object} data - the data of the payment to retrieve
   * @returns {Promise<Object>} Stripe payment intent
   */
  async retrievePayment(data) {
    try {
      return this.stripe_.paymentIntents.retrieve(data.id)
    } catch (error) {
      throw error
    }
  }

  /**
   * Updates Stripe payment intent.
   * @param {Object} data - The payment session data.
   * @param {Object} cart - cart to use for updating
   * @returns {Object} Stripe payment intent
   */
  async updatePayment(data, cart) {
    try {
      const { id } = data
      const amount = await this.totalsService_.getTotal(cart)
      return this.stripe_.paymentIntents.update(id, {
        amount: parseInt(amount * 100),
      })
    } catch (error) {
      throw error
    }
  }

  async deletePayment(data) {
    try {
      const { id } = data
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
   * @returns {Object} Stripe payment intent
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
   * @param {Object} paymentData - payment method data from cart
   * @returns {Object} Stripe payment intent
   */
  async capturePayment(paymentData) {
    const { id } = paymentData
    try {
      return this.stripe_.paymentIntents.capture(id)
    } catch (error) {
      throw error
    }
  }

  /**
   * Refunds payment for Stripe payment intent.
   * @param {Object} paymentData - payment method data from cart
   * @returns {string} refunded payment intent
   */
  async refundPayment(paymentData, amount) {
    const { id } = paymentData
    try {
      return this.stripe_.refunds.create({
        amount: parseInt(amount * 100),
        payment_intent: id,
      })
    } catch (error) {
      throw error
    }
  }

  /**
   * Cancels payment for Stripe payment intent.
   * @param {Object} paymentData - payment method data from cart
   * @returns {Object} canceled payment intent
   */
  async cancelPayment(paymentData) {
    const { id } = paymentData
    try {
      return this.stripe_.paymentIntents.cancel(id)
    } catch (error) {
      if (error.payment_intent.status === "canceled") {
        return error.payment_intent
      }

      throw error
    }
  }

  /**
   * Constructs Stripe Webhook event
   * @param {Object} data - the data of the webhook request: req.body
   * @param {Object} signature - the Stripe signature on the event, that
   *    ensures integrity of the webhook event
   * @returns {Object} Stripe Webhook event
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
