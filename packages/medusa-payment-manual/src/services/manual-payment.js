import { PaymentService } from "medusa-interfaces"

class ManualPaymentService extends PaymentService {
  static identifier = "manual"

  constructor() {
    super()
  }

  /**
   * Returns the currently held status.
   * @param {object} paymentData - payment method data from cart
   * @returns {string} the status of the payment
   */
  async getStatus(paymentData) {
    const { status } = paymentData
    return status
  }

  /**
   * Creates a manual payment with status "pending"
   * @param {object} cart - cart to create a payment for
   * @returns {object} an object with staus
   */
  async createPayment() {
    return { status: "pending" }
  }

  /**
   * Retrieves payment
   * @param {object} data - the data of the payment to retrieve
   * @returns {Promise<object>} returns data
   */
  async retrievePayment(data) {
    return data
  }

  /**
   * Updates the payment status to authorized
   * @returns {Promise<{ status: string, data: object }>} result with data and status
   */
  async authorizePayment() {
    return { status: "authorized", data: { status: "authorized" } }
  }

  /**
   * Noop, simply returns existing data.
   * @param {object} sessionData - payment session data.
   * @returns {object} same data
   */
  async updatePayment(sessionData) {
    return sessionData
  }

  /**
   * @param {object} sessionData - payment session data.
   * @param {object} update - payment session update data.
   * @returns {object} existing data merged with update data
   */
  async updatePaymentData(sessionData, update) {
    return { ...sessionData, ...update.data }
  }

  async deletePayment() {
    return
  }

  /**
   * Updates the payment status to captured
   * @param {object} paymentData - payment method data from cart
   * @returns {object} object with updated status
   */
  async capturePayment() {
    return { status: "captured" }
  }

  /**
   * Returns the data currently held in a status
   * @param {object} session - payment method data from cart
   * @returns {object} the current data
   */
  async getPaymentData(session) {
    return session.data
  }

  /**
   * Noop, resolves to allow manual refunds.
   * @param {object} payment - payment method data from cart
   * @returns {string} same data
   */
  async refundPayment(payment) {
    return payment.data
  }

  /**
   * Updates the payment status to cancled
   * @returns {object} object with canceled status
   */
  async cancelPayment() {
    return { status: "canceled" }
  }
}

export default ManualPaymentService
