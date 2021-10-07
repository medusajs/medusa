import axios from "axios"
import { PaymentService } from "medusa-interfaces"

class ShopifyProviderService extends PaymentService {
  static identifier = "shopify"

  constructor({ manager, paymentRepository }) {
    super()

    /** @private @const {EntityManager} */
    this.manager_ = manager
    /** @private @const {PaymentRepository} */
    this.paymentRepository_ = paymentRepository
  }

  withTransaction(transactionManager) {
    if (!transactionManager) {
      return this
    }

    const cloned = new ShopifyProviderService({
      manager: transactionManager,
      paymentRepository: this.paymentRepository_,
    })

    cloned.transactionManager_ = transactionManager

    return cloned
  }

  async createPayment(payment) {
    return this.atomicPhase_(async (manager) => {
      const paymentRepo = manager.getCustomRepository(this.paymentRepository_)

      let captured_at

      if (payment.status === "success") {
        captured_at = new Date(payment.processed_at).toISOString()
      }

      const created = paymentRepo.create({
        provider_id: "shopify",
        amount: payment.total,
        currency_code: payment.currency_code,
        data: payment.data,
        order_id: payment.order_id,
        captured_at: captured_at,
      })

      return paymentRepo.save(created)
    })
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
