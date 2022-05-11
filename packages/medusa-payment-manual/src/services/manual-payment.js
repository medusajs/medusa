import { AbstractPaymentService } from "@medusajs/medusa"

class ManualPaymentService extends AbstractPaymentService {
  static identifier = "manual"

  constructor() {
    super({})
  }

  /**
   * Returns the currently held status.
   * @param {PaymentSessionData} paymentSessionData - payment method data from cart
   * @returns {Promise<PaymentSessionStatus>} the status of the payment
   */
  async getStatus(paymentSessionData) {
    const { status } = paymentData
    return status
  }

  /**
   * Creates a manual payment with status "pending"
   * @param {Cart} cart - cart to create a payment for
   * @returns {Promise<{status: string}>} an object with status
   */
  async createPayment(cart) {
    return { status: "pending" }
  }

  /**
   * Retrieves payment
   * @param {PaymentData} data - the data of the payment to retrieve
   * @returns {Promise<Data>} returns data
   */
  async retrievePayment(paymentData) {
    return paymentData
  }

  /**
   * Updates the payment status to authorized
   * @param {PaymentSession} paymentSession
   * @param {Data} context
   * @returns {{ status: string, data: PaymentSessionStatus }} result with data and status
   */
  async authorizePayment(paymentSession, context) {
    return {
      status: PaymentSessionStatus.AUTHORIZED,
      data: { status: PaymentSessionStatus.AUTHORIZED }
    }
  }

  /**
   * Noop, simply returns existing data.
   * @param {PaymentSessionData} sessionData - payment session data.
   * @returns {object} same data
   */
  async updatePayment(paymentSessionData, cart) {
    return paymentSessionData
  }

  async updatePaymentData(paymentSessionData, data) {
    try {
      return { ...paymentSessionData, ...data }
    } catch (error) {
      throw error
    }
  }

  async deletePayment(paymentSession) {
    return
  }

  /**
   * Updates the payment status to captured
   * @param {Payment} payment - payment method data from cart
   * @returns {object} object with updated status
   */
  async capturePayment(payment) {
    return { status: "captured" }
  }

  /**
   * Returns the data currently held in a status
   * @param {PaymentSession} paymentSession - payment session from cart
   * @returns {object} the current data
   */
  async getPaymentData(paymentSession) {
    return paymentSession.data
  }

  /**
   * Noop, resolves to allow manual refunds.
   * @param {Payment} payment - payment method data from cart
   * @param {number} refundAmount
   * @returns {string} same data
   */
  async refundPayment(payment, refundAmount) {
    return payment.data
  }

  /**
   * Updates the payment status to cancled
   * @returns {Payment} payment with canceled status
   */
  async cancelPayment(payment) {
    return { status: "canceled" }
  }
}

export default ManualPaymentService
