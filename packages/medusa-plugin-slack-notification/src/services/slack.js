import axios from "axios"
import { zeroDecimalCurrencies, humanizeAmount } from "medusa-core-utils"
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

    const getDisplayAmount = (amount) => {
      const humanAmount = humanizeAmount(amount, currencyCode)
      if (zeroDecimalCurrencies.includes(currencyCode.toLowerCase())) {
        return humanAmount
      }
      return humanAmount.toFixed(2)
    }

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
          text: `*Subtotal*\t${getDisplayAmount(
            subtotal
          )} ${currencyCode}\n*Shipping*\t${getDisplayAmount(
            shipping_total
          )} ${currencyCode}\n*Discount Total*\t${getDisplayAmount(
            discount_total
          )} ${currencyCode}\n*Tax*\t${getDisplayAmount(
            tax_total
          )} ${currencyCode}\n*Total*\t${getDisplayAmount(
            total
          )} ${currencyCode}`,
        },
      },
    ]

    if (order.gift_card_total) {
      blocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Gift Card Total*\t${getDisplayAmount(
            order.gift_card_total
          )} ${currencyCode}`,
        },
      })
    }

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
          text: `*${lineItem.title}*\n${lineItem.quantity} x ${getDisplayAmount(
            lineItem.unit_price * (1 + taxRate)
          )} ${currencyCode}`,
        },
      }

      if (lineItem.thumbnail) {
        let url = lineItem.thumbnail
        if (lineItem.thumbnail.startsWith("//")) {
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
