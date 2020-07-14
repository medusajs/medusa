import _ from "lodash"
import Stripe from "stripe"
import { PaymentService } from "medusa-interfaces"

class StripeProviderService extends PaymentService {
  static identifier = "stripe"

  constructor({ customerService, totalsService, regionService }, options) {
    super()

    this.options_ = options

    this.stripe_ = Stripe(options.api_key)

    this.customerService_ = customerService

    this.regionService_ = regionService

    this.totalsService_ = totalsService
  }

  /**
   * Status for Stripe PaymentIntent.
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

    if (paymentIntent.status === "cancelled") {
      status = "cancelled"
    }

    return status
  }

  async retrieveSavedMethods(customer) {
    if (customer.metadata && customer.metadata.stripe_id) {
      const methods = await this.stripe_.paymentMethods.list({
        customer: customer.metadata.stripe_id, type: "card"
      })

      return methods.data
    }

    return Promise.resolve([])
  }

  async retrieveCustomer(customerId) {
    if (!customerId) {
      return Promise.resolve()
    }
    return this.stripe_.customers.retrieve(customerId)
  }

  // customer metadata
  async createCustomer(customer) {
    try {
      const stripeCustomer = await this.stripe_.customers.create({
        email: customer.email,
      })
      await this.customerService_.setMetadata(
        customer._id,
        "stripe_id",
        stripeCustomer.id
      )
      return stripeCustomer
    } catch (error) {
      throw error
    }
  }

  /**
   * Creates Stripe PaymentIntent.
   * @param {string} cart - the cart to create a payment for
   * @param {number} amount - the amount to create a payment for
   * @returns {string} id of payment intent
   */
  async createPayment(cart) {
    const { customer_id, region_id } = cart
    const { currency_code } = await this.regionService_.retrieve(region_id)

    let stripeCustomerId
    if (!customer_id) {
      const { id } = await this.stripe_.customers.create({
        email: cart.email,
      })
      stripeCustomerId = id
    } else {
      const customer = await this.customerService_.retrieve(customer_id)
      if (!customer.metadata.stripe_id) {
        const { id } = await this.stripe_.customers.create({
          email: customer.email,
        })
        await this.customerService_.setMetadata(customer._id, "stripe_id", id)
      } else {
        stripeCustomerId = customer.metadata.stripe_id
      }
    }

    const amount = await this.totalsService_.getTotal(cart)
    const paymentIntent = await this.stripe_.paymentIntents.create({
      customer: stripeCustomerId,
      amount: amount * 100, // Stripe amount is in cents
      currency: currency_code,
      setup_future_usage: "on_session",
      capture_method: "manual",
      metadata: { cart_id: `${cart._id}` },
    })

    return paymentIntent
  }

  /**
   * Retrieves Stripe PaymentIntent.
   * @param {object} data - the data of the payment to retrieve
   * @returns {Object} Stripe PaymentIntent
   */
  async retrievePayment(data) {
    try {
      return this.stripe_.paymentIntents.retrieve(data.id)
    } catch (error) {
      throw error
    }
  }

  /**
   * Updates Stripe PaymentIntent.
   * @param {object} data - The payment session data.
   * @param {Object} cart - the current cart value
   * @returns {Object} Stripe PaymentIntent
   */
  async updatePayment(data, cart) {
    try {
      const { id } = data
      const amount = this.totalsService_.getTotal(cart)
      return this.stripe_.paymentIntents.update(id, {
        amount,
      })
    } catch (error) {
      throw error
    }
  }

  async deletePayment(data) {
    try {
      const { id } = data
      return this.stripe_.paymentIntents.cancel(id)
    } catch (error) {
      throw error
    }
  }

  /**
   * Updates customer of Stripe PaymentIntent.
   * @param {string} cart - the cart to update payment intent for
   * @param {Object} data - the update object for the payment intent
   * @returns {Object} Stripe PaymentIntent
   */
  async updatePaymentIntentCustomer(paymentIntent, id) {
    try {
      return this.stripe_.paymentIntents.update(paymentIntent, {
        customer: id,
      })
    } catch (error) {
      throw error
    }
  }

  /**
   * Captures payment for Stripe PaymentIntent.
   * @param {Object} paymentData - payment method data from cart
   * @returns {Object} Stripe PaymentIntent
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
   * Refunds payment for Stripe PaymentIntent.
   * @param {Object} paymentData - payment method data from cart
   * @returns {string} id of payment intent
   */
  async refundPayment(paymentData, amount) {
    const { id } = paymentData
    try {
      return this.stripe_.refunds.create({
        amount,
        payment_intent: id,
      })
    } catch (error) {
      throw error
    }
  }

  /**
   * Cancels payment for Stripe PaymentIntent.
   * @param {Object} paymentData - payment method data from cart
   * @returns {string} id of payment intent
   */
  async cancelPayment(paymentData) {
    const { id } = paymentData
    try {
      return this.stripe_.paymentIntents.cancel(id)
    } catch (error) {
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
