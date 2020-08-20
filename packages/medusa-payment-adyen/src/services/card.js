import _ from "lodash"
import { PaymentService } from "medusa-interfaces"

class CardAdyenService extends PaymentService {
  static identifier = "schemeAdyen"

  constructor({ adyenService }) {
    super()

    this.adyenService_ = adyenService
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

  async createPayment(_) {
    return {}
  }

  async authorizePayment(cart, paymentMethod) {
    return this.adyenService_.authorizePayment(cart, paymentMethod)
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
    try {
      return this.adyenService_.capturePayment(data)
    } catch (error) {
      throw error
    }
  }

  async refundPayment(data) {
    try {
      return this.adyenService_.refundPayment(data)
    } catch (error) {
      throw error
    }
  }

  async cancelPayment(data) {
    try {
      return this.adyenService_.cancelPayment(data)
    } catch (error) {
      throw error
    }
  }
}

export default CardAdyenService
