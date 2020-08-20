import axios from "axios"
import _ from "lodash"
import { hmacValidator } from "@adyen/api-library"
import { BaseService } from "medusa-interfaces"

class AdyenService extends BaseService {
  constructor({ regionService, cartService, totalsService }, options) {
    super()

    this.regionService_ = regionService

    this.cartService_ = cartService

    this.totalsService_ = totalsService

    this.options_ = options

    this.adyenCheckoutApi = axios.create({
      baseURL: "https://checkout-test.adyen.com/v53",
      headers: {
        "Content-Type": "application/json",
        "x-API-key": this.options_.api_key,
      },
    })

    this.adyenPaymentApi = axios.create({
      baseURL: "https://pal-test.adyen.com/pal/servlet/Payment/v53",
      headers: {
        "Content-Type": "application/json",
        "x-API-key": this.options_.api_key,
      },
    })
  }

  getOptions() {
    return this.options_
  }

  validateNotification(event) {
    const validator = new hmacValidator()
    const validated = validator.validateHMAC(
      event,
      this.options_.notification_hmac
    )
    return validated
  }

  /**
   * Retrieve payment methods from Ayden using country as filter.
   * @param {string} countryCode - country code of cart
   * @param {string} shopperLocale - locale used on website
   * @returns {string} the status of the payment
   */
  async retrievePaymentMethods(cart, allowedMethods, total, currency) {
    let request = {
      allowedPaymentMethods: allowedMethods,
      amount: {
        value: total * 100,
        currency: currency,
      },
      merchantAccount: this.options_.merchant_account,
      channel: this.options_.channel,
    }

    if (cart.customer_id) {
      request.shopperReference = cart.customer_id
    }

    try {
      return await this.adyenCheckoutApi.post("/paymentMethods", request)
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

  async retrievePayment(data) {
    return data
  }

  async updatePayment(paymentData, details) {
    const request = {
      paymentData,
      details,
    }
    return this.adyenCheckoutApi.post("/payments/details", request)
  }

  /**
   * Creates and authorizes an Ayden payment
   * @returns {Object} payment data result
   */
  async authorizePayment(cart, paymentMethod) {
    const region = await this.regionService_.retrieve(cart.region_id)
    const total = await this.totalsService_.getTotal(cart)

    let request = {
      amount: {
        currency: region.currency_code,
        value: total * 100,
      },
      shopperReference: cart.customer_id,
      paymentMethod,
      reference: cart._id,
      merchantAccount: this.options_.merchant_account,
      returnUrl: this.options_.return_url,
      metadata: {
        cart_id: cart._id,
      },
    }

    if (paymentMethod.storedPaymentMethodId) {
      request.shopperInteraction = "Ecommerce"
      request.recurringProcessingModel = "CardOnFile"
    }

    return await this.adyenCheckoutApi.post("/payments", request)
  }

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
   * @returns {Object} payment data result of capture
   */
  async capturePayment(data) {
    const { pspReference, amount } = data

    try {
      const captured = this.adyenPaymentApi.post("/capture", {
        originalReference: pspReference,
        modificationAmount: amount,
        merchantAccount: this.options_.merchant_account,
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

      return captured
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  /**
   * Refunds an Ayden payment
   * @param {Object} paymentData - payment data to refund
   * @param {number} amountToRefund - amount to refund
   * @returns {Object} payment data result of refund
   */
  async refundPayment(data) {
    const { pspReference, amount } = data

    try {
      return this.adyenPaymentApi.post("/capture", {
        originalReference: pspReference,
        merchantAccount: this.options_.merchant_account,
        modificationAmount: amount,
      })
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
      return this.adyenPaymentApi.post("/capture", {
        originalReference: pspReference,
        merchantAccount: this.options_.merchant_account,
      })
    } catch (error) {
      throw error
    }
  }
}

export default AdyenService
