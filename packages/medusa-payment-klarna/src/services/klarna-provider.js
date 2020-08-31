import _ from "lodash"
import axios from "axios"
import { PaymentService } from "medusa-interfaces"

class KlarnaProviderService extends PaymentService {
  static identifier = "klarna"

  constructor(
    { shippingProfileService, totalsService, regionService },
    options
  ) {
    super()

    this.options_ = options

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

    this.totalsService_ = totalsService

    this.regionService_ = regionService

    this.shippingProfileService_ = shippingProfileService
  }

  async lineItemsToOrderLines_(cart, taxRate) {
    let order_lines = []

    cart.items.forEach((item) => {
      // For bundles, we create an order line for each item in the bundle
      if (Array.isArray(item.content)) {
        item.content.forEach((c) => {
          const total_amount = c.unit_price * c.quantity * (taxRate + 1)
          const total_tax_amount = total_amount * taxRate

          order_lines.push({
            name: item.title,
            unit_price: c.unit_price,
            quantity: c.quantity,
            tax_rate: taxRate * 10000,
            total_amount,
            total_tax_amount,
          })
        })
      } else {
        // Withdraw discount from the total item amount
        const quantity = item.quantity
        const unit_price = item.content.unit_price * 100 * (taxRate + 1)
        const total_amount = unit_price * quantity
        const total_tax_amount = total_amount * (taxRate / (1 + taxRate))

        order_lines.push({
          name: item.title,
          tax_rate: taxRate * 10000,
          quantity,
          unit_price,
          total_amount,
          total_tax_amount,
        })
      }
    })

    if (cart.shipping_methods.length) {
      const { name, price } = cart.shipping_methods.reduce(
        (acc, next) => {
          acc.name = [...acc.name, next.name]
          acc.price += next.price
          return acc
        },
        { name: [], price: 0 }
      )

      order_lines.push({
        name: name.join(" + "),
        quantity: 1,
        type: "shipping_fee",
        unit_price: price * (1 + taxRate) * 100,
        tax_rate: taxRate * 10000,
        total_amount: price * (1 + taxRate) * 100,
        total_tax_amount: price * taxRate * 100,
      })
    }

    return order_lines
  }

