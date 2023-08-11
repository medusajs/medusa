import { TransactionBaseService } from "../interfaces/transaction-base-service"

class SystemProviderService extends TransactionBaseService {
  static identifier = "system"

  constructor(_) {
    super(_)
  }

  async createPayment(_): Promise<Record<string, unknown>> {
    return {}
  }

  async getStatus(_): Promise<string> {
    return "authorized"
  }

  async getPaymentData(_): Promise<Record<string, unknown>> {
    return {}
  }

  async authorizePayment(_): Promise<Record<string, unknown>> {
    return { data: {}, status: "authorized" }
  }

  async updatePaymentData(_): Promise<Record<string, unknown>> {
    return {}
  }

  async updatePayment(_): Promise<Record<string, unknown>> {
    return {}
  }

  async deletePayment(_): Promise<Record<string, unknown>> {
    return {}
  }

  async capturePayment(_): Promise<Record<string, unknown>> {
    return {}
  }

  async refundPayment(_): Promise<Record<string, unknown>> {
    return {}
  }

  async cancelPayment(_): Promise<Record<string, unknown>> {
    return {}
  }
}

export default SystemProviderService
