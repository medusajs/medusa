import { AbstractPaymentService, PaymentSessionData } from "@medusajs/medusa"
import Stripe from "stripe"

class StripeBase extends AbstractPaymentService {
  static identifier = null

  constructor(
    {
      stripeProviderService,
      customerService,
      totalsService,
      regionService,
      manager,
    },
    options,
    paymentMethodTypes
  ) {
    super(
      {
        stripeProviderService,
        customerService,
        totalsService,
        regionService,
        manager,
      },
      options
    )
    /** @private @const {string[]} */
    this.paymentMethodTypes_ = paymentMethodTypes

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

    /** @private @const {EntityManager} */
    this.manager_ = manager
  }

  getPaymentIntentOptions() {
    const options = {}

    if (this?.paymentIntentOptions?.capture_method) {
      options.capture_method = this.paymentIntentOptions.capture_method
    }

    if (this?.paymentIntentOptions?.setup_future_usage) {
      options.setup_future_usage = this.paymentIntentOptions.setup_future_usage
    }

    if (this?.paymentIntentOptions?.payment_method_types) {
      options.payment_method_types =
        this.paymentIntentOptions.payment_method_types
    }

    return options
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
    return []
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
    return await this.stripeProviderService_
      .withTransaction(this.manager_)
      .createCustomer(customer)
  }

  /**
   * Creates a Stripe payment intent.
   * If customer is not registered in Stripe, we do so.
   * @param {Cart} cart - cart to create a payment for
   * @return {Promise<PaymentSessionData>} Stripe payment intent
   */
  async createPayment(cart) {
    const intentRequest = this.getPaymentIntentOptions()

    return await this.stripeProviderService_.createPayment(cart, intentRequest)
  }

  async createPaymentNew(paymentInput) {
    const intentRequest = this.getPaymentIntentOptions()

    return await this.stripeProviderService_.createPaymentNew(
      paymentInput,
      intentRequest
    )
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
    return await this.stripeProviderService_.updatePayment(
      paymentSessionData,
      cart
    )
  }

  async updatePaymentNew(paymentSessionData, paymentInput) {
    return await this.stripeProviderService_.updatePaymentNew(
      paymentSessionData,
      paymentInput
    )
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

export default StripeBase
