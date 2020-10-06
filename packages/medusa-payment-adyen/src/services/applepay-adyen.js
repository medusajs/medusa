import _ from "lodash"
import https from "https"
import fs from "fs"
import axios from "axios"
import { PaymentService } from "medusa-interfaces"

class ApplePayAdyenService extends PaymentService {
  static identifier = "applepay-adyen"

  constructor(
    { adyenService, shippingProfileService, regionService },
    options
  ) {
    super()

    this.adyenService_ = adyenService

    this.shippingProfileService_ = shippingProfileService

    this.regionService_ = regionService

    this.options_ = options
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
      label: `${el.name}`,
      detail: "",
      amount: `${el.price * (1 + region.tax_rate)}`,
      identifier: el._id,
    }))

    return { shipping_options }
  }

  async getApplePaySession(validationUrl) {
    let certificate
    try {
      // Place certificate in root folder
      certificate = fs.readFileSync("./apple-pay-cert.pem")
    } catch (error) {
      console.log(error)
      throw new Error(
        "Could not find ApplePay certificate. Make sure to place it in root folder of your server"
      )
    }

    const httpsAgent = new https.Agent({
      cert: certificate,
      key: certificate,
      rejectUnauthorized: false,
    })

    const request = {
      merchantIdentifier: this.options_.applepay_merchant_id,
      displayName: this.options_.applepay_display_name,
      initiative: "web",
      initiativeContext: this.options_.applepay_initiative_context,
    }

    try {
      return axios.post(validationUrl, request, {
        httpsAgent,
      })
    } catch (error) {
      console.log(error)
    }
  }

  async authorizePayment(cart, paymentMethod, amount, shopperIp) {
    return this.adyenService_.authorizePayment(
      cart,
      paymentMethod,
      amount,
      shopperIp
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

export default ApplePayAdyenService
