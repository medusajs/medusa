import _ from "lodash"
import Stripe from "stripe"
import { PaymentService } from "medusa-interfaces"

class StripeProviderService extends PaymentService {
  static identifier = "stripe"

  constructor(appScope, options) {
    super()
    console.log(options)

    this.stripe_ = Stripe(options.api_key)
  }

  async createPayment(object) {
    const { customer_id } = object

    let customer = {}

    if (!customer_id) {
      customer = await this.stripe_.customers.create({
        email: object.email,
      })
    } else {
      customer = await this.stripe_.customer.retrieve(customer_id)
    }
  }

  async retrievePayment(object) {
    const { provider_id } = object.payment_method

    try {
      return this.stripe_.paymentIntents.retrieve(provider_id)
    } catch (error) {
      throw error
    }
  }

  async updatePayment(object, data) {
    const { provider_id } = object.payment_method

    try {
      return this.stripe_.paymentIntents.retrieve(provider_id)
    } catch (error) {
      throw error
    }
  }
}

export default StripeProviderService
