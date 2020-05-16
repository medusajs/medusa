import _ from "lodash"
import Stripe from "stripe"
import { PaymentService } from "medusa-interfaces"

class StripeProviderService extends PaymentService {
  static identifier = "stripe"

  constructor({ customerService, totalsService }, options) {
    super()

    this.stripe_ = Stripe(options.api_key)

    this.customerService_ = customerService

    this.totalsService_ = totalsService
  }

  /**
   * Status for Stripe PaymentIntent.
   * @param {Object} paymentData - payment method data from cart
   * @returns {string} the status of the payment intent
   */
  async getStatus(paymentData) {
    // TODO: Check if we actually store it like this
    const { payment_intent_id } = paymentData

    const paymentIntent = await this.stripe_.paymentIntents.retrieve(
      payment_intent_id
    )

    let status = "initial"

    if (paymentIntent.status === "requires_payment_method") {
      return status
    }

    if (paymentIntent.status === "requires_action") {
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

  async retrieveCustomer(customerId) {
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
    const { customer_id } = cart

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

    const amount = this.totalsService_.getTotal(cart)
    const paymentIntent = await this.stripe_.paymentIntents.create({
      customer: stripeCustomerId,
      amount,
    })

    return paymentIntent
  }

  /**
   * Retrieves Stripe PaymentIntent.
   * @param {string} cart - the cart to retrieve payment intent for
   * @returns {string} id of payment intent
   */
  async retrievePayment(cart) {
    try {
      const { data } = cart.payment_method
      return this.stripe_.paymentIntents.retrieve(data.id)
    } catch (error) {
      throw error
    }
  }

  /**
   * Updates Stripe PaymentIntent.
   * @param {string} cart - the cart to update payment intent for
   * @param {Object} data - the update object for the payment intent
   * @returns {string} id of payment intent
   */
  async updatePayment(cart, update) {
    try {
      const { data } = cart.payment_method
      const updatedIntent = await this.stripe_.paymentIntents.update(
        data.id,
        update
      )
      return updatedIntent
    } catch (error) {
      throw error
    }
  }

  /**
   * Updates customer of Stripe PaymentIntent.
   * @param {string} cart - the cart to update payment intent for
   * @param {Object} data - the update object for the payment intent
   * @returns {string} id of payment intent
   */
  async updatePaymentIntentCustomer(paymentIntent, id) {
    try {
      const updatedIntent = await this.stripe_.paymentIntents.update(
        paymentIntent,
        {
          customer: id,
        }
      )
      return updatedIntent
    } catch (error) {
      throw error
    }
  }

  /**
   * Captures payment for Stripe PaymentIntent.
   * @param {Object} paymentData - payment method data from cart
   * @returns {string} id of payment intent
   */
  async capturePayment(paymentData) {
    const { id } = paymentData
    try {
      const capturedIntent = await this.stripe_.paymentIntents.capture(id)
      return capturedIntent.id
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
      const refundedIntent = await stripe.refunds.create({
        amount,
        payment_intent: id,
      })
      return refundedIntent.id
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
      const cancelledIntent = await stripe.paymentIntents.cancel(id)
      return cancelledIntent.id
    } catch (error) {
      throw error
    }
  }
}

export default StripeProviderService
