import _ from "lodash"
import { PaymentService } from "medusa-interfaces"

class GooglePayAdyenService extends PaymentService {
  static identifier = "paywithgoogle-adyen"

  constructor({ adyenService }) {
    super()

    this.adyenService_ = adyenService
  }

  async getStatus(paymentData) {
    return this.adyenService_.getStatus(paymentData)
  }

  async createPayment(data) {
    return this.adyenService_.createPayment(data)
  }

  async authorizePayment(sessionData, context) {
    return this.adyenService_.authorizePayment(sessionData, context)
  }

  async retrievePayment(data) {
    return this.adyenService_.retrievePayment(data)
  }

  async updatePayment(data, _) {
    return this.adyenService_.updatePayment(data)
  }

  async updatePaymentData(sessionData, update) {
    return this.adyenService_.updatePaymentData(sessionData, update)
  }

  async getPaymentData(data) {
    return this.adyenService_.getPaymentData(data)
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
