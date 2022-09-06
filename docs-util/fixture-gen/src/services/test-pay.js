import { AbstractPaymentService } from "@medusajs/medusa";

class TestPayService extends AbstractPaymentService {
  static identifier = "test-pay";

  constructor(_) {
    super(_);
  }

  async getStatus(paymentData) {
    return "authorized";
  }

  async retrieveSavedMethods(customer) {
    return Promise.resolve([]);
  }

  async createPayment() {
    return {};
  }

  async retrievePayment(data) {
    return {};
  }

  async getPaymentData(sessionData) {
    return {};
  }

  async authorizePayment(sessionData, context = {}) {
    return {};
  }

  async updatePaymentData(sessionData, update) {
    return {};
  }

  async updatePayment(sessionData, cart) {
    return {};
  }

  async deletePayment(payment) {
    return {};
  }

  async capturePayment(payment) {
    return {};
  }

  async refundPayment(payment, amountToRefund) {
    return {};
  }

  async cancelPayment(payment) {
    return {};
  }
}

export default TestPayService;
