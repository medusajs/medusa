import _ from "lodash"
import Stripe from "stripe"
import { PaymentService } from "medusa-interfaces"

class BlikProviderService extends PaymentService {
  static identifier = "stripe-blik"

  constructor(
    { stripeProviderService, customerService, totalsService, regionService },
    options
  ) {
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
    this.stripeProviderService_ = stripeProviderService

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
    return await this.stripeProviderService_.getStatus(paymentData)
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
   * Fetches a Stripe customer
   * @param {string} customerId - Stripe customer id
   * @returns {Promise<object>} Stripe customer
   */
  async retrieveCustomer(customerId) {
    return await this.stripeProviderService_.retrieveCustomer(customerId)
  }

  /**
   * Creates a Stripe customer using a Medusa customer.
   * @param {object} customer - Customer data from Medusa
   * @returns {Promise<object>} Stripe customer
   */
  async createCustomer(customer) {
    return await this.stripeProviderService_.createCustomer(customer)
  }

  /**
   * Creates a Stripe payment intent.
   * If customer is not registered in Stripe, we do so.
   * @param {object} cart - cart to create a payment for
   * @returns {object} Stripe payment intent
   */
  async createPayment(cart) {
    const { customer_id, region_id, email } = cart
    const region = await this.regionService_.retrieve(region_id)
    const { currency_code } = region

    const amount = await this.totalsService_.getTotal(cart)

    const intentRequest = {
      amount: Math.round(amount),
      currency: currency_code,
      payment_method_types: ["blik"],
      capture_method: "automatic",
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

    const paymentIntent = await this.stripe_.paymentIntents.create(
      intentRequest
    )

    return paymentIntent
  }

  /**
   * Retrieves Stripe payment intent.
   * @param {object} data - the data of the payment to retrieve
   * @returns {Promise<object>} Stripe payment intent
   */
  async retrievePayment(data) {
    return await this.stripeProviderService_.retrievePayment(data)
  }

  /**
   * Gets a Stripe payment intent and returns it.
   * @param {object} sessionData - the data of the payment to retrieve
   * @returns {Promise<object>} Stripe payment intent
   */
  async getPaymentData(sessionData) {
    return await this.stripeProviderService_.getPaymentData(sessionData)
  }

  /**
   * Authorizes Stripe payment intent by simply returning
   * the status for the payment intent in use.
   * @param {object} sessionData - payment session data
   * @param {object} context - properties relevant to current context
   * @returns {Promise<{ status: string, data: object }>} result with data and status
   */
  async authorizePayment(sessionData, context = {}) {
    return await this.stripeProviderService_.authorizePayment(
      sessionData,
      context
    )
  }

  async updatePaymentData(sessionData, update) {
    return await this.stripeProviderService_.updatePaymentData(
      sessionData,
      update
    )
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
    return await this.stripeProviderService_.deletePayment(payment)
  }

  /**
   * Updates customer of Stripe payment intent.
   * @param {string} paymentIntentId - id of payment intent to update
   * @param {string} customerId - id of new Stripe customer
   * @returns {object} Stripe payment intent
   */
  async updatePaymentIntentCustomer(paymentIntentId, customerId) {
    return await this.stripeProviderService_.updatePaymentIntentCustomer(
      paymentIntentId,
      customerId
    )
  }

  /**
   * Captures payment for Stripe payment intent.
   * @param {object} paymentData - payment method data from cart
   * @returns {object} Stripe payment intent
   */
  async capturePayment(payment) {
    return await this.stripeProviderService_.capturePayment(payment)
  }

  /**
   * Refunds payment for Stripe payment intent.
   * @param {object} paymentData - payment method data from cart
   * @param {number} amountToRefund - amount to refund
   * @returns {string} refunded payment intent
   */
  async refundPayment(payment, amountToRefund) {
    return await this.stripeProviderService_.refundPayment(
      payment,
      amountToRefund
    )
  }

  /**
   * Cancels payment for Stripe payment intent.
   * @param {object} paymentData - payment method data from cart
   * @returns {object} canceled payment intent
   */
  async cancelPayment(payment) {
    return await this.stripeProviderService_.cancelPayment(payment)
  }
}

export default BlikProviderService
