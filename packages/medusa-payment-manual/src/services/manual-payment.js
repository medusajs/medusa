import { PaymentService } from "medusa-interfaces"

class ManualPaymentService extends PaymentService {
  static identifier = "manual"

  constructor() {
    super()
  }

  /**
   * Fetches Stripe payment intent. Check its status and returns the
   * corresponding Medusa status.
   * @param {object} paymentData - payment method data from cart
   * @returns {string} the status of the payment intent
   */
  async getStatus(paymentData) {
    const { status } = paymentData
    return status
  }

  /**
   * Creates a Stripe payment intent.
   * If customer is not registered in Stripe, we do so.
   * @param {object} cart - cart to create a payment for
   * @returns {object} Stripe payment intent
   */
  async createPayment() {
    return { status: "pending" }
  }

  /**
   * Retrieves Stripe payment intent.
   * @param {object} data - the data of the payment to retrieve
   * @returns {Promise<object>} Stripe payment intent
   */
  async retrievePayment(data) {
    return data
  }

  /**
   * Authorizes Stripe payment intent by simply returning
   * the status for the payment intent in use.
   * @param {object} sessionData - payment session data
   * @param {object} context - properties relevant to current context
   * @returns {Promise<{ status: string, data: object }>} result with data and status
   */
  async authorizePayment() {
    return { status: "authorized", data: { status: "authorized" } }
  }

  /**
   * Updates Stripe payment intent.
   * @param {object} sessionData - payment session data.
   * @param {object} update - objec to update intent with
   * @returns {object} Stripe payment intent
   */
  async updatePayment(sessionData, cart) {
    return sessionData.data
  }

  async deletePayment() {
    return
  }

  /**
   * Captures payment for Stripe payment intent.
   * @param {object} paymentData - payment method data from cart
   * @returns {object} Stripe payment intent
   */
  async capturePayment() {
    return { status: "captured" }
  }

  async getPaymentData(session) {
    return session.data
  }

  /**
   * Refunds payment for Stripe payment intent.
   * @param {object} paymentData - payment method data from cart
   * @param {number} amountToRefund - amount to refund
   * @returns {string} refunded payment intent
   */
  async refundPayment(payment) {
    return payment.data
  }

  /**
   * Cancels payment for Stripe payment intent.
   * @param {object} paymentData - payment method data from cart
   * @returns {object} canceled payment intent
   */
  async cancelPayment() {
    return { status: "canceled" }
  }
}

export default ManualPaymentService
