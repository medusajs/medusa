class OrderSubscriber {
  constructor({
    paymentProviderService,
    customerService,
    eventBusService,
    discountService,
    totalsService,
    orderService,
    regionService,
  }) {
    this.totalsService_ = totalsService

    this.paymentProviderService_ = paymentProviderService

    this.customerService_ = customerService

    this.discountService_ = discountService

    this.orderService_ = orderService

    this.regionService_ = regionService

    this.eventBus_ = eventBusService

    this.eventBus_.subscribe("order.placed", async order => {
      await this.customerService_.addOrder(order.customer_id, order._id)

      const address = {
        ...order.shipping_address,
      }
      delete address._id

      await this.customerService_.addAddress(order.customer_id, address)
    })

    this.eventBus_.subscribe("order.placed", this.handleDiscounts)

    this.eventBus_.subscribe("order.placed", this.handleGiftCards)
  }

  handleDiscounts = async order => {
    await Promise.all(
      order.discounts.map(async d => {
        const subtotal = await this.totalsService_.getSubtotal(order)
        if (d.is_giftcard) {
          const discountRule = {
            ...d.discount_rule,
            value: Math.max(0, d.discount_rule.value - subtotal),
          }

          delete discountRule._id

          return this.discountService_.update(d._id, {
            discount_rule: discountRule,
            usage_count: d.usage_count + 1,
            disabled: discountRule.value === 0,
          })
        } else {
          return this.discountService_.update(d._id, {
            usage_count: d.usage_count + 1,
          })
        }
      })
    )
  }

  handleGiftCards = async order => {
    const region = await this.regionService_.retrieve(order.region_id)
    const items = await Promise.all(
      order.items.map(async i => {
        if (i.is_giftcard) {
          const giftcard = await this.discountService_
            .generateGiftCard(i.content.unit_price, region._id)
            .then(result => {
              this.eventBus_.emit("order.gift_card_created", {
                line_item: i,
                currency_code: region.currency_code,
                tax_rate: region.tax_rate,
                giftcard: result,
                email: order.email,
              })
              return result
            })
          return {
            ...i,
            metadata: {
              ...i.metadata,
              giftcard: giftcard._id,
            },
          }
        }
        return i
      })
    )

    return this.orderService_.update(order._id, {
      items,
    })
  }
}

export default OrderSubscriber
