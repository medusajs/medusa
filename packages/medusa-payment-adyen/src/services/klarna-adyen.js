import _ from "lodash"
import { PaymentService } from "medusa-interfaces"

class KlarnaAdyenService extends PaymentService {
  static identifier = "klarna-adyen"

  constructor({ adyenService, regionService }) {
    super()

    this.adyenService_ = adyenService

    this.regionService_ = regionService
  }

  /**
   * Status for Adyen payment.
   * @param {Object} paymentData - payment method data from cart
   * @returns {string} the status of the payment
   */
  async getStatus(paymentData) {
    const { resultCode } = paymentData
    let status = "initial"

    if (resultCode === "Authorised") {
      status = "authorized"
    }

    return status
  }

  async createPayment(_) {
    return {}
  }

  async getKlarnaRequestObject(cart) {
    const region = await this.regionService_.retrieve(cart.region_id)

    const klarnaRequestObj = {}
    klarnaRequestObj.shopperEmail = cart.email
    klarnaRequestObj.countryCode = cart.shipping_address.country_code
    klarnaRequestObj.shopperName = {
      firstName: cart.shipping_address.first_name,
      lastName: cart.shipping_address.last_name,
      gender: "UNKNOWN",
    }

    klarnaRequestObj.lineItems = cart.items.map((item) => {
      const itemExcludingTax = item.content.unit_price * item.quantity
      const withTax = itemExcludingTax * (1 + region.tax_rate)

      return {
        quantity: item.quantity,
        amountExcludingTax: itemExcludingTax * 100,
        taxPercentage: region.tax_rate * 10000,
        description: item.title,
        id: item.title,
        taxAmount: withTax * 100 - itemExcludingTax * 100,
        amountIncludingTax: withTax * 100,
      }
    })

    return klarnaRequestObj
  }

  async authorizePayment(cart, paymentMethod, amount) {
    const additionalOptions = await this.getKlarnaRequestObject(cart)

    return this.adyenService_.authorizePayment(
      cart,
      paymentMethod,
      amount,
      additionalOptions
    )
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
    return this.adyenService_.capturePayment(data)
  }

  async refundPayment(data, amountToRefund) {
    return this.adyenService_.refundPayment(data, amountToRefund)
  }

  async cancelPayment(data) {
    return this.adyenService_.cancelPayment(data)
  }
}

export default KlarnaAdyenService
