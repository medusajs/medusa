import Analytics from "analytics-node"
import axios from "axios"
import { BaseService } from "medusa-interfaces"
import { humanizeAmount } from "medusa-core-utils"

class SegmentService extends BaseService {
  /**
   * @param {Object} options - options defined in `medusa-config.js`
   *    e.g.
   *    {
   *      write_key: Segment write key given in Segment dashboard
   *      use_ga_id: If set to true the plugin will look for a ga_id in the cart
   *        context if present this id will be used as the Google Analytics
   *        client id.
   *    }
   */
  constructor({ totalsService, productService }, options) {
    super()

    this.totalsService_ = totalsService
    this.options_ = options
    this.productService_ = productService

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
      return this.rounded_(value)
    }

    const exchangeRate = await axios
      .get(
        `https://api.exchangeratesapi.io/${date}?symbols=${fromCurrency}&base=${toCurrency}&access_key=${this.options_.exchange_rates_api_key}`
      )
      .then(({ data }) => {
        return data.rates[fromCurrency]
      })

    return this.rounded_(value / exchangeRate)
  }

  async buildOrder(order) {
    const curr = order.currency_code

    const subtotal = humanizeAmount(order.subtotal, curr)
    const total = humanizeAmount(order.total, curr)
    const tax = humanizeAmount(order.tax_total, curr)
    const discount = humanizeAmount(order.discount_total, curr)
    const shipping = humanizeAmount(order.shipping_total, curr)
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
      currency: order.currency_code.toUpperCase(),
      products: await Promise.all(
        order.items.map(async (item) => {
          let name = item.title
          const totals = await this.totalsService_.getLineItemTotals(
            item,
            order,
            {
              include_tax: true,
            }
          )

          const lineTotal = totals.total - totals.tax_total

          const revenue = await this.getReportingValue(
            curr,
            humanizeAmount(lineTotal, curr)
          )

          let sku = ""
          let variant = ""
          if (item.variant && item.variant.sku) {
            let skuParts = item.variant.sku.split("-")
            skuParts.pop()

            sku = skuParts.join("-")

            variant = item.variant.sku
          }

          const product = await this.productService_.retrieve(
            item.variant.product_id,
            { relations: ["collection", "type"] }
          )

          const toReturn = {
            name,
            variant,
            price: this.rounded_(
              humanizeAmount(lineTotal, curr) / item.quantity
            ),
            reporting_revenue: revenue,
            product_id: item.variant.product_id,
            category: product.collection?.title,
            subtitle: product.subtitle,
            type: product.type?.value,
            sku,
            quantity: item.quantity,
          }

          // If we are building a refund order include details about
          // the reason for return
          if (item.reason) {
            toReturn.reason_id = item.reason.id
            toReturn.reason_value = item.reason.value
          }

          if (item.note) {
            toReturn.note = item.note
          }

          return toReturn
        })
      ),
    }

    return orderData
  }

  rounded_(v) {
    return Number(Math.round(v + "e2") + "e-2")
  }
}

export default SegmentService
