import axios from "axios"
import { PaymentService } from "medusa-interfaces"

class ShopifyProviderService extends PaymentService {
  static identifier = "shopify"

  constructor({}) {
    super()
  }

  async createPayment(_) {
    return {}
  }

  async getStatus(_) {
    return "authorized"
  }

  async getPaymentData(_) {
    return {}
  }

  async authorizePayment(_) {
    return { data: {}, status: "authorized" }
  }

  async updatePaymentData(_) {
    return {}
  }

  async updatePayment(_) {
    return {}
  }

  async deletePayment(_) {
    return {}
  }

  async capturePayment(_) {
    return {}
  }

  async refundPayment(payment, refundAmount) {
    return payment.data
  }

  async cancelPayment(_) {
    return {}
  }
}

export default ShopifyProviderService
