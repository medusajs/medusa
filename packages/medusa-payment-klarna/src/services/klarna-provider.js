import axios from "axios"
import _ from "lodash"
import { PaymentService } from "medusa-interfaces"

class KlarnaProviderService extends PaymentService {
  static identifier = "klarna"

  constructor({ logger, shippingProfileService }, options) {
    super()

    /**
     * Required Klarna options:
     *  {
     *    backend_url: "",
     *    url: "",
     *    user: "",
     *    password: "",
     *    merchant_urls: {
     *        terms: ``,
     *        checkout: ``,
     *        confirmation: ``,
     *    }
     *  }
     */
    this.options_ = options
    this.logger_ = logger

    /** @private @const {Klarna} */
    this.klarna_ = axios.create({
      baseURL: options.url,
      auth: {
        username: options.user,
        password: options.password,
      },
    })

    this.klarnaOrderUrl_ = "/checkout/v3/orders"

    this.klarnaOrderManagementUrl_ = "/ordermanagement/v1/orders"

    this.backendUrl_ = options.backend_url

    /** @private @const {ShippingProfileService} */
    this.shippingProfileService_ = shippingProfileService
  }

  async lineItemsToOrderLines_(cart) {
    let order_lines = []

    for (const item of cart.items ?? []) {
      // Withdraw discount from the total item amount
      const quantity = item.quantity

      const tax = item.tax_lines.reduce((acc, next) => acc + next.rate, 0) / 100

      order_lines.push({
        name: item.title,
        tax_rate: tax * 10000,
        quantity,
        unit_price: Math.round(item.original_total / item.quantity),
        total_amount: item.total,
        total_tax_amount: item.tax_total,
        total_discount_amount: item.original_total - item.total,
      })
    }

    if (cart.shipping_methods?.length) {
      const name = []
      let total = 0
      let tax = 0
      let taxRate = 0

      if (cart.shipping_total > 0) {
        for (const method of cart.shipping_methods) {
          const methodTaxRate =
            method.tax_lines.reduce((acc, next) => acc + next.rate, 0) / 100

          name.push(method.shipping_option.name)

          total += method.total
          taxRate += (method.price / cart.shipping_total) * methodTaxRate
          tax += method.tax_total
        }
      }

      order_lines.push({
        name: name?.join(" + ") || "Shipping fee",
        quantity: 1,
        type: "shipping_fee",
        unit_price: total,
        tax_rate: taxRate * 10000,
        total_amount: total,
        total_tax_amount: tax,
      })
    }

    return order_lines
  }

