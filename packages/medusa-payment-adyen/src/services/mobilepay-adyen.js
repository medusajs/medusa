import { PaymentService } from "@medusa/medusa"

class MobilePayAdyenService extends PaymentService {
  static identifier = "mobilepay-adyen"

  constructor({ adyenService }) {
    super()

    this.adyenService_ = adyenService
  }

  async getStatus(paymentSessionData) {
    return await this.adyenService_.getStatus(paymentSessionData)
  }

  async createPaymentSession(cart) {
    const raw = await this.adyenService_.createPaymentSession(cart)
    raw.type = "mobilepay"
    return raw
  }

  async authorizePayment(paymentSessionData, context) {
    return await this.adyenService_.authorizePayment(paymentSessionData, context)
  }

  async retrievePayment(paymentData) {
    // TODO: This method does not exists on adyenService
    return this.adyenService_.retrievePayment(paymentData)
  }

  async updatePayment(paymentSessionData, _) {
    return await this.adyenService_.updatePayment(paymentSessionData)
  }

  async updatePaymentData(paymentSessionData, data) {
    return await this.adyenService_.updatePaymentData(paymentSessionData, data)
  }

  async getPaymentData(paymentSession) {
    return await this.adyenService_.getPaymentData(paymentSession)
  }

  async deletePayment(paymentSession) {
    return await this.adyenService_.deletePayment(paymentSession)
  }

  async capturePayment(payment) {
    return await this.adyenService_.capturePayment(payment)
  }

  async refundPayment(payment, amountToRefund) {
    return await this.adyenService_.refundPayment(payment, amountToRefund)
  }

  async cancelPayment(payment) {
    return await this.adyenService_.cancelPayment(payment)
  }
}

export default MobilePayAdyenService
