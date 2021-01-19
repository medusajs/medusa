import axios from "axios"
import { BaseService } from "medusa-interfaces"

class SlackService extends BaseService {
  /**
   * @param {Object} options - options defined in `medusa-config.js`
   *    {
   *      slack_url: "https://hooks.slack.com/services/...",
   *      admin_orders_url: "https:..../orders"
   *    }
   */
  constructor({ orderService, totalsService, regionService }, options) {
    super()

    this.orderService_ = orderService

    this.totalsService_ = totalsService

    this.regionService_ = regionService

    this.options_ = options
  }

  async orderNotification(orderId) {
    const order = await this.orderService_.retrieve(orderId, {
      select: [
        "shipping_total",
        "discount_total",
        "tax_total",
        "refunded_total",
        "gift_card_total",
        "subtotal",
        "total",
      ],
      relations: [
        "customer",
        "billing_address",
        "shipping_address",
        "discounts",
        "shipping_methods",
        "payments",
        "fulfillments",
        "returns",
        "gift_cards",
        "gift_card_transactions",
        "swaps",
        "swaps.return_order",
        "swaps.payment",
        "swaps.shipping_methods",
        "swaps.shipping_address",
        "swaps.additional_items",
        "swaps.fulfillments",
      ],
    })

    const { subtotal, tax_total, discount_total, shipping_total, total } = order

    const currencyCode = order.currency_code.toUpperCase()
    const taxRate = order.tax_rate / 100

    let blocks = [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `Order *<${this.options_.admin_orders_url}/${order.id}|#${order.display_id}>* has been processed.`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Customer*\n${order.shipping_address.first_name} ${
            order.shipping_address.last_name
          }\n${order.email}\n*Destination*\n${
            order.shipping_address.address_1
          }\n${
            order.shipping_address.city
          }, ${order.shipping_address.country_code.toUpperCase()}`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Subtotal*\t${(subtotal / 100).toFixed(
            2
          )} ${currencyCode}\n*Shipping*\t${(shipping_total / 100).toFixed(
            2
          )} ${currencyCode}\n*Discount Total*\t${(
            discount_total / 100
          ).toFixed(2)} ${currencyCode}\n*Tax*\t${(tax_total / 100).toFixed(
            2
          )} ${currencyCode}\n*Total*\t${(total / 100).toFixed(
            2
          )} ${currencyCode}`,
        },
      },
    ]

    order.discounts.forEach((d) => {
      blocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Promo Code*\t${d.code} ${d.rule.value}${
            d.rule.type === "percentage" ? "%" : ` ${currencyCode}`
          }`,
        },
      })
    })

    blocks.push({
      type: "divider",
    })

    order.items.forEach((lineItem) => {
      let line = {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*${lineItem.title}*\n${lineItem.quantity} x ${(
            (lineItem.unit_price / 100) *
            (1 + taxRate)
          ).toFixed(2)} ${currencyCode}`,
        },
      }

      if (lineItem.thumbnail) {
        let url = lineItem.thumbnail
        if (
          !lineItem.thumbnail.startsWith("http:") &&
          !lineItem.thumbnail.startsWith("https:")
        ) {
          url = `https:${lineItem.thumbnail}`
        }

        line.accessory = {
          type: "image",
          alt_text: "Item",
          image_url: url,
        }
      }

      blocks.push(line)

      blocks.push({
        type: "divider",
      })
    })

    return axios.post(this.options_.slack_url, {
      text: `Order ${order.display_id} was processed`,
      blocks,
    })
  }
}

export default SlackService
