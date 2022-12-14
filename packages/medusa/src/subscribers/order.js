class OrderSubscriber {
  constructor({
    manager,
    eventBusService,
    discountService,
    giftCardService,
    totalsService,
    orderService,
    draftOrderService,
    regionService,
  }) {
    this.manager_ = manager
    this.totalsService_ = totalsService

    this.discountService_ = discountService

    this.giftCardService_ = giftCardService

    this.orderService_ = orderService

    this.draftOrderService_ = draftOrderService

    this.regionService_ = regionService

    this.eventBus_ = eventBusService

    this.eventBus_.subscribe("order.placed", this.handleOrderPlaced)

    this.eventBus_.subscribe("order.placed", this.updateDraftOrder)
  }

  handleOrderPlaced = async (data) => {
    const order = await this.orderService_.retrieveWithTotals(data.id, {
      relations: ["discounts", "discounts.rule"],
    })

    await Promise.all(
      order.discounts.map(async (d) => {
        const usageCount = d?.usage_count || 0
        return this.discountService_.update(d.id, {
          usage_count: usageCount + 1,
        })
      })
    )
  }

  updateDraftOrder = async (data) => {
    const order = await this.orderService_.retrieve(data.id)
    const draftOrder = await this.draftOrderService_
      .retrieveByCartId(order.cart_id)
      .catch((_) => null)

    if (draftOrder) {
      await this.draftOrderService_.registerCartCompletion(
        draftOrder.id,
        order.id
      )
    }
  }
}

export default OrderSubscriber
