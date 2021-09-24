class BillySubscriber {
  constructor({
    billyService,
    fulfillmentService,
    productVariantService,
    orderService,
    eventBusService,
  }) {
    this.billyService_ = billyService
    this.orderService_ = orderService
    this.fulfillmentService_ = fulfillmentService
    this.productVariantService_ = productVariantService
    eventBusService.subscribe("order.placed", this.handleOrderPlaced)
    eventBusService.subscribe("order.shipment_created", this.handleOrderShipped)
    eventBusService.subscribe(
      "order.payment_captured",
      this.handlePaymentCaptured
    )
  }

  handlePaymentCaptured = async data => {
    const order = await this.orderService_.retrieve(data.id, {
      select: [
        "total",
        "subtotal",
        "discount_total",
        "tax_total",
        "gift_card_total",
        "shipping_total",
      ],
      relations: ["region", "payments"],
    })

    return await this.billyService_.createCustomerPayment(order)
  }

  handleOrderPlaced = async data => {
    const order = await this.orderService_.retrieve(data.id, {
      select: [
        "total",
        "subtotal",
        "discount_total",
        "tax_total",
        "gift_card_total",
        "shipping_total",
      ],
      relations: ["region"],
    })

    return await this.billyService_.createCustomerInvoice(order)
  }

  handleOrderShipped = async data => {
    const order = await this.orderService_.retrieve(data.id, {
      select: [
        "total",
        "subtotal",
        "discount_total",
        "tax_total",
        "gift_card_total",
        "shipping_total",
      ],
      relations: ["region"],
    })

    const fulfillment = await this.fulfillmentService_.retrieve(
      data.fulfillment_id,
      {
        relations: ["items", "items.item"],
      }
    )

    const variants = await this.productVariantService_.list(
      { id: fulfillment.items.map(i => i.item.variant_id) },
      {
        relations: ["cost_price"],
      }
    )

    return await this.billyService_.createGoodsOut(order, fulfillment, variants)
  }
}

export default BillySubscriber
