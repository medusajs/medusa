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

    this.totalsService_ = totalsService
    this.options_ = options

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

  async getReportingValue(rawCurrency, value) {
    const fromCurrency = rawCurrency.toUpperCase()
    const date = "latest"
    const toCurrency =
      (this.options_.reporting_currency &&
        this.options_.reporting_currency.toUpperCase()) ||
      "EUR"

    if (fromCurrency === toCurrency) {
      return this.totalsService_.rounded(value)
    }

    const exchangeRate = await axios
      .get(
        `https://api.exchangeratesapi.io/${date}?symbols=${fromCurrency}&base=${toCurrency}`
      )
      .then(({ data }) => {
        return data.rates[fromCurrency]
      })

    return this.totalsService_.rounded(value / exchangeRate)
  }

  async buildOrder(order) {
    const subtotal = order.subtotal / 100
    const total = order.total / 100
    const tax = order.tax_total / 100
    const discount = order.discount_total / 100
    const shipping = order.shipping_total / 100
    const revenue = total - tax

    let coupon
    if (order.discounts && order.discounts.length) {
      coupon = order.discounts[0] && order.discounts[0].code
    }

    const orderData = {
      checkout_id: order.cart_id,
      order_id: order.id,
      email: order.email,
      region_id: order.region_id,
      payment_provider: order.payments.map((p) => p.provider_id).join(","),
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

          const unit_price = item.unit_price
          const line_total = (unit_price * item.quantity) / 100
          const revenue = await this.getReportingValue(
            order.currency_code,
            line_total
          )

          const skuParts = item.content.variant.sku.split("-")
          skuParts.pop()

          return {
            name,
            variant,
            price: unit_price / 100,
            reporting_revenue: revenue,
            product_id: item.variant.product_id,
            sku: item.variant.sku,
            quantity: item.quantity,
          }
        })
      ),
    }

    return orderData
  }
}

export default SegmentService
