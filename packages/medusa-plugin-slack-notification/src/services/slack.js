import axios from "axios"
import moment from "moment"
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
    const order = await this.orderService_.retrieve(orderId)

    const subtotal = await this.totalsService_.getSubtotal(order)
    const shippingTotal = await this.totalsService_.getShippingTotal(order)
    const taxTotal = await this.totalsService_.getTaxTotal(order)
    const discountTotal = await this.totalsService_.getDiscountTotal(order)
    const total = await this.totalsService_.getTotal(order)

    let blocks = [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `Order *<${this.options_.admin_orders_url}/${order._id}|#${order.display_id}>* has been processed.`,
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
          text: `*Subtotal*\t${subtotal}\n*Shipping*\t${shippingTotal}\n*Discount Total*\t${discountTotal}\n*Tax*\t${taxTotal}\n*Total*\t${total}`,
        },
      },
    ]

    blocks.push({
      type: "divider",
    })

    order.items.forEach((lineItem) => {
      let line = {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*${lineItem.title}*\n${lineItem.quantity} x ${
            !Array.isArray(lineItem.content) && lineItem.content.unit_price
          }`,
        },
      }
      if (lineItem.thumbnail) {
        line.accessory.type = "image"
        line.accessory.image_url = lineItem.thumbnail
        line.accessory.alt_text = "Item"
      }

      blocks.push(line)

      blocks.push({
        type: "divider",
      })
    })

    return axios.post(this.options_.slack_url, {
      text: `Order ${order._id} was processed`,
      blocks,
    })
  }
}

export default SlackService
