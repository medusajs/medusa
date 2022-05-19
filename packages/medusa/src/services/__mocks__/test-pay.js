/*
const testPayService = {
  identifier: "test-pay",
  getIdentifier: "test-pay",
  getStatus: jest.fn().mockResolvedValue(Promise.resolve("authorised")),
  retrieveSavedMethods: jest.fn().mockResolvedValue(Promise.resolve([])),
  getPaymentData: jest.fn().mockResolvedValue(Promise.resolve({})),
  createPayment: jest.fn().mockImplementation(() => {
    return {}
  }),
  retrievePayment: jest.fn().mockImplementation(() => {
    return {}
  }),
  updatePayment: jest.fn().mockImplementation(() => {
    return {}
  }),
  deletePayment: jest.fn().mockImplementation(() => {
    return {}
  }),
  authorizePayment: jest.fn().mockImplementation(() => {
    return {}
  }),
  updatePaymentData: jest.fn().mockImplementation(() => {
    return {}
  }),
  cancelPayment: jest.fn().mockImplementation(() => {
    return {}
  }),
  capturePayment: jest.fn().mockImplementation(() => {
    return {}
  }),
  refundPayment: jest.fn().mockImplementation(() => {
    return {}
  })
}

export default testPayService*/

import { AbstractPaymentService } from "../../interfaces"

class TestPayService extends AbstractPaymentService {
  static identifier = "test-pay"

  getIdentifier() {
    return TestPayService.identifier
  }

  constructor(...args) {
    super(...args)
  }

  async getStatus(paymentData) {
    return "authorized"
  }

  async retrieveSavedMethods(customer) {
    return Promise.resolve([])
  }

  async createPayment(cart) {
    return undefined
  }

  async retrievePayment(data) {
    return {}
  }

  async getPaymentData(sessionData) {
    return {}
  }

  async authorizePayment(sessionData, context = {}) {
    return { data: {}, status: "authorized" }
  }

  async updatePaymentData(sessionData, update) {
    return {}
  }

  async updatePayment(sessionData, cart) {
    return {}
  }

  async deletePayment(payment) {
    return {}
  }

  async capturePayment(payment) {
    return {}
  }

  async refundPayment(payment, amountToRefund) {
    return {}
  }

  async cancelPayment(payment) {
    return {}
  }
}

TestPayService.prototype.createPayment = jest.fn().mockImplementation((cart) => {
  const fields = [
      "total",
      "subtotal",
      "tax_total",
      "discount_total",
      "shipping_total",
      "gift_card_total",
    ]

    const data = {}
    for (const k of fields) {
      data[k] = cart[k]
    }

    return data
})

TestPayService.prototype.updatePayment = jest.fn().mockImplementation(() => {
  return {}
})

TestPayService.prototype.deletePayment = jest.fn().mockImplementation(() => {
  return {}
})

TestPayService.prototype.deletePayment = jest.fn().mockImplementation(() => {
  return {}
})

TestPayService.prototype.authorizePayment = jest.fn().mockImplementation(() => {
  return {}
})

TestPayService.prototype.updatePaymentData = jest.fn().mockImplementation(() => {
  return {}
})

TestPayService.prototype.cancelPayment = jest.fn().mockImplementation(() => {
  return {}
})

TestPayService.prototype.capturePayment = jest.fn().mockImplementation(() => {
  return {}
})

TestPayService.prototype.refundPayment = jest.fn().mockImplementation(() => {
  return {}
})

export default TestPayService