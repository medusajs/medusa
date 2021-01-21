class OrderSubscriber {
  constructor({
    manager,
    eventBusService,
    discountService,
    giftCardService,
    totalsService,
    orderService,
    regionService,
  }) {
    this.manager_ = manager
    this.totalsService_ = totalsService

    this.discountService_ = discountService

    this.giftCardService_ = giftCardService

    this.orderService_ = orderService

    this.regionService_ = regionService

    this.eventBus_ = eventBusService

    this.eventBus_.subscribe("order.placed", this.handleOrderPlaced)
  }

  handleOrderPlaced = async data => {
    const order = await this.orderService_.retrieve(data.id, {
      select: ["subtotal"],
      relations: ["discounts", "items", "gift_cards"],
    })

    await Promise.all(
      order.items.map(async i => {
        if (i.is_giftcard) {
          for (let qty = 0; qty < i.quantity; qty++) {
            await this.giftCardService_.create({
              region_id: order.region_id,
              order_id: order.id,
              value: i.unit_price,
              balance: i.unit_price,
              metadata: i.metadata,
            })
          }
        }
      })
    )

    await Promise.all(
      order.discounts.map(async d => {
        return this.discountService_.update(d.id, {
          usage_count: d.usage_count + 1,
        })
      })
    )
  }
}

export default OrderSubscriber