  async cartToKlarnaOrder(cart) {
    let order = {
      // Cart id is stored, such that we can use it for hooks
      merchant_data: cart._id,
      // TODO: Investigate if other locales are needed
      locale: "en-US",
    }

    const { tax_rate, currency_code } = await this.regionService_.retrieve(
      cart.region_id
    )

    order.order_lines = await this.lineItemsToOrderLines_(cart, tax_rate)

    const discount = (await this.totalsService_.getDiscountTotal(cart)) * 100
    if (discount) {
      order.order_lines.push({
        name: `Discount`,
        quantity: 1,
        type: "discount",
        unit_price: 0,
        total_discount_amount: discount * (1 + tax_rate),
        tax_rate: tax_rate * 10000,
        total_amount: -discount * (1 + tax_rate),
        total_tax_amount: -discount * tax_rate,
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

    // TODO: Check if country matches ISO
    if (!_.isEmpty(cart.billing_address) && cart.billing_address.country) {
      order.purchase_country =
        cart.shipping_address.country_code || cart.billing_address.country_code
    } else {
      // Defaults to Sweden
      order.purchase_country = "SE"
    }
    order.order_amount = (await this.totalsService_.getTotal(cart)) * 100
    order.order_tax_amount = (await this.totalsService_.getTaxTotal(cart)) * 100
    // TODO: Check if currency matches ISO
    order.purchase_currency = currency_code

    order.merchant_urls = {
      terms: this.options_.merchant_urls.terms,
      checkout: this.options_.merchant_urls.checkout,
      confirmation: this.options_.merchant_urls.confirmation,
      push: `${this.backendUrl_}/klarna/push?klarna_order_id={checkout.order.id}`,
      shipping_option_update: `${this.backendUrl_}/klarna/shipping`,
      address_update: `${this.backendUrl_}/klarna/address`,
    }

    if (cart.shipping_address && cart.shipping_address.first_name) {
      const shippingOptions = await this.shippingProfileService_.fetchCartOptions(
        cart
      )

      // If the cart does not have shipping methods yet, preselect one from
      // shipping_options and set the selected shipping method
      if (cart.shipping_methods.length) {
        const shipping_method = cart.shipping_methods[0]
        order.selected_shipping_option = {
          id: shipping_method._id,
          name: shipping_method.name,
          price: shipping_method.price * (1 + tax_rate) * 100,
          tax_amount: shipping_method.price * tax_rate * 100,
          tax_rate: tax_rate * 10000,
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

      let f = (a, b) =>
        [].concat(...a.map((a) => b.map((b) => [].concat(a, b))))
      let cartesian = (a, b, ...c) => (b ? cartesian(f(a, b), ...c) : a)

      const methods = Object.keys(partitioned).map((k) => partitioned[k])
      const combinations = cartesian(...methods)

      order.shipping_options = combinations.map((combination) => {
        combination = Array.isArray(combination) ? combination : [combination]
        const details = combination.reduce(
          (acc, next) => {
            acc.id = [...acc.id, next._id]
            acc.name = [...acc.name, next.name]
            acc.price += next.price
            return acc
          },
          { id: [], name: [], price: 0 }
        )

        return {
          id: details.id.join("."),
          name: details.name.join(" + "),
          price: details.price * (1 + tax_rate) * 100,
          tax_amount: details.price * tax_rate * 100,
          tax_rate: tax_rate * 10000,
          preselected: combinations.length === 1,
        }
      })
    }

    return order
  }

  /**
   * Status for Klarna order.
   * @param {Object} paymentData - payment method data from cart
   * @returns {string} the status of the Klarna order
   */
  async getStatus(paymentData) {
    try {
      const { order_id } = paymentData
      const { data: order } = await this.klarna_.get(
        `${this.klarnaOrderUrl_}/${order_id}`
      )

      let status = "initial"
      if (order.status === "checkout_complete") {
        status = "authorized"
      }
      return status
    } catch (error) {
      throw error
    }
  }

  /**
   * Creates Stripe PaymentIntent.
   * @param {string} cart - the cart to create a payment for
   * @param {number} amount - the amount to create a payment for
   * @returns {string} id of payment intent
   */
  async createPayment(cart) {
    try {
      const order = await this.cartToKlarnaOrder(cart)
      return this.klarna_
        .post(this.klarnaOrderUrl_, order)
        .then(({ data }) => data)
    } catch (error) {
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
   * Retrieves completed Klarna Order.
   * @param {string} klarnaOrderId - id of the order to retrieve
   * @returns {Object} Klarna order
   */
  async retrieveCompletedOrder(klarnaOrderId) {
    try {
      return this.klarna_.get(
        `${this.klarnaOrderManagementUrl_}/${klarnaOrderId}`
      )
    } catch (error) {
      throw error
    }
  }

  /**
   * Acknowledges a Klarna order as part of the order completion process
   * @param {string} klarnaOrderId - id of the order to acknowledge
   * @returns {string} id of acknowledged order
   */
  async acknowledgeOrder(klarnaOrderId, orderId) {
    try {
      await this.klarna_.post(
        `${this.klarnaOrderManagementUrl_}/${klarnaOrderId}/acknowledge`
      )

      await this.klarna_.patch(
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

  /**
   * Updates Klarna order.
   * @param {string} order - the order to update
   * @param {Object} data - the update object
   * @returns {Object} updated order
   */
  async updatePayment(paymentData, cart) {
    try {
      const order = await this.cartToKlarnaOrder(cart, true)
      return this.klarna_
        .post(`${this.klarnaOrderUrl_}/${paymentData.order_id}`, order)
        .then(({ data }) => data)
    } catch (error) {
      throw error
    }
  }

  /**
   * Captures Klarna order.
   * @param {Object} paymentData - payment method data from cart
   * @returns {string} id of captured order
   */
  async capturePayment(paymentData) {
    try {
      const { order_id } = paymentData
      const orderData = await this.klarna_.get(
        `${this.klarnaOrderUrl_}/${order_id}`
      )
      const { order_amount } = orderData.order

      await this.klarna_.post(
        `${this.klarnaOrderManagementUrl_}/${order_id}/captures`,
        {
          captured_amount: order_amount,
        }
      )
      return order_id
    } catch (error) {
      throw error
    }
  }

  /**
   * Refunds payment for Klarna Order.
   * @param {Object} paymentData - payment method data from cart
   * @returns {string} id of refunded order
   */
  async refundPayment(paymentData, amount) {
    try {
      const { order_id } = paymentData
      await this.klarna_.post(
        `${this.klarnaOrderManagementUrl_}/${order_id}/refunds`,
        {
          refunded_amount: amount,
        }
      )
      return order_id
    } catch (error) {
      throw error
    }
  }

  /**
   * Cancels payment for Klarna Order.
   * @param {Object} paymentData - payment method data from cart
   * @returns {string} id of cancelled order
   */
  async cancelPayment(paymentData) {
    try {
      const { order_id } = paymentData
      await this.klarna_.post(`${this.klarnaOrderUrl_}/${order_id}/cancel`)
      return order_id
    } catch (error) {
      throw error
    }
  }
}

export default KlarnaProviderService
