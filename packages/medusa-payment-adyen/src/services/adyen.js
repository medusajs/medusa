import axios from "axios"
import _ from "lodash"
import { hmacValidator } from "@adyen/api-library"
import { BaseService } from "medusa-interfaces"
import { Client, Config, CheckoutAPI } from "@adyen/api-library"

class AdyenService extends BaseService {
  constructor({ regionService, totalsService }, options) {
    super()

    /** @private @constant {RegionService} */
    this.regionService_ = regionService

    /** @private @constant {CartService} */
    this.cartService_ = cartService

    /** @private @constant {TotalsService} */
    this.totalsService_ = totalsService

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

    /** @private @constant {AdyenClient} */
    this.adyenPaymentApi = this.initPaymentClient()
  }

  getOptions() {
    return this.options_
  }

  initPaymentClient() {
    return axios.create({
      baseURL: this.options_.payment_endpoint,
      headers: {
        "Content-Type": "application/json",
        "x-API-key": this.options_.api_key,
      },
    })
  }

  initAdyenClient() {
    const config = new Config()
    config.apiKey = this.options_.api_key
    config.merchantAccount = this.options_.merchant_account

    const client = new Client({
      config,
    })

    client.setEnvironment(
      this.options_.environment,
      this.options_.live_endpoint_prefix
    )

    return client
  }

  /**
   * Validates an Adyen webhook notification
   * @param {Object} notification - notification to validate
   * @returns {string} the status of the payment
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
   * @returns {Promise} result containing the stored payment methods from Adyen
   */
  async retrieveSavedMethods(customer) {
    let request = {
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
   * @returns {Promise} result containing the payment methods from Adyen
   */
  async retrievePaymentMethods(allowedMethods, total, currency, customerId) {
    let request = {
      allowedPaymentMethods: allowedMethods,
      amount: {
        value: total * 100,
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
   * @param {Object} paymentData - payment method data from cart
   * @returns {string} the status of the payment
   */
  async getStatus(paymentData) {
    const { resultCode } = paymentData
    let status = "pending"

    if (resultCode === "Pending") {
      return status
    }

    if (resultCode === "Refused") {
      return status
    }

    if (resultCode === "Error") {
      status = "error"
    }

    if (resultCode === "Authorised") {
      status = "authorized"
    }

    if (resultCode === "Canceled") {
      status = "canceled"
    }

    if (resultCode === "ChallengeShopper") {
      status = "requires_more"
    }

    if (resultCode === "RedirectShopper") {
      status = "requires_more"
    }

    if (resultCode === "IdentifyShopper") {
      status = "requires_more"
    }

    return status
  }

  /**
   * Creates Adyen payment object.
   * @param {any} _ - placeholder object
   * @returns {Object} empty payment data
   */
  async createPayment(_) {
    return {}
  }

  /**
   * Retrieves Adyen payment. This is not supported by adyen, so we simply
   * return the current payment method data
   * @param {any} _ - placeholder object
   * @returns {Object} payment method data
   */
  async retrievePayment(data) {
    return data
  }

  /**
   * Updates an Adyen payment.
   * @param {Object} paymentData - payment data to update
   * @param {details} details - details to update
   * @returns {Promise} result of the update operation
   */
  async updatePayment(paymentData, details) {
    const request = {
      paymentData,
      details,
    }

    const checkout = new CheckoutAPI(this.adyenClient_)
    return checkout.paymentsDetails(request)
  }

  /**
   * Creates and authorizes an Adyen payment
   * @param {Cart} cart - cart to authorize payment for
   * @param {Object} paymentData - method used for the payment
   * @param {Object} context - properties relevant to current context
   * @returns {Promise} result of the payment authorization
   */
  async authorizePayment(cartObj, paymentData, context) {
    const cart = await this.cartService_.retrieve(cartObj)
    const total = await this.totalsService_.getTotal(cart)

    const amount = {
      currency: cart.region.currency_code,
      value: total * 100,
    }

    let request = {
      amount,
      shopperIP: context.ip_address || "",
      shopperReference: cart.customer_id,
      paymentMethod: paymentData.data.paymentMethod,
      reference: cart.id,
      merchantAccount: this.options_.merchant_account,
      returnUrl: this.options_.return_url,
      origin: this.options_.origin,
      channel: "Web",
      redirectFromIssuerMethod: "GET",
      browserInfo: paymentData.data.browserInfo || {},
      billingAddress: {
        city: cart.shipping_address.city,
        country: cart.shipping_address.country_code,
        houseNumberOrName: cart.shipping_address.address_2 || "",
        postalCode: cart.shipping_address.postal_code,
        stateOrProvice: cart.shipping_address.province || "",
        street: cart.shipping_address.address_1,
      },
      metadata: {
        cart_id: cart.id,
      },
    }

    // If customer chose to save the payment method
    if (paymentData.data.storePaymentMethod) {
      request.storePaymentMethod = "true"
      request.shopperInteraction = "Ecommerce"
      request.recurringProcessingModel = "CardOnFile"
    }

    const checkout = new CheckoutAPI(this.adyenClient_, {
      idempotencyKey: context.idempotency_key || "",
    })

    try {
      return checkout.payments(request)
    } catch (error) {
      throw error
    }
  }

  /**
   * Checks payment result
   * @param {Object} paymentData - payment data to check status for
   * @param {Object} payload - payload needed for checking the status
   * @returns {Promise} current payment result
   */
  async checkPaymentResult(paymentData, payload) {
    const request = {
      paymentData,
      details: {
        payload,
      },
    }
    const checkout = new CheckoutAPI(this.adyenClient_)
    return checkout.paymentsDetails(request)
  }

  /**
   * Additional details
   * @param {Object} paymentData - payment data
   * @param {Object} details - payment details
   * @returns {Promise} current payment result
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
   * @param {Object} data - payment data to capture
   * @returns {string} status = processing_captures
   */
  async capturePayment(data) {
    const { pspReference, amount, merchantReference } = data

    try {
      const captured = await this.adyenPaymentApi.post("/capture", {
        originalReference: pspReference,
        modificationAmount: amount,
        merchantAccount: this.options_.merchant_account,
        reference: merchantReference,
      })

      if (
        captured.data.pspReference &&
        captured.data.response !== "[capture-received]"
      ) {
        throw new MedusaError(
          MedusaError.Types.INVALID_ARGUMENT,
          "Could not process capture"
        )
      }

      return "processing_capture"
    } catch (error) {
      throw error
    }
  }

  /**
   * Refunds an Adyen payment
   * @param {Object} paymentData - payment data to refund
   * @param {number} amountToRefund - amount to refund
   * @returns {Object} payment data result of refund
   */
  async refundPayment(data, amountToRefund) {
    const { originalReference, amount, merchantReference } = data

    const refundAmount = {
      currency: amount.currency,
      value: amountToRefund * 100,
    }

    try {
      await this.adyenPaymentApi.post("/refund", {
        originalReference,
        merchantAccount: this.options_.merchant_account,
        modificationAmount: refundAmount,
        reference: merchantReference,
      })
      return "processing_refund"
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
   * @param {Object} paymentData - payment data to cancel
   * @returns {Object} payment data result of cancel
   */
  async cancelPayment(paymentData) {
    const { pspReference } = paymentData

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
