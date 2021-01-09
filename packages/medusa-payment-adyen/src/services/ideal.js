import _ from "lodash"
import { PaymentService } from "medusa-interfaces"

class IdealAdyenService extends PaymentService {
  static identifier = "idealAdyen"

  constructor({ adyenService }) {
    super()

    this.adyenService_ = adyenService
  }

  async createPayment(_) {
    return {}
  }

  async authorizePayment(cart, paymentMethod) {
    return this.adyenService_.authorizePayment(cart, paymentMethod)
  }

  async retrievePayment(data) {
    return this.adyenService_.retrievePayment(data)
  }

  async updatePayment(data, _) {
    return this.adyenService_.updatePayment(data)
  }

  async deletePayment(data) {
    return this.adyenService_.deletePayment(data)
  }

  async capturePayment(data) {
    try {
      return this.adyenService_.capturePayment(data)
    } catch (error) {
      throw error
    }
  }

  async refundPayment(data) {
    try {
      return this.adyenService_.refundPayment(data)
    } catch (error) {
      throw error
    }
  }

  async cancelPayment(data) {
    try {
      return this.adyenService_.cancelPayment(data)
    } catch (error) {
      throw error
    }
  }
}

export default IdealAdyenService
