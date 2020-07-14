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

    this.backendUrl_ =
      process.env.BACKEND_URL || "https://7e9a5bc2a2eb.ngrok.io"

    this.totalsService_ = totalsService

    this.regionService_ = regionService

    this.shippingProfileService_ = shippingProfileService
  }

  async lineItemsToOrderLines_(cart, taxRate) {
    let order_lines = []
    // Find the discount, that is not free shipping
    const discount = cart.discounts.find(
      ({ discount_rule }) => discount_rule.type !== "free_shipping"
    )

    let itemDiscounts = []
    if (discount) {
      // If the discount has an item specific allocation method,
      // we need to fetch the discount for each item
      itemDiscounts = await this.totalsService_.getAllocationItemDiscounts(
        discount,
        cart
      )
    }

    cart.items.forEach((item) => {
      // For bundles, we create an order line for each item in the bundle
      if (Array.isArray(item.content)) {
        item.content.forEach((c) => {
          const total_amount = c.unit_price * c.quantity * (taxRate + 1)
          const total_tax_amount = total_amount * taxRate

          order_lines.push({
            name: item.title,
            unit_price: c.unit_price,
            // Medusa does not allow discount on bundles
            total_discount_amount: 0,
            quantity: c.quantity,
            tax_rate: taxRate * 10000,
            total_amount,
            total_tax_amount,
          })
        })
      } else {
        // Find the discount for current item and default to 0
        const itemDiscount =
          (itemDiscounts &&
            itemDiscounts.find((el) => el.lineItem._id === item._id)) ||
          0

        // Withdraw discount from the total item amount
        const quantity = item.quantity
        const unit_price = item.content.unit_price * 100 * (taxRate + 1)
        const total_discount_amount = itemDiscount * (taxRate + 1) * 100
        const total_amount = unit_price * quantity - total_discount_amount
        const total_tax_amount = total_amount * (taxRate / (1 + taxRate))

        order_lines.push({
          name: item.title,
          tax_rate: taxRate * 10000,
          quantity,
          unit_price,
          total_discount_amount,
          total_amount,
          total_tax_amount,
        })
      }
    })

    if (cart.shipping_methods.length) {
      const shippingMethod = cart.shipping_methods[0]
      const price = shippingMethod.price
      order_lines.push({
        name: `${shippingMethod.name}`,
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
      order.purchase_country = cart.billing_address.country
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

      // If the cart does have shipping methods, set the selected shipping method

      order.shipping_options = shippingOptions.map((so) => ({
        id: so._id,
        name: so.name,
        price: so.price * (1 + tax_rate) * 100,
        tax_amount: so.price * tax_rate * 100,
        tax_rate: tax_rate * 10000,
        preselected: shippingOptions.length === 1
      }))
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
      return this.klarna_.get(`${this.klarnaOrderUrl_}/${paymentData.order_id}`)
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
          merchant_reference1: orderId
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