  async cartToKlarnaOrder(cart) {
    let order = {
      // Cart id is stored, such that we can use it for hooks
      merchant_data: cart.resource_id ?? cart.id,
      locale: "en-US",
    }

    const { region, gift_card_total, tax_total, total } = cart

    order.order_lines = await this.lineItemsToOrderLines_(cart)

    if (gift_card_total) {
      const taxRate = cart.gift_card_tax_total / cart.gift_card_total

      order.order_lines.push({
        name: "Gift Card",
        quantity: 1,
        type: "gift_card",
        unit_price: -1 * (cart.gift_card_total + cart.gift_card_tax_total),
        tax_rate: Math.round(taxRate * 10000),
        total_amount: -1 * (cart.gift_card_total + cart.gift_card_tax_total),
        total_tax_amount: -1 * cart.gift_card_tax_total,
      })
    }

    if (!_.isEmpty(cart.billing_address)) {
      order.billing_address = {
        email: cart.email,
        street_address: cart.billing_address.address_1,
        street_address2: cart.billing_address.address_2,
        postal_code: cart.billing_address.postal_code,
        city: cart.billing_address.city,
        country: cart.billing_address.country_code,
      }
    }

    const hasCountry =
      !_.isEmpty(cart.shipping_address) && cart.shipping_address.country_code

    if (hasCountry) {
      order.purchase_country = cart.shipping_address.country_code.toUpperCase()
    } else {
      // Defaults to Sweden
      order.purchase_country = "SE"
    }

    order.order_amount = total
    order.order_tax_amount = tax_total - cart.gift_card_tax_total ?? 0
    order.purchase_currency = region?.currency_code?.toUpperCase() ?? "SE"

    order.merchant_urls = {
      terms: this.options_.merchant_urls.terms,
      checkout: this.options_.merchant_urls.checkout,
      confirmation: this.options_.merchant_urls.confirmation,
      push: `${this.backendUrl_}/klarna/push?klarna_order_id={checkout.order.id}`,
      shipping_option_update: `${this.backendUrl_}/klarna/shipping`,
      address_update: `${this.backendUrl_}/klarna/address`,
    }

    if (cart.shipping_address && cart.shipping_address.first_name) {
      let shippingOptions = await this.shippingProfileService_.fetchCartOptions(
        cart
      )

      shippingOptions = shippingOptions.filter(
        (so) => !so.data?.require_drop_point
      )

      // If the cart does not have shipping methods yet, preselect one from
      // shipping_options and set the selected shipping method
      if (cart.shipping_methods.length) {
        const method = cart.shipping_methods[0]
        const taxRate = method.tax_total / (method.total - method.tax_total)
        order.selected_shipping_option = {
          id: method.shipping_option.id,
          name: method.shipping_option.name,
          price: method.total,
          tax_amount: method.tax_total,
          tax_rate: taxRate * 10000,
        }
      }

      const partitioned = shippingOptions.reduce((acc, next) => {
        if (acc[next.profile_id]) {
          acc[next.profile_id] = [...acc[next.profile_id], next]
        } else {
          acc[next.profile_id] = [next]
        }
        return acc
      }, {})

      // Helper function that calculates the cartesian product of multiple arrays
      // Don't touch :D
      // From: https://stackoverflow.com/questions/12303989/cartesian-product-of-multiple-arrays-in-javascript
      const f = (a, b) =>
        [].concat(...a.map((d) => b.map((e) => [].concat(d, e))))
      const cartesian = (a, b, ...c) => (b ? cartesian(f(a, b), ...c) : a)

      const methods = Object.keys(partitioned).map((k) => partitioned[k])
      const combinations = cartesian(...methods)

      const taxRate = region.tax_rate / 100

      // Use the cartesian product of shipping methods to generate correct
      // format for the Klarna Widget
      order.shipping_options = combinations.map((combination) => {
        combination = Array.isArray(combination) ? combination : [combination]
        const details = combination.reduce(
          (acc, next) => {
            acc.id = [...acc.id, next.id]
            acc.name = [...acc.name, next.name]
            acc.price += next.amount
            return acc
          },
          { id: [], name: [], price: 0 }
        )

        return {
          id: details.id.join("."),
          name: details.name.join(" + "),
          price: details.price * (1 + taxRate),
          tax_amount: details.price * taxRate,
          tax_rate: taxRate * 10000,
        }
      })
    }

    return order
  }

  validateKlarnaOrderUrls(property) {
    const required = ["terms", "checkout", "confirmation"]

    const isMissing = required.some((prop) => !this.options_[property]?.[prop])

    if (isMissing) {
      throw new Error(
        `options.${property} is required to create a Klarna Order.\n` +
          `medusa-config.js file has to contain ${property} { ${required.join(
            ", "
          )}}`
      )
    }
  }

  static replaceStringWithPropertyValue(string, obj) {
    const keys = Object.keys(obj)
    for (const key of keys) {
      if (string.includes(`{${key}}`)) {
        string = string.replace(`{${key}}`, obj[key])
      }
    }
    return string
  }

