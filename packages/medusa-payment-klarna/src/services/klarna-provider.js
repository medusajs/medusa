import _ from "lodash"
import axios from "axios"
import { PaymentService } from "medusa-interfaces"

class KlarnaProviderService extends PaymentService {
  static identifier = "klarna"

  constructor({ totalsService, regionService }, options) {
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

    this.backendUrl_ = process.env.BACKEND_URL || ""

    this.totalsService_ = totalsService

    this.regionService_ = regionService
  }

  async lineItemsToOrderLines_(cart, taxRate) {
    let order_lines = []
    // Find the discount, that is not free shipping
    const discount = cart.discounts.find(
      ({ discount_rule }) => discount_rule.type !== "free_shipping"
    )
    // If the discount has an item specific allocation method,
    // we need to fetch the discount for each item
    const itemDiscounts = await this.totalsService_.getAllocationItemDiscounts(
      discount,
      cart
    )

    cart.items.forEach((item) => {
      // For bundles, we create an order line for each item in the bundle
      if (Array.isArray(item.content)) {
        item.content.forEach((c) => {
          const total_amount = c.unit_price * c.quantity * (taxRate + 1)
          const total_tax_amount = total_amount * taxRate

          order_lines.push({
            unit_price: c.unit_price,
            // Medusa does not allow discount on bundles
            total_discount_amount: 0,
            quantity: c.quantity,
            tax_rate: taxRate,
            total_amount,
            total_tax_amount,
          })
        })
      } else {
        const total_amount =
          item.content.unit_price * item.content.quantity * (taxRate + 1)
        const total_tax_amount = total_amount * taxRate

        // Find the discount for current item and default to 0
        const itemDiscount =
          (itemDiscounts &&
            itemDiscounts.find((el) => el.lineItem._id === item._id)) ||
          0

        // Withdraw discount from the total item amount
        const total_discount_amount =
          total_amount - itemDiscount * (taxRate + 1)

        order_lines.push({
          unit_price: item.content.unit_price,
          quantity: item.content.quantity,
          total_discount_amount,
          tax_rate: taxRate,
          total_amount,
          total_tax_amount,
        })
      }
    })
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

    order.order_lines = this.lineItemsToOrderLines_(cart, tax_rate)

    if (cart.billing_address) {
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
    if (cart.billing_address.country) {
      order.purchase_country = cart.billing_address.country
    } else {
      // Defaults to Sweden
      order.purchase_country = "SE"
    }

    order.order_amount = this.totalsService_.getTotal(cart)
    order.order_tax_amount = this.totalsService_.getTaxTotal(cart)
    // TODO: Check if currency matches ISO
    order.purchase_currency = currency_code

    order.merchant_urls = {
      terms: this.options_.merchant_urls.terms,
      checkout: this.options_.merchant_urls.checkout,
      confirmation: this.options_.merchant_urls.confirmation,
      push: `${this.backendUrl_}/klarna/hooks/push`,
      shipping_option_update: `${this.backendUrl_}/klarna/hooks/shipping`,
      address_update: `${this.backendUrl_}/klarna/hooks/address`,
    }

    // If the cart does not have shipping methods yet, preselect one from
    // shipping_options and set the selected shipping method
    if (!cart.shipping_methods) {
      const shipping_method = cart.shipping_options[0]
      order.selected_shipping_option = {
        id: shipping_method._id,
        // TODO: Add shipping method name
        name: shipping_method.provider_id,
        price: shipping_method.price * (1 + tax_rate) * 100,
        tax_amount: shipping_method.price * tax_rate * 100,
        // Medusa tax rate of e.g. 0.25 (25%) needs to be 2500 in Klarna
        tax_rate: tax_rate * 10000,
      }
    }

    // If the cart does have shipping methods, set the selected shipping method
    if (cart.shipping_methods) {
      const shipping_method = cart.shipping_methods[0]
      order.selected_shipping_option = {
        id: shipping_method._id,
        name: shipping_method.provider_id,
        price: shipping_method.price * (1 + tax_rate) * 100,
        tax_amount: shipping_method.price * tax_rate * 100,
        tax_rate: tax_rate * 10000,
      }
    }

    order.shipping_options = cart.shipping_options.map((so) => ({
      id: so._id,
      name: so.provider_id,
      price: so.price * (1 + tax_rate) * 100,
      tax_amount: so.price * tax_rate * 100,
      tax_rate: tax_rate * 10000,
      preselected:
        cart.shipping_methods[0] &&
        `${cart.shipping_methods[0].provider_id}` === `${so.provider_id}`,
    }))

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
      const order = await this.klarna_.get(
        `${this.klarnaOrderUrl_}/${order_id}`
      )
      // TODO: Klarna docs does not provide a list of statues, so we need to
      // play around our selves to figure it out
      let status = "initial"
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
      return this.klarna_.post(this.klarnaOrderUrl__, order)
    } catch (error) {
      throw error
    }
  }

  /**
   * Retrieves Klarna Order.
   * @param {string} cart - the cart to retrieve order for
   * @returns {Object} Klarna order
   */
  async retrievePayment(cart) {
    try {
      const { data } = cart.payment_method
      return this.klarna_.get(`${this.klarnaOrderUrl_}/${data.order_id}`)
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
  async acknowledgeOrder(klarnaOrderId) {
    try {
      await this.klarna_.post(
        `${this.klarnaOrderManagementUrl_}/${klarnaOrderId}/acknowledge`,
        {}
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
  async updatePayment(order, update) {
    try {
      const { data } = order.payment_method
      return this.klarna_.post(
        `${this.klarnaOrderUrl_}/${data.order_id}`,
        update
      )
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
