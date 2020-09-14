import axios from "axios"
import _ from "lodash"
import { hmacValidator } from "@adyen/api-library"
import { BaseService } from "medusa-interfaces"

const CHECKOUT_URL =
  process.env.ADYEN_CHECKOUT_URL || "https://checkout-test.adyen.com/v53"
const PAYMENT_URL =
  process.env.ADYEN_PAYMENT_URL ||
  "https://pal-test.adyen.com/pal/servlet/Payment/v64"

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
     *    merchant_account: ""
     * }
     */
    this.options_ = options

    this.adyenCheckoutApi = axios.create({
      baseURL: CHECKOUT_URL,
      headers: {
        "Content-Type": "application/json",
        "x-API-key": this.options_.api_key,
      },
    })

    this.adyenPaymentApi = axios.create({
      baseURL: PAYMENT_URL,
      headers: {
        "Content-Type": "application/json",
        "x-API-key": this.options_.api_key,
      },
    })
  }

  getOptions() {
    return this.options_
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
      const { data } = await this.adyenCheckoutApi.post(
        "/paymentMethods",
        request
      )
      return data.storedPaymentMethods
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
      return this.adyenCheckoutApi.post("/paymentMethods", request)
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
    return this.adyenCheckoutApi.post("/payments/details", request)
  }

  /**
   * Creates and authorizes an Ayden payment
   * @param {Cart} cart - cart to authorize payment for
   * @param {Object} paymentMethod - method used for the payment
   * @param {Object} amount - object containing currency and value
   * @returns {Promise} result of the payment authorization
   */
  async authorizePayment(cart, paymentMethod, amount, additionalOptions = {}) {
    let request = {
      amount,
      shopperReference: cart.customer_id,
      paymentMethod: paymentMethod.data.paymentMethod,
      reference: cart._id,
      merchantAccount: this.options_.merchant_account,
      returnUrl: this.options_.return_url,
      metadata: {
        cart_id: cart._id,
      },
    }

    if (paymentMethod.data.storePaymentMethod) {
      request.storePaymentMethod = "true"
      request.shopperInteraction = "Ecommerce"
      request.recurringProcessingModel = "CardOnFile"
    }

    if (paymentMethod.type === "klarna") {
      request = {
        ...request,
        ...additionalOptions,
      }
    }

    return await this.adyenCheckoutApi.post("/payments", request)
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
    return this.adyenCheckoutApi.post("/payments/details", request)
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
