import _ from "lodash"
import { PaymentService } from "medusa-interfaces"

class GooglePayAdyenService extends PaymentService {
  static identifier = "paywithgoogle-adyen"

  constructor({ adyenService, shippingProfileService, regionService }) {
    super()

    this.adyenService_ = adyenService

    this.shippingProfileService_ = shippingProfileService

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

  async createPayment(cart) {
    const shippingOptions = await this.shippingProfileService_.fetchCartOptions(
      cart
    )

    const region = await this.regionService_.retrieve(cart.region_id)

    const shipping_options = shippingOptions.map((el) => ({
      id: el._id,
      label: `${el.price * (1 + region.tax_rate)} ${region.currency_code} - ${
        el.name
      }`,
    }))

    return { shipping_options }
  }

  async authorizePayment(cart, data, context) {
    return this.adyenService_.authorizePayment(cart, data, context)
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

export default GooglePayAdyenService
