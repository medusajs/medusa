import axios from "axios"
import _ from "lodash"
import { hmacValidator } from "@adyen/api-library"
import { AbstractPaymentService, PaymentSessionStatus } from "@medusajs/medusa"
import { Client, Config, CheckoutAPI } from "@adyen/api-library"

class AdyenService extends AbstractPaymentService {
  constructor({ cartService }, options) {
    super({ cartService }, options)

    /** @private @constant {CartService} */
    this.cartService_ = cartService

    /**
     * {
     *    api_key: "",
     *    notification_hmac: "",
     *    return_url: "",
     *    merchant_account: "",
     *    origin: "",
     *    environment: "",
     *    live_endpoint_prefix: "",
     *    payment_endpoint: ""
     * }
     */
    this.options_ = options

    /** @private @constant {AxiosClient} */
    this.adyenClient_ = this.initAdyenClient()

    /** @private @constant {AxiosClient} */
    this.adyenPaymentApi = this.initPaymentClient()
  }

  getOptions() {
    return this.options_
  }

  initAdyenClient() {
    const config = new Config()
    config.apiKey = this.options_.api_key
    config.merchantAccount = this.options_.merchant_account

    const client = new Client({
      config,
    })

    if (this.options_.live_endpoint_prefix) {
      client.setEnvironment(
        this.options_.environment,
        this.options_.live_endpoint_prefix
      )
    } else {
      client.setEnvironment(this.options_.environment)
    }

    return client
  }

  initPaymentClient() {
    return axios.create({
      baseURL:
        this.options_.payment_endpoint || "https://checkout-test.adyen.com/v67",
      headers: {
        "Content-Type": "application/json",
        "x-API-key": this.options_.api_key,
      },
    })
  }

  /**
   * Validates an Adyen webhook notification
   * @param {object} notification - notification to validate
   * @return {string} the status of the payment
   */
  validateNotification(notification) {
    const validator = new hmacValidator()

    const validated = validator.validateHMAC(
      notification,
      this.options_.notification_hmac
    )

    return validated
  }

  /**
   * Retrieve stored payment methods from Adyen.
   * @param {Customer} customer - customer to retrieve methods for
   * @return {Promise} result containing the stored payment methods from Adyen
   */
  async retrieveSavedMethods(customer) {
    const request = {
      merchantAccount: this.options_.merchant_account,
      channel: "Web",
      shopperReference: customer.id,
    }

    try {
      const checkout = new CheckoutAPI(this.adyenClient_)
      const methods = await checkout.paymentMethods(request)
      return methods.storedPaymentMethods || []
    } catch (error) {
      throw error
    }
  }

  /**
   * Retrieve payment methods from Adyen.
   * @param {string[]} allowedMethods - the allowed methods based on region
   * @param {number} total - total amount to be paid with payment methods
   * @param {string} currency - currency code to use for the payment
   * @param {string} customerId - id of the customer paying
   * @return {Promise} result containing the payment methods from Adyen
   */
  async retrievePaymentMethods(allowedMethods, total, currency, customerId) {
    const request = {
      allowedPaymentMethods: allowedMethods,
      amount: {
        value: total,
        currency: currency,
      },
      merchantAccount: this.options_.merchant_account,
      channel: "Web",
      shopperReference: customerId,
    }

    try {
      const checkout = new CheckoutAPI(this.adyenClient_)
      return checkout.paymentMethods(request)
    } catch (error) {
      throw error
    }
  }

  /**
   * Status for Adyen payment.
   * @param {Record<string, unknown>} paymentData - payment method data from cart
   * @return {Promise<PaymentSessionStatus>} the status of the payment
   */
  async getStatus(paymentData) {
    const { resultCode } = paymentData
    let status = PaymentSessionStatus.PENDING

    if (resultCode === "Pending") {
      return status
    }

    if (resultCode === "Refused") {
      return status
    }

    if (resultCode === "Error") {
      status = PaymentSessionStatus.ERROR
    }

    if (resultCode === "Authorised") {
      status = PaymentSessionStatus.AUTHORIZED
    }

    if (resultCode === "Canceled") {
      status = PaymentSessionStatus.CANCELED
    }

    if (resultCode === "ChallengeShopper") {
      status = PaymentSessionStatus.REQUIRES_MORE
    }

    if (resultCode === "RedirectShopper") {
      status = PaymentSessionStatus.REQUIRES_MORE
    }

    if (resultCode === "IdentifyShopper") {
      status = PaymentSessionStatus.REQUIRES_MORE
    }

    return status
  }

  /**
   * Creates Adyen payment object.
   * @param {Cart} cart - cart to initiate payment for
   * @return {Promise<PaymentSessionData>} empty payment data
   */
  async createPayment(cart) {
    return { cart_id: cart.id }
  }

  /**
   * Retrieves Adyen payment. This is not supported by adyen, so we simply
   * return the current payment method data
   * @param {PaymentSession} paymentSession - payment session
   * @return {Promise<PaymentData>} payment method data
   */
  async getPaymentData(paymentSession) {
    return { ...paymentSession.data }
  }

  /**
   * Retrieves Adyen payment. This is not supported by adyen, so we simply
   * return the current payment method data
   * @param {object} sessionData - the data of the payment to retrieve
   * @return {Promise<object>} Stripe payment intent
   */
  async retrieve(sessionData) {
    return sessionData
  }

