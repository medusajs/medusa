import _ from "lodash"
import Stripe from "stripe"
import { PaymentService } from "medusa-interfaces"

class StripeProviderService extends PaymentService {
  static identifier = "stripe"

  constructor(appScope, options, { customerService }) {
    super()
    console.log(options)

    this.stripe_ = Stripe(options.api_key)

    this.customerService_ = customerService
  }

  async createCustomer(customerId, email) {
    const stripeCustomer = await this.stripe_.customers.create({
      email: email,
    })

    await this.customerService_.setMetadata(
      customerId,
      "stripe_id",
      stripeCustomer.id
    )
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
    const { status } = paymentIntent

    let status = "initial"

    if (status === "requires_payment_method") {
      return status
    }

    if (status === "requires_action") {
      status = "authorized"
    }

    if (status === "succeeded") {
      status = "succeeded"
    }

    if (status === "cancelled") {
      status = "cancelled"
    }

    return status
  }

  /**
   * Creates Stripe PaymentIntent.
   * @param {string} cart - the cart to create a payment for
   * @param {number} amount - the amount to create a payment for
   * @returns {string} id of payment intent
   */
  async createPayment(cart, amount) {
    const { customer_id } = cart

    const customer = this.customerService_.retrieve(customer_id)

    if (!customer.metadata.stripe_id) {
      try {
        const stripeCustomer = await this.stripe_.customers.create({
          email: cart.email,
        })
        await this.customerService_.setMetadata(
          customer._id,
          "stripe_id",
          stripeCustomer.id
        )
      } catch (error) {
        throw error
      }
    }

    const paymentIntent = await this.stripe_.paymentIntents({
      customer: customer.metadata.stripe_id,
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
    const { provider_id } = cart.payment_method

    try {
      return this.stripe_.paymentIntents.retrieve(provider_id)
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
  async updatePayment(cart, data) {
    const { provider_id } = cart.payment_method

    try {
      const updatedIntent = this.stripe_.paymentIntents.update(
        provider_id,
        data
      )
      return updatedIntent.id
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
    // TODO: Check if we actually store it like this
    const { payment_intent_id } = paymentData
    try {
      const capturedIntent = await this.stripe_.paymentIntents.capture(
        payment_intent_id
      )
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
    // TODO: Check if we actually store it like this
    const { payment_intent_id } = paymentData
    try {
      const refundedIntent = await stripe.refunds.create({
        amount,
        payment_intent: payment_intent_id,
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
    // TODO: Check if we actually store it like this
    const { payment_intent_id } = paymentData
    try {
      const cancelledIntent = await stripe.paymentIntents.cancel(
        payment_intent_id
      )
      return cancelledIntent.id
    } catch (error) {
      throw error
    }
  }

  // TODO: Investigate what should happen from a Stripe perspective
  deletePayment(paymentData) {}
}

export default StripeProviderService
