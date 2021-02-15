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
    {
      storeService,
      orderService,
      returnService,
      swapService,
      claimService,
      fulfillmentService,
      fulfillmentProviderService,
      totalsService,
    },
    options
  ) {
    super()

    this.options_ = options

    this.fulfillmentProviderService_ = fulfillmentProviderService
    this.storeService_ = storeService
    this.orderService_ = orderService
    this.claimService_ = claimService
    this.returnService_ = returnService
    this.swapService_ = swapService
    this.fulfillmentService_ = fulfillmentService
    this.totalsService_ = totalsService

    SendGrid.setApiKey(options.api_key)
  }

  async fetchAttachments(event, data) {
    switch (event) {
      case "swap.created":
      case "order.return_requested": {
        let attachments = []
        const { shipping_method, shipping_data } = data.return_request
        if (shipping_method) {
          const provider = shipping_method.shipping_option.provider_id

          const lbl = await this.fulfillmentProviderService_.retrieveDocuments(
            provider,
            shipping_data,
            "label"
          )

          attachments = attachments.concat(
            lbl.map((d) => ({
              name: "return-label",
              base64: d.base_64,
              type: d.type,
            }))
          )

          const inv = await this.fulfillmentProviderService_.retrieveDocuments(
            provider,
            shipping_data,
            "invoice"
          )

          attachments = attachments.concat(
            inv.map((d) => ({
              name: "invoice",
              base64: d.base_64,
              type: d.type,
            }))
          )
        }

        return attachments
      }
      default:
        return []
    }
  }

  async fetchData(event, eventData, attachmentGenerator) {
    switch (event) {
      case "order.return_requested":
        return this.returnRequestedData(eventData, attachmentGenerator)
      case "swap.shipment_created":
        return this.swapShipmentCreatedData(eventData, attachmentGenerator)
      case "claim.shipment_created":
        return this.claimShipmentCreatedData(eventData, attachmentGenerator)
      case "order.items_returned":
        return this.itemsReturnedData(eventData, attachmentGenerator)
      case "order.swap_received":
        return this.swapReceivedData(eventData, attachmentGenerator)
      case "swap.created":
        return this.swapCreatedData(eventData, attachmentGenerator)
      case "gift_card.created":
        return this.gcCreatedData(eventData, attachmentGenerator)
      case "order.gift_card_created":
        return this.gcCreatedData(eventData, attachmentGenerator)
      case "order.placed":
        return this.orderPlacedData(eventData, attachmentGenerator)
      case "order.shipment_created":
        return this.orderShipmentCreatedData(eventData, attachmentGenerator)
      case "order.canceled":
        return this.orderCanceledData(eventData, attachmentGenerator)
      case "user.password_reset":
        return this.userPasswordResetData(eventData, attachmentGenerator)
      case "customer.password_reset":
        return this.customerPasswordResetData(eventData, attachmentGenerator)
      default:
        return {}
    }
  }

  getTemplateId(event) {
    switch (event) {
      case "order.return_requested":
        return this.options_.order_return_requested_template
      case "swap.shipment_created":
        return this.options_.swap_shipment_created_template
      case "claim.shipment_created":
        return this.options_.claim_shipment_created_template
      case "order.items_returned":
        return this.options_.order_items_returned_template
      case "order.swap_received":
        return this.options_.order_swap_received_template
      case "swap.created":
        return this.options_.swap_created_template
      case "gift_card.created":
        return this.options_.gift_card_created_template
      case "order.gift_card_created":
        return this.options_.gift_card_created_template
      case "order.placed":
        return this.options_.order_placed_template
      case "order.shipment_created":
        return this.options_.order_shipped_template
      case "order.canceled":
        return this.options_.order_canceled_template
      case "user.password_reset":
        return this.options_.user_password_reset_template
      case "customer.password_reset":
        return this.options_.customer_password_reset_template
      default:
        return null
    }
  }

  async sendNotification(event, eventData, attachmentGenerator) {
    let templateId = this.getTemplateId(event)

    if (!templateId) {
      return false
    }

    const data = await this.fetchData(event, eventData, attachmentGenerator)
    const attachments = await this.fetchAttachments(event, data)

    const sendOptions = {
      template_id: templateId,
      from: this.options_.from,
      to: data.email,
      dynamic_template_data: data,
      has_attachments: attachments?.length,
    }

    if (attachments?.length) {
      sendOptions.has_attachments = true
      sendOptions.attachments = attachments.map((a) => {
        return {
          content: a.base64,
          filename: a.name,
          type: a.type,
          disposition: "attachment",
          contentId: a.name,
        }
      })
    }

    const status = await SendGrid.send(sendOptions)
      .then(() => "sent")
      .catch(() => "failed")

    // We don't want heavy docs stored in DB
    delete sendOptions.attachments

    return { to: data.email, status, data: sendOptions }
  }

  async resendNotification(notification, config) {
    const sendOptions = {
      ...notification.data,
      to: config.to || notification.to,
    }

    if (notification.data?.has_attachments) {
      const attachs = await this.fetchAttachments(
        notification.event_name,
        notification.data.dynamic_template_data
      )

      sendOptions.attachments = attachs.map((a) => {
        return {
          content: a.base64,
          filename: a.name,
          type: a.type,
          disposition: "attachment",
          contentId: a.name,
        }
      })
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

  async orderShipmentCreatedData({ id, fulfillment_id }, attachmentGenerator) {
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
      ],
    })

    const shipment = await this.fulfillmentService_.retrieve(fulfillment_id, {
      relations: ["items"],
    })

    return {
      order,
      email: order.email,
      fulfillment: shipment,
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

    const items = this.processItems_(order.items, taxRate, currencyCode)

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
      has_discounts: order.discounts.length,
      has_gift_cards: order.gift_cards.length,
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
    // Fetch the return request
    const returnRequest = await this.returnService_.retrieve(return_id, {
      relations: [
        "items",
        "shipping_method",
        "shipping_method.shipping_option",
      ],
    })

    // Fetch the order
    const order = await this.orderService_.retrieve(id, {
      relations: ["items", "discounts", "shipping_address"],
    })

    // Calculate which items are in the return
    const returnItems = returnRequest.items.map((i) => {
      const found = order.items.find((oi) => oi.id === i.item_id)
      return {
        ...found,
        quantity: i.quantity,
      }
    })

    const taxRate = order.tax_rate / 100
    const currencyCode = order.currency_code.toUpperCase()

    // Get total of the returned products
    const item_subtotal = this.totalsService_.getRefundTotal(order, returnItems)

    // If the return has a shipping method get the price and any attachments
    let shippingTotal = 0
    if (returnRequest.shipping_method) {
      shippingTotal = returnRequest.shipping_method.price * (1 + taxRate)
    }

    return {
      has_shipping: !!returnRequest.shipping_method,
      email: order.email,
      items: this.processItems_(returnItems, taxRate, currencyCode),
      subtotal: `${this.humanPrice_(item_subtotal)} ${currencyCode}`,
      shipping_total: `${this.humanPrice_(shippingTotal)} ${currencyCode}`,
      refund_amount: `${this.humanPrice_(
        returnRequest.refund_amount
      )} ${currencyCode}`,
      return_request: {
        ...returnRequest,
        refund_amount: `${this.humanPrice_(
          returnRequest.refund_amount
        )} ${currencyCode}`,
      },
      order,
      date: returnRequest.updated_at.toDateString(),
    }
  }

  async swapCreatedData({ id }) {
    const store = await this.storeService_.retrieve()
    const swap = await this.swapService_.retrieve(id, {
      relations: [
        "additional_items",
        "return_order",
        "return_order.items",
        "return_order.shipping_method",
        "return_order.shipping_method.shipping_option",
      ],
    })

    const swapLink = store.swap_link_template.replace(
      /\{cart_id\}/,
      swap.cart_id
    )

    const order = await this.orderService_.retrieve(swap.order_id, {
      relations: ["items", "discounts", "shipping_address"],
    })

    const taxRate = order.tax_rate / 100
    const currencyCode = order.currency_code.toUpperCase()

    const returnItems = this.processItems_(
      swap.return_order.items.map((i) => {
        const found = order.items.find((oi) => oi.id === i.item_id)
        return {
          ...found,
          quantity: i.quantity,
        }
      }),
      taxRate,
      currencyCode
    )

    const returnTotal = this.totalsService_.getRefundTotal(order, returnItems)

    const constructedOrder = {
      ...order,
      shipping_methods: [],
      items: swap.additional_items,
    }

    const additionalTotal = this.totalsService_.getTotal(constructedOrder)

    const refundAmount = swap.return_order.refund_amount

    return {
      swap,
      order,
      return_request: swap.return_order,
      date: swap.updated_at.toDateString(),
      swap_link: swapLink,
      email: order.email,
      items: this.processItems_(swap.additional_items, taxRate, currencyCode),
      return_items: returnItems,
      return_total: `${this.humanPrice_(returnTotal)} ${currencyCode}`,
      refund_amount: `${this.humanPrice_(refundAmount)} ${currencyCode}`,
      additional_total: `${this.humanPrice_(additionalTotal)} ${currencyCode}`,
    }
  }

  async itemsReturnedData(data) {
    return this.returnRequestedData(data)
  }

  async swapShipmentCreatedData({ id, fulfillment_id }) {
    const swap = await this.swapService_.retrieve(id, {
      relations: [
        "shipping_address",
        "shipping_methods",
        "additional_items",
        "return_order",
        "return_order.items",
      ],
    })

    const order = await this.orderService_.retrieve(swap.order_id, {
      relations: ["items", "discounts"],
    })

    const taxRate = order.tax_rate / 100
    const currencyCode = order.currency_code.toUpperCase()

    const returnItems = this.processItems_(
      swap.return_order.items.map((i) => {
        const found = order.items.find((oi) => oi.id === i.item_id)
        return {
          ...found,
          quantity: i.quantity,
        }
      }),
      taxRate,
      currencyCode
    )

    const returnTotal = this.totalsService_.getRefundTotal(order, returnItems)

    const constructedOrder = {
      ...order,
      shipping_methods: swap.shipping_methods,
      items: swap.additional_items,
    }

    const additionalTotal = this.totalsService_.getTotal(constructedOrder)

    const refundAmount = swap.return_order.refund_amount

    const shipment = await this.fulfillmentService_.retrieve(fulfillment_id)

    return {
      swap,
      order,
      items: this.processItems_(swap.additional_items, taxRate, currencyCode),
      date: swap.updated_at.toDateString(),
      email: order.email,
      tax_amount: `${this.humanPrice_(
        swap.difference_due * taxRate
      )} ${currencyCode}`,
      paid_total: `${this.humanPrice_(swap.difference_due)} ${currencyCode}`,
      return_total: `${this.humanPrice_(returnTotal)} ${currencyCode}`,
      refund_amount: `${this.humanPrice_(refundAmount)} ${currencyCode}`,
      additional_total: `${this.humanPrice_(additionalTotal)} ${currencyCode}`,
      fulfillment: shipment,
      tracking_number: shipment.tracking_numbers.join(", "),
    }
  }

  async claimShipmentCreatedData({ id, fulfillment_id }) {
    const claim = await this.claimService_.retrieve(id, {
      relations: ["order", "order.items", "order.shipping_address"],
    })

    const shipment = await this.fulfillmentService_.retrieve(fulfillment_id)

    return {
      email: claim.order.email,
      claim,
      order: claim.order,
      fulfillment: shipment,
      tracking_number: shipment.tracking_numbers.join(", "),
    }
  }

  userPasswordResetData(data) {
    return data
  }

  customerPasswordResetData(data) {
    return data
  }

  processItems_(items, taxRate, currencyCode) {
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