  async paymentInputToKlarnaOrder(paymentInput) {
    if (paymentInput.cart) {
      this.validateKlarnaOrderUrls("merchant_urls")
      return this.cartToKlarnaOrder(paymentInput.cart)
    }

    this.validateKlarnaOrderUrls("payment_collection_urls")

    const { currency_code, amount, resource_id } = paymentInput

    const order = {
      // Custom id is stored, such that we can use it for hooks
      merchant_data: resource_id,
      locale: "en-US",
      order_lines: [
        {
          name: "Payment Collection",
          quantity: 1,
          unit_price: amount,
          tax_rate: 0,
          total_amount: amount,
          total_tax_amount: 0,
        },
      ],
      // Defaults to Sweden
      purchase_country: "SE",

      order_amount: amount,
      order_tax_amount: 0,
      purchase_currency: currency_code.toUpperCase(),

      merchant_urls: {
        terms: KlarnaProviderService.replaceStringWithPropertyValue(
          this.options_.payment_collection_urls.terms,
          paymentInput
        ),
        checkout: KlarnaProviderService.replaceStringWithPropertyValue(
          this.options_.payment_collection_urls.checkout,
          paymentInput
        ),
        confirmation: KlarnaProviderService.replaceStringWithPropertyValue(
          this.options_.payment_collection_urls.confirmation,
          paymentInput
        ),
        push: `${this.backendUrl_}/klarna/push?klarna_order_id={checkout.order.id}`,
      },
    }

    return order
  }

  /**
   * Status for Klarna order.
   * @param {Object} paymentData - payment method data from cart
   * @returns {string} the status of the Klarna order
   */
  async getStatus(paymentData) {
    const { order_id } = paymentData
    const { data: order } = await this.klarna_.get(
      `${this.klarnaOrderUrl_}/${order_id}`
    )

    let status = "pending"

    if (order.status === "checkout_complete") {
      status = "authorized"
    }

    return status
  }

  /**
   * Creates Klarna PaymentIntent.
   * @param {string} cart - the cart to create a payment for
   * @returns {string} id of payment intent
   */
  async createPayment(cart) {
    try {
      const order = await this.cartToKlarnaOrder(cart)

      return await this.klarna_
        .post(this.klarnaOrderUrl_, order)
        .then(({ data }) => data)
    } catch (error) {
      this.logger_.error(error)
      throw error
    }
  }

  /**
   * Retrieves Klarna Order.
   * @param {string} cart - the cart to retrieve order for
   * @returns {Object} Klarna order
   */
  async retrievePayment(paymentData) {
    try {
      return this.klarna_
        .get(`${this.klarnaOrderUrl_}/${paymentData.order_id}`)
        .then(({ data }) => data)
    } catch (error) {
      throw error
    }
  }

  /**
   * Gets a Klarna payment objec.
   * @param {object} sessionData - the data of the payment to retrieve
   * @returns {Promise<object>} Stripe payment intent
   */
  async getPaymentData(sessionData) {
    try {
      return this.klarna_
        .get(`${this.klarnaOrderUrl_}/${sessionData.data.order_id}`)
        .then(({ data }) => data)
    } catch (error) {
      throw error
    }
  }

  /**
   * Retrieves completed Klarna Order.
   * @param {string} klarnaOrderId - id of the order to retrieve
   * @returns {Object} Klarna order
   */
  async retrieveCompletedOrder(klarnaOrderId) {
    try {
      return this.klarna_
        .get(`${this.klarnaOrderManagementUrl_}/${klarnaOrderId}`)
        .then(({ data }) => data)
    } catch (error) {
      throw error
    }
  }

  /**
   * Authorizes Klarna payment by simply returning the status for the payment
   * in use.
   * @param {object} sessionData - payment session data
   * @param {object} context - properties relevant to current context
   * @returns {Promise<{ status: string, data: object }>} result with data and status
   */
  async authorizePayment(sessionData, context = {}) {
    try {
      const paymentStatus = await this.getStatus(sessionData.data)

      return { data: sessionData.data, status: paymentStatus }
    } catch (error) {
      throw error
    }
  }

