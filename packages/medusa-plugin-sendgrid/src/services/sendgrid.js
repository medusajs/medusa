import { NotificationService } from "medusa-interfaces"
import SendGrid from "@sendgrid/mail"

class SendGridService extends NotificationService {
  static identifier = "sendgrid"

  /**
   * @param {Object} options - options defined in `medusa-config.js`
   *    e.g.
   *    {
   *      api_key: SendGrid api key
   *      from: Medusa <hello@medusa.example>,
   *      order_placed_template: 01234,
   *      order_updated_template: 56789,
   *      order_cancelled_template: 4242,
   *      user_password_reset_template: 0000,
   *      customer_password_reset_template: 1111,
   *    }
   */
  constructor(
    { orderService, returnService, swapService, fulfillmentService },
    options
  ) {
    super()

    this.options_ = options

    this.orderService_ = orderService
    this.returnService_ = returnService
    this.swapService_ = swapService
    this.fulfillmentService_ = fulfillmentService

    SendGrid.setApiKey(options.api_key)
  }

  // // order_refund_created_template: ``,
  // // order_return_requested_template: ``,
  // order_items_returned_template: `d-7b49dcd155d4462cad36f5c27d8883ec`,
  // // swap_shipment_created_template: ``,
  // // claim_created_template: ``,
  // claim_shipment_created_template: `d-655069147c474cd3be191539e1e1479a`,

  async sendNotification(event, eventData) {
    let templateId
    let data = {}

    switch (event) {
      case "order.return_requested":
        templateId = this.options_.order_return_requested_template
        if (templateId) {
          data = await this.returnRequestedData(eventData)
        }
        break
      case "swap.shipment_created":
        templateId = this.options_.swap_shipment_created_template
        if (templateId) {
          data = await this.swapShipmentCreatedData(eventData)
        }
        break
      case "claim.shipment_created":
        templateId = this.options_.claim_shipment_created_template
        if (templateId) {
          data = await this.claimShipmentCreatedData(eventData)
        }
        break
      case "order.items_returned":
        templateId = this.options_.order_items_returned_template
        if (templateId) {
          data = await this.itemsReturnedData(eventData)
        }
        break
      case "order.swap_received":
        templateId = this.options_.order_swap_received_template
        if (templateId) {
          data = await this.swapReceivedData(eventData)
        }
        break
      case "order.swap_created":
        templateId = this.options_.order_swap_created_template
        if (templateId) {
          data = await this.swapCreatedData(eventData)
        }
        break
      case "gift_card.created":
        templateId = this.options_.gift_card_created_template
        if (templateId) {
          data = await this.gcCreatedData(eventData)
        }
        break
      case "order.gift_card_created":
        templateId = this.options_.gift_card_created_template
        if (templateId) {
          data = await this.gcCreatedData(eventData)
        }
        break
      case "order.placed":
        templateId = this.options_.order_placed_template
        if (templateId) {
          data = await this.orderPlacedData(eventData)
        }
        break
      case "order.shipment_created":
        templateId = this.options_.order_shipped_template
        if (templateId) {
          data = await this.orderShipmentCreatedData(eventData)
        }
        break
      case "order.canceled":
        templateId = this.options_.order_canceled_template
        if (templateId) {
          data = await this.orderCanceledData(eventData)
        }
        break
      case "user.password_reset":
        templateId = this.options_.user_password_reset_template
        if (templateId) {
          data = await this.userPasswordResetData(eventData)
        }
        break
      case "customer.password_reset":
        templateId = this.options_.customer_password_reset_template
        if (templateId) {
          data = await this.customerPasswordResetData(eventData)
        }
        break
      default:
        return
    }

    if (!templateId) {
      return
    }

    const sendOptions = {
      template_id: templateId,
      from: this.options_.from,
      to: data.email,
      dynamic_template_data: data,
    }

    const status = await SendGrid.send(sendOptions)
      .then(() => "sent")
      .catch(() => "failed")

    return { to: data.email, status, data: sendOptions }
  }

  async resendNotification(notification, config) {
    const sendOptions = {
      ...notification.data,
      to: config.to || notification.to,
    }
    const status = await SendGrid.send(sendOptions)
      .then(() => "sent")
      .catch(() => "failed")

    return { to: sendOptions.to, status, data: sendOptions }
  }

  /**
   * Sends an email using SendGrid.
   * @param {string} templateId - id of template in SendGrid
   * @param {string} from - sender of email
   * @param {string} to - receiver of email
   * @param {Object} data - data to send in mail (match with template)
   * @returns {Promise} result of the send operation
   */
  async sendEmail(options) {
    try {
      return SendGrid.send(options)
    } catch (error) {
      throw error
    }
  }

