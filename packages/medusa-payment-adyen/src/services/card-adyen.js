import _ from "lodash"
import { PaymentService } from "medusa-interfaces"

class CardAdyenService extends PaymentService {
  static identifier = "scheme-adyen"

  constructor({ adyenService }) {
    super()

    this.adyenService_ = adyenService
  }

  async retrieveSavedMethods(customer) {
    return this.adyenService_.retrieveSavedMethods(customer)
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

  async authorizePayment(cart, data, context) {
    return this.adyenService_.authorizePayment(cart, data, context)
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

export default CardAdyenService
