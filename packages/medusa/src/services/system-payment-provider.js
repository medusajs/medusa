import { TransactionBaseService } from "../interfaces"

class SystemProviderService extends TransactionBaseService {
  static identifier = "system"

  constructor(_) {
    super(_)
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

  async refundPayment(_) {
    return {}
  }

  async cancelPayment(_) {
    return {}
  }
}

export default SystemProviderService
