import Stripe from "stripe"
import { AbstractPaymentService } from "@medusajs/medusa"
import { PaymentSessionData } from "@medusajs/medusa/src/interfaces"
import { Cart } from "@medusajs/medusa/src/models"

class BancontactProviderService extends AbstractPaymentService {
  static identifier = "stripe-bancontact"

  constructor(
    { stripeProviderService, customerService, totalsService, regionService },
    options
  ) {
    super(
      { stripeProviderService, customerService, totalsService, regionService },
      options
    )

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
   * @param {PaymentSessionData} paymentSessionData - payment method data from cart
   * @return {Promise<PaymentSessionStatus>} the status of the payment intent
   */
  async getStatus(paymentSessionData) {
    return await this.stripeProviderService_.getStatus(paymentSessionData)
  }

  /**
   * Fetches a customers saved payment methods if registered in Stripe.
   * @param {object} customer - customer to fetch saved cards for
   * @return {Promise<Data[]>} saved payments methods
   */
  async retrieveSavedMethods(customer) {
    return Promise.resolve([])
  }

  /**
   * Fetches a Stripe customer
   * @param {string} customerId - Stripe customer id
   * @return {Promise<object>} Stripe customer
   */
  async retrieveCustomer(customerId) {
    return await this.stripeProviderService_.retrieveCustomer(customerId)
  }

  /**
   * Creates a Stripe customer using a Medusa customer.
   * @param {object} customer - Customer data from Medusa
   * @return {Promise<object>} Stripe customer
   */
  async createCustomer(customer) {
    return await this.stripeProviderService_.createCustomer(customer)
  }

  /**
   * Creates a Stripe payment intent.
   * If customer is not registered in Stripe, we do so.
   * @param {Cart} cart - cart to create a payment for
   * @return {Promise<PaymentSessionData>} Stripe payment intent
   */
  async createPayment(cart) {
    const { customer_id, region_id, email } = cart
    const region = await this.regionService_.retrieve(region_id)
    const { currency_code } = region

    const amount = await this.totalsService_.getTotal(cart)

    const intentRequest = {
      amount: Math.round(amount),
      description:
        cart?.context?.payment_description ?? this.options?.payment_description,
      currency: currency_code,
      payment_method_types: ["bancontact"],
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

    return await this.stripe_.paymentIntents.create(intentRequest)
  }

  /**
   * Retrieves Stripe payment intent.
   * @param {PaymentData} paymentData - the data of the payment to retrieve
   * @return {Promise<Data>} Stripe payment intent
   */
  async retrievePayment(paymentData) {
    return await this.stripeProviderService_.retrievePayment(paymentData)
  }

  /**
   * Gets a Stripe payment intent and returns it.
   * @param {PaymentSession} paymentSession - the data of the payment to retrieve
   * @return {Promise<PaymentData>} Stripe payment intent
   */
  async getPaymentData(paymentSession) {
    return await this.stripeProviderService_.getPaymentData(paymentSession)
  }

  /**
   * Authorizes Stripe payment intent by simply returning
   * the status for the payment intent in use.
   * @param {PaymentSession} paymentSession - payment session data
   * @param {object} context - properties relevant to current context
   * @return {Promise<{data: PaymentSessionData; status: PaymentSessionStatus}>} result with data and status
   */
  async authorizePayment(paymentSession, context = {}) {
    return await this.stripeProviderService_.authorizePayment(
      paymentSession,
      context
    )
  }

  async updatePaymentData(paymentSessionData, data) {
    return await this.stripeProviderService_.updatePaymentData(
      paymentSessionData,
      data
    )
  }

  /**
   * Updates Stripe payment intent.
   * @param {PaymentSessionData} paymentSessionData - payment session data.
   * @param {Cart} cart
   * @return {Promise<PaymentSessionData>} Stripe payment intent
   */
  async updatePayment(paymentSessionData, cart) {
    try {
      const stripeId = cart.customer?.metadata?.stripe_id || undefined

      if (stripeId !== paymentSessionData.customer) {
        return this.createPayment(cart)
      } else {
        if (
          cart.total &&
          paymentSessionData.amount === Math.round(cart.total)
        ) {
          return sessionData
        }

        return this.stripe_.paymentIntents.update(paymentSessionData.id, {
          amount: Math.round(cart.total),
        })
      }
    } catch (error) {
      throw error
    }
  }

  async deletePayment(paymentSession) {
    return await this.stripeProviderService_.deletePayment(paymentSession)
  }

  /**
   * Updates customer of Stripe payment intent.
   * @param {string} paymentIntentId - id of payment intent to update
   * @param {string} customerId - id of new Stripe customer
   * @return {object} Stripe payment intent
   */
  async updatePaymentIntentCustomer(paymentIntentId, customerId) {
    return await this.stripeProviderService_.updatePaymentIntentCustomer(
      paymentIntentId,
      customerId
    )
  }

  /**
   * Captures payment for Stripe payment intent.
   * @param {Payment} payment - payment method data from cart
   * @return {Promise<PaymentData>} Stripe payment intent
   */
  async capturePayment(payment) {
    return await this.stripeProviderService_.capturePayment(payment)
  }

  /**
   * Refunds payment for Stripe payment intent.
   * @param {Payment} payment - payment method data from cart
   * @param {number} refundAmount - amount to refund
   * @return {Promise<PaymentData>} refunded payment intent
   */
  async refundPayment(payment, refundAmount) {
    return await this.stripeProviderService_.refundPayment(
      payment,
      refundAmount
    )
  }

  /**
   * Cancels payment for Stripe payment intent.
   * @param {Payment} payment - payment method data from cart
   * @return {Promise<PaymentData>} canceled payment intent
   */
  async cancelPayment(payment) {
    return await this.stripeProviderService_.cancelPayment(payment)
  }
}

export default BancontactProviderService
