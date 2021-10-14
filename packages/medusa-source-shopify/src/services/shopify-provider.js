import { PaymentService } from "medusa-interfaces"

class ShopifyProviderService extends PaymentService {
  static identifier = "shopify"

  constructor(
    {
      manager,
      shopifyClientService,
      orderService,
      returnService,
      paymentRepository,
    },
    options
  ) {
    super()

    /** @private @const {EntityManager} */
    this.manager_ = manager

    this.options_ = options

    this.shopify_ = shopifyClientService

    this.orderService_ = orderService

    this.returnService_ = returnService

    /** @private @const {PaymentRepository} */
    this.paymentRepository_ = paymentRepository
  }

  withTransaction(transactionManager) {
    if (!transactionManager) {
      return this
    }

    const cloned = new ShopifyProviderService(
      {
        manager: transactionManager,
        shopifyClientService: this.shopify_,
        orderService: this.orderService_,
        returnService: this.returnService_,
        paymentRepository: this.paymentRepository_,
      },
      this.options_
    )

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

  async updatePayment(paymentId, update) {
    return {}
  }

  async deletePayment(paymentId) {
    return this.atomicPhase_(async (manager) => {
      const paymentRepo = manager.getCustomRepository(this.paymentRepository_)

      try {
        return await paymentRepo.softRemove(paymentId)
      } catch (_err) {
        return Promise.resolve()
      }
    })
  }

  async capturePayment(paymentId) {
    return {}
  }

  // Dummy method refund to Shopify is handled in subscriber based on order.items_returned
  async refundPayment(payment, refundAmount) {
    return payment.data
  }

  async cancelPayment(_) {
    return {}
  }
}

export default ShopifyProviderService