  async orderShipmentCreatedData({ id, fulfillment_id }) {
    const order = await this.orderService_.retrieve(id, {
      select: [
        "shipping_total",
        "discount_total",
        "tax_total",
        "refunded_total",
        "gift_card_total",
        "subtotal",
        "total",
        "refundable_amount",
      ],
      relations: [
        "customer",
        "billing_address",
        "shipping_address",
        "discounts",
        "shipping_methods",
        "shipping_methods.shipping_option",
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

    const shipment = await this.fulfillmentService_.retrieve(fulfillment_id)

    return {
      ...order,
      tracking_number: shipment.tracking_numbers.join(", "),
    }
  }

  async orderPlacedData({ id }) {
    const order = await this.orderService_.retrieve(id, {
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
        "shipping_methods.shipping_option",
        "payments",
        "fulfillments",
        "returns",
        "gift_cards",
        "gift_card_transactions",
      ],
    })

    const {
      subtotal,
      tax_total,
      discount_total,
      shipping_total,
      gift_card_total,
      total,
    } = order

    const taxRate = order.tax_rate / 100
    const currencyCode = order.currency_code.toUpperCase()

    const items = order.items.map((i) => {
      return {
        ...i,
        thumbnail: this.normalizeThumbUrl_(i.thumbnail),
        price: `${this.humanPrice_(
          i.unit_price * (1 + taxRate)
        )} ${currencyCode}`,
      }
    })

    let discounts = []
    if (order.discounts) {
      discounts = order.discounts.map((discount) => {
        return {
          is_giftcard: false,
          code: discount.code,
          descriptor: `${discount.rule.value}${
            discount.rule.type === "percentage" ? "%" : ` ${currencyCode}`
          }`,
        }
      })
    }

    let giftCards = []
    if (order.gift_cards) {
      giftCards = order.gift_cards.map((gc) => {
        return {
          is_giftcard: true,
          code: gc.code,
          descriptor: `${gc.value} ${currencyCode}`,
        }
      })

      discounts.concat(giftCards)
    }

    return {
      ...order,
      date: order.created_at.toDateString(),
      items,
      discounts,
      subtotal: `${this.humanPrice_(subtotal * (1 + taxRate))} ${currencyCode}`,
      gift_card_total: `${this.humanPrice_(
        gift_card_total * (1 + taxRate)
      )} ${currencyCode}`,
      tax_total: `${this.humanPrice_(tax_total)} ${currencyCode}`,
      discount_total: `${this.humanPrice_(
        discount_total * (1 + taxRate)
      )} ${currencyCode}`,
      shipping_total: `${this.humanPrice_(
        shipping_total * (1 + taxRate)
      )} ${currencyCode}`,
      total: `${this.humanPrice_(total)} ${currencyCode}`,
    }
  }

  async gcCreatedData({ id }) {
    const giftCard = await this.giftCardService_.retrieve(id, {
      relations: ["region", "order"],
    })

    const taxRate = giftCard.region.tax_rate / 100

    return {
      ...giftCard,
      email: giftCard.order.email,
      display_value: giftCard.value * (1 + taxRate),
    }
  }

  async returnRequestedData({ id, return_id }) {
    const returnRequest = await this.returnService_.retrieve(return_id, {
      relations: ["items"],
    })

    const order = await this.orderService_.retrieve(id, {
      relations: ["items"],
    })

    const returnItems = returnRequest.items.map((i) => {
      const found = order.items.find((oi) => oi.id === i.item_id)
      return {
        ...found,
        quantity: i.quantity,
      }
    })

    return {
      return_request: {
        ...returnRequest,
        refund_amount: this.humanPrice_(returnRequest.refund_amount),
      },
      order,
      items: this.processItems_(returnItems),
    }
  }

  async swapCreatedData({ id }) {
    const swap = await this.swapService_.retrieve(id, {
      relations: [
        "order",
        "order.items",
        "additional_items",
        "return_order",
        "return_order.items",
      ],
    })

    const data = {
      ...swap,
      additional_items: this.processItems_(swap.additional_items),
    }

    if (swap.return_order) {
      const returnItems = swap.return_order.items.map((i) => {
        const found = order.items.find((oi) => oi.id === i.item_id)
        return {
          ...found,
          quantity: i.quantity,
        }
      })

      data.return_items = this.processItems_(returnItems)
    }

    return data
  }

  async itemsReturnedData(data) {
    return this.returnRequestedData(data)
  }

  async swapShipmentCreatedData({ id, fulfillment_id }) {
    const swap = await this.swapService_.retrieve(id, {
      relations: ["order"],
    })

    const shipment = await this.fulfillmentService_.retrieve(fulfillment_id)

    return {
      ...swap,
      tracking_number: shipment.tracking_numbers.join(", "),
    }
  }

  async claimShipmentCreatedData({ id, fulfillment_id }) {
    const claim = await this.claimService_.retrieve(id, {
      relations: ["order"],
    })

    const shipment = await this.fulfillmentService_.retrieve(fulfillment_id)

    return {
      ...claim,
      tracking_number: shipment.tracking_numbers.join(", "),
    }
  }

  userPasswordResetData(data) {
    return data
  }

  customerPasswordResetData(data) {
    return data
  }

  processItems_(items) {
    return items.map((i) => {
      return {
        ...i,
        thumbnail: this.normalizeThumbUrl_(i.thumbnail),
        price: `${this.humanPrice_(
          i.unit_price * (1 + taxRate)
        )} ${currencyCode}`,
      }
    })
  }

  humanPrice_(amount) {
    return amount ? (amount / 100).toFixed(2) : "0.00"
  }

  normalizeThumbUrl_(url) {
    if (url.startsWith("http")) {
      return url
    } else if (url.startsWith("//")) {
      return `https:${url}`
    }
    return url
  }
}

export default SendGridService
