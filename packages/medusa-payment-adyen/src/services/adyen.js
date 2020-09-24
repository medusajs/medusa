import axios from "axios"
import _ from "lodash"
import { hmacValidator } from "@adyen/api-library"
import { BaseService } from "medusa-interfaces"
import { Client, Config, CheckoutAPI } from "@adyen/api-library"

class AdyenService extends BaseService {
  constructor({ regionService, totalsService }, options) {
    super()

    this.regionService_ = regionService

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

    this.adyenClient_ = this.initAdyenClient()

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
   * Retrieve stored payment methods from Ayden.
   * @param {Customer} customer - customer to retrieve methods for
   * @returns {Promise} result containing the stored payment methods from Adyen
   */
  async retrieveSavedMethods(customer) {
    let request = {
      merchantAccount: this.options_.merchant_account,
      channel: "Web",
      shopperReference: customer._id,
    }

    try {
      const checkout = new CheckoutAPI(this.adyenClient_)
      return checkout.paymentMethods(request)
    } catch (error) {
      throw error
    }
  }

  /**
   * Retrieve payment methods from Ayden.
   * @param {Cart} cart - cart to retrieve payment methods for
   * @param {[string]} allowedMethods - the allowed methods based on region
   * @param {number} total - the total amount to be paid with payment methods
   * @param {string} currency - the currency code to use for the payment
   * @returns {Promise} result containing the payment methods from Adyen
   */
  async retrievePaymentMethods(allowedMethods, total, currency) {
    let request = {
      allowedPaymentMethods: allowedMethods,
      amount: {
        value: total * 100,
        currency: currency,
      },
      merchantAccount: this.options_.merchant_account,
      channel: "Web",
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
  async getStatus(_) {
    let status = "initial"
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
   * Creates and authorizes an Ayden payment
   * @param {Cart} cart - cart to authorize payment for
   * @param {Object} paymentMethod - method used for the payment
   * @param {Object} amount - object containing currency and value
   * @returns {Promise} result of the payment authorization
   */
  async authorizePayment(cart, paymentMethod, amount, shopperIp) {
    let request = {
      amount,
      shopperIp,
      shopperReference: cart.customer_id,
      paymentMethod: paymentMethod.data.paymentMethod,
      reference: cart._id,
      merchantAccount: this.options_.merchant_account,
      returnUrl: this.options_.return_url,
      origin: this.options_.origin,
      channel: "Web",
      additionalData: {
        allow3DS2: true,
      },
      browserInfo: paymentMethod.data.browserInfo || {},
      billingAddress: {
        city: cart.shipping_address.city,
        country: cart.shipping_address.country_code,
        houseNumberOrName: cart.shipping_address.address_2 || "",
        postalCode: cart.shipping_address.postal_code,
        stateOrProvice: cart.shipping_address.province || "",
        street: cart.shipping_address.address_1,
      },
      metadata: {
        cart_id: cart._id,
      },
    }

    if (paymentMethod.data.storePaymentMethod) {
      request.storePaymentMethod = "true"
      request.shopperInteraction = "Ecommerce"
      request.recurringProcessingModel = "CardOnFile"
    }

    const checkout = new CheckoutAPI(this.adyenClient_)
    return checkout.payments(request)
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
   * Captures an Ayden payment
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
   * Refunds an Ayden payment
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
   * Cancels an Ayden payment
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

  /**
   * Deletes an Ayden payment. In the context of Adyen, we cancel the payment
   * since they don't have support for deleting it.
   * @param {Object} paymentData - payment data to delete
   * @returns {Object} payment data result of delete
   */
  async deletePayment(paymentData) {
    try {
      return {}
    } catch (error) {
      throw error
    }
  }
}

export default AdyenService
