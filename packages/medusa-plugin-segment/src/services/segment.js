import Analytics from "analytics-node"
import axios from "axios"
import { BaseService } from "medusa-interfaces"

class SegmentService extends BaseService {
  /**
   * @param {Object} options - options defined in `medusa-config.js`
   *    e.g.
   *    {
   *      write_key: Segment write key given in Segment dashboard
   *    }
   */
  constructor({ totalsService }, options) {
    super()

    this.options_ = options
    this.totalsService_ = totalsService

    this.analytics_ = new Analytics(options.write_key)
  }

  /**
   * Wrapper around segment's identify call
   */
  identify(data) {
    return this.analytics_.identify(data)
  }

  track(data) {
    return this.analytics_.track(data)
  }

  async getReportingValue(fromCurrency, value) {
    const date = "latest"
    const toCurrency =
      (this.options_.reporting_currency &&
        this.options_.reporting_currency.toUpperCase()) ||
      "EUR"

    if (fromCurrency === toCurrency) return value.toFixed(2)

    const exchangeRate = await axios
      .get(
        `https://api.exchangeratesapi.io/${date}?symbols=${fromCurrency}&base=${toCurrency}`
      )
      .then(({ data }) => {
        return data.rates[fromCurrency]
      })

    return (value / exchangeRate).toFixed(2)
  }

  async buildOrder(order) {
    const subtotal = await this.totalsService_.getSubtotal(order)
    const total = await this.totalsService_.getTotal(order)
    const tax = await this.totalsService_.getTaxTotal(order)
    const discount = await this.totalsService_.getDiscountTotal(order)
    const shipping = await this.totalsService_.getShippingTotal(order)
    const revenue = total - tax

    let coupon
    if (order.discounts && order.discounts.length) {
      coupon = order.discounts[0].code
    }

    const orderData = {
      checkout_id: order.cart_id,
      order_id: order._id,
      email: order.email,
      region_id: order.region_id,
      payment_provider: order.payment_method.provider_id,
      shipping_methods: order.shipping_methods,
      shipping_country: order.shipping_address.country_code,
      shipping_city: order.shipping_address.city,
      reporting_total: await this.getReportingValue(order.currency_code, total),
      reporting_subtotal: await this.getReportingValue(
        order.currency_code,
        subtotal
      ),
      reporting_revenue: await this.getReportingValue(
        order.currency_code,
        revenue
      ),
      reporting_shipping: await this.getReportingValue(
        order.currency_code,
        shipping
      ),
      reporting_tax: await this.getReportingValue(order.currency_code, tax),
      reporting_discount: await this.getReportingValue(
        order.currency_code,
        discount
      ),
      total,
      subtotal,
      revenue,
      shipping,
      tax,
      discount,
      coupon,
      currency: order.currency_code,
      products: await Promise.all(
        order.items.map(async (item) => {
          let name = item.title

          const unit_price = item.content.unit_price
          const line_total = unit_price * item.content.quantity * item.quantity
          const revenue = await this.getReportingValue(
            order.currency_code,
            line_total
          )

          const skuParts = item.content.variant.sku.split("-")
          skuParts.pop()

          return {
            name,
            variant: item.content.variant.sku,
            price: unit_price,
            reporting_revenue: revenue,
            product_id: `${item.content.product._id}`,
            sku: skuParts.join("-"),
            quantity: item.quantity,
          }
        })
      ),
    }

    return orderData
  }
}

export default SegmentService
