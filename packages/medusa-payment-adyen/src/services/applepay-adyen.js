import _ from "lodash"
import https from "https"
import fs from "fs"
import axios from "axios"
import { PaymentService } from "medusa-interfaces"

class ApplePayAdyenService extends PaymentService {
  static identifier = "applepay-adyen"

  constructor({ adyenService }, options) {
    super()

    this.adyenService_ = adyenService

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

  async createPayment(_) {
    return {}
  }

  async getApplePaySession(validationUrl) {
    let certificate
    try {
      // Place certificate in root folder
      certificate = fs.readFileSync("./apple-pay-cert.pem")
    } catch (error) {
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

    return axios.post(validationUrl, request, {
      httpsAgent,
    })
  }

  async authorizePayment(sessionData, context) {
    return this.adyenService_.authorizePayment(sessionData, context)
  }

  async getPaymentData(data) {
    return this.adyenService_.getPaymentData(data)
  }

  async retrievePayment(data) {
    return this.adyenService_.retrievePayment(data)
  }

  async updatePaymentData(sessionData, update) {
    return this.adyenService_.updatePaymentData(sessionData, update)
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
