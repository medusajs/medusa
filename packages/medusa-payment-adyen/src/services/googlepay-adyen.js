import _ from "lodash"
import { PaymentService } from "medusa-interfaces"

class GooglePayAdyenService extends PaymentService {
  static identifier = "paywithgoogle-adyen"

  constructor({ adyenService, shippingProfileService }) {
    super()

    this.adyenService_ = adyenService

    this.shippingProfileService_ = shippingProfileService
  }

  /**
   * Status for Adyen payment.
   * @param {Object} paymentData - payment method data from cart
   * @returns {string} the status of the payment
   */
  async getStatus(paymentData) {
    const { resultCode } = paymentData
    let status = "initial"

    if (resultCode === "Authorised") {
      status = "authorized"
    }

    return status
  }

  async createPayment(cart) {
    const shippingOptions = await this.shippingProfileService_.fetchCartOptions(
      cart
    )
    return {
      shipping_options: shippingOptions,
    }
  }

  async authorizePayment(cart, paymentMethod, amount) {
    return this.adyenService_.authorizePayment(cart, paymentMethod, amount)
  }

  async retrievePayment(data) {
    return this.adyenService_.retrievePayment(data)
  }

  async updatePayment(data, _) {
    return this.adyenService_.updatePayment(data)
  }

  async deletePayment(data) {
    return this.adyenService_.deletePayment(data)
  }

  async capturePayment(data) {
    return this.adyenService_.capturePayment(data)
  }

  async refundPayment(data, amountToRefund) {
    return this.adyenService_.refundPayment(data, amountToRefund)
  }

  async cancelPayment(data) {
    return this.adyenService_.cancelPayment(data)
  }
}

export default GooglePayAdyenService