  /**
   * Creates and authorizes an Adyen payment.
   * Requires cart_id in context for authorization.
   * Return status of authorization result.
   * @param {PaymentSession} session - payment session data
   * @param {Data} context - properties relevant to current context
   * @return {Promise<{ status: string, data: object }>} result with data and status
   */
  async authorizePayment(session, context) {
    const sessionData = session.data

    const status = await this.getStatus(sessionData)

    if (sessionData.resultCode === "RedirectShopper") {
      return { data: sessionData, status: "requires_more" }
    }

    // If session data is present, we already called authorize once.
    // Therefore, this is most likely a call for getting additional details
    if (status === "requires_more") {
      const updated = await this.updatePaymentData(sessionData, {
        details: sessionData.details,
        paymentData: sessionData.paymentData,
      })

      return { data: updated, status: await this.getStatus(updated) }
    }

    if (status === "authorized") {
      return { data: sessionData, status: "authorized" }
    }

    const cart = await this.cartService_.retrieve(session.cart_id, {
      select: ["total"],
      relations: ["region", "shipping_address"],
    })

    const amount = {
      currency: cart.region.currency_code.toUpperCase(),
      value: cart.total,
    }

    let paymentData = sessionData.paymentData
    if (!paymentData) {
      paymentData = {
        paymentMethod: {
          type: sessionData.type,
        },
      }
    }

    const request = {
      amount,
      merchantAccount: this.options_.merchant_account,
      shopperIP: context.ip_address || "",
      shopperReference: cart.customer_id,
      returnUrl: this.options_.return_url,
      paymentMethod: paymentData.paymentMethod,
      reference: cart.id,
      metadata: {
        cart_id: cart.id,
      },
    }

    const checkout = new CheckoutAPI(this.adyenClient_)

    try {
      const authorizedPayment = await checkout.payments(request, {
        idempotencyKey: context.idempotency_key || "",
      })

      return {
        data: authorizedPayment,
        status: await this.getStatus(authorizedPayment),
      }
    } catch (error) {
      throw error
    }
  }

  async updatePaymentData(sessionData, update) {
    if (_.isEmpty(update.details)) {
      return { ...sessionData, ...update }
    }

    const checkout = new CheckoutAPI(this.adyenClient_)
    return await checkout.paymentsDetails(update)
  }

  /**
   * Updates an Adyen payment.
   * @param {PaymentSessionData} paymentSessionData - payment data to update
   * @param {Cart} cart
   * @return {Promise<PaymentSessionData>} result of the update operation
   */
  async updatePayment(paymentSessionData, cart) {
    return paymentSessionData
  }

  /**
   * Additional details
   * @param {object} paymentData - payment data
   * @param {object} details - payment details
   * @return {Promise} current payment result
   */
  async additionalDetails(paymentData, details) {
    const request = {
      paymentData,
      details,
    }

    const checkout = new CheckoutAPI(this.adyenClient_)
    return checkout.paymentsDetails(request)
  }

  /**
   * Captures an Adyen payment
   * @param {Payment} payment - payment to capture
   * @return {Promise<PaymentData>} status = processing_captures
   */
  async capturePayment(payment) {
    if (payment.captured_at !== null) {
      return
    }

    const { pspReference, merchantReference } = payment.data
    const { amount, currency_code } = payment

    try {
      const captured = await this.adyenPaymentApi.post(
        `/payments/${pspReference}/captures`,
        {
          merchantAccount: this.options_.merchant_account,
          amount: {
            value: amount,
            currency: currency_code.toUpperCase(),
          },
          reference: merchantReference,
        }
      )

      if (captured.data.pspReference && captured.data.status !== "received") {
        throw new MedusaError(
          MedusaError.Types.INVALID_ARGUMENT,
          "Could not process capture"
        )
      }

      return { pspReference }
    } catch (error) {
      throw error
    }
  }

  /**
   * Refunds an Adyen payment
   * @param {Payment} payment - payment to refund
   * @param {number} amountToRefund - amount to refund
   * @param {Promise<PaymentData>} payment data result of refund
   */
  async refundPayment(payment, amountToRefund) {
    const { pspReference } = payment.data
    const { currency_code } = payment

    const refundAmount = {
      currency: currency_code.toUpperCase(),
      value: amountToRefund,
    }

    try {
      await this.adyenPaymentApi.post(`/payments/${pspReference}/refunds`, {
        merchantAccount: this.options_.merchant_account,
        amount: refundAmount,
      })

      return { pspReference }
    } catch (error) {
      throw error
    }
  }

  /**
   * Adyen does not have a way of deleting payments, hence the empty impl.
   */
  async deletePayment(_) {
    return {}
  }

  /**
   * Cancels an Adyen payment.
   * @param {Payment} payment - payment to cancel
   * @return {Promise<PaymentData>} payment data result of cancel
   */
  async cancelPayment(payment) {
    const { pspReference } = payment.data

    try {
      return this.adyenPaymentApi.post("/cancel", {
        originalReference: pspReference,
        merchantAccount: this.options_.merchant_account,
      })
    } catch (error) {
      throw error
    }
  }
}

export default AdyenService