  /**
   * Acknowledges a Klarna order as part of the order completion process
   * @param {string} klarnaOrderId - id of the order to acknowledge
   * @returns {string} id of acknowledged order
   */
  async acknowledgeOrder(klarnaOrderId, orderId = null) {
    try {
      await this.klarna_.post(
        `${this.klarnaOrderManagementUrl_}/${klarnaOrderId}/acknowledge`
      )

      if (orderId !== null) {
        await this.klarna_.patch(
          `${this.klarnaOrderManagementUrl_}/${klarnaOrderId}/merchant-references`,
          {
            merchant_reference1: orderId,
          }
        )
      }

      return klarnaOrderId
    } catch (error) {
      throw error
    }
  }

  /**
   * Adds the id of the Medusa order to the Klarna Order to create a relation
   * @param {string} klarnaOrderId - id of the klarna order
   * @param {string} orderId - id of the Medusa order
   * @returns {string} id of updated order
   */
  async addOrderToKlarnaOrder(klarnaOrderId, orderId) {
    try {
      await this.klarna_.post(
        `${this.klarnaOrderManagementUrl_}/${klarnaOrderId}/merchant-references`,
        {
          merchant_reference1: orderId,
        }
      )

      return klarnaOrderId
    } catch (error) {
      throw error
    }
  }

  async updatePaymentData(sessionData, update) {
    try {
      return { ...sessionData, ...update }
    } catch (error) {
      throw error
    }
  }

  /**
   * Updates Klarna order.
   * @param {string} paymentData
   * @param {Object} cart
   * @returns {Object} updated order
   */
  async updatePayment(paymentData, cart) {
    if (cart.total !== paymentData.order_amount) {
      const order = await this.cartToKlarnaOrder(cart)
      return this.klarna_
        .post(`${this.klarnaOrderUrl_}/${paymentData.order_id}`, order)
        .then(({ data }) => data)
        .catch(async (_) => {
          return this.klarna_
            .post(this.klarnaOrderUrl_, order)
            .then(({ data }) => data)
        })
    }

    return paymentData
  }

  /**
   * Captures Klarna order.
   * @param {Object} paymentData - payment method data from cart
   * @returns {string} id of captured order
   */
  async capturePayment(payment) {
    const { order_id } = payment.data
    try {
      const { data: order } = await this.klarna_.get(
        `${this.klarnaOrderManagementUrl_}/${order_id}`
      )
      const { order_amount } = order

      await this.klarna_.post(
        `${this.klarnaOrderManagementUrl_}/${order_id}/captures`,
        {
          captured_amount: order_amount,
        }
      )

      return this.retrieveCompletedOrder(order_id)
    } catch (error) {
      throw error
    }
  }

  /**
   * Refunds payment for Klarna Order.
   * @param {Object} paymentData - payment method data from cart
   * @returns {string} id of refunded order
   */
  async refundPayment(payment, amountToRefund) {
    const { order_id } = payment.data
    try {
      await this.klarna_.post(
        `${this.klarnaOrderManagementUrl_}/${order_id}/refunds`,
        {
          refunded_amount: amountToRefund,
        }
      )

      return this.retrieveCompletedOrder(order_id)
    } catch (error) {
      throw error
    }
  }

  /**
   * Cancels payment for Klarna Order.
   * @param {Object} paymentData - payment method data from cart
   * @returns {string} id of cancelled order
   */
  async cancelPayment(payment) {
    const { order_id } = payment.data
    try {
      await this.klarna_.post(
        `${this.klarnaOrderManagementUrl_}/${order_id}/cancel`
      )

      return this.retrieveCompletedOrder(order_id)
    } catch (error) {
      throw error
    }
  }

  async deletePayment(_) {
    return Promise.resolve()
  }
}

export default KlarnaProviderService
