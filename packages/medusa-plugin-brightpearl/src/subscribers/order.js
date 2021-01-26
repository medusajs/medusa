class OrderSubscriber {
  constructor({
    eventBusService,
    orderService,
    swapService,
    returnService,
    paymentProviderService,
    brightpearlService,
    fulfillmentService,
  }) {
    this.orderService_ = orderService
    this.brightpearlService_ = brightpearlService
    this.swapService_ = swapService
    this.returnService_ = returnService
    this.paymentProviderService_ = paymentProviderService
    this.fulfillmentService_ = fulfillmentService

    eventBusService.subscribe("order.placed", this.sendToBrightpearl)

    eventBusService.subscribe("order.refund_created", this.registerRefund)

    eventBusService.subscribe("order.items_returned", this.registerReturn)

    eventBusService.subscribe(
      "order.payment_captured",
      this.registerCapturedPayment
    )

    eventBusService.subscribe("order.shipment_created", this.registerShipment)
    eventBusService.subscribe("swap.shipment_created", this.registerShipment)

    // Before we initiate a swap we wait for the payment and the return
    eventBusService.subscribe(
      "swap.payment_completed",
      this.registerSwapPayment
    )
    eventBusService.subscribe("order.swap_received", this.registerSwap)
  }

  sendToBrightpearl = (data) => {
    return this.brightpearlService_.createSalesOrder(data.id)
  }

  registerCapturedPayment = ({ id }) => {
    return this.brightpearlService_.createPayment(id)
  }

  registerSwapPayment = async (data) => {
    return this.registerSwap({ id: data.id, swap_id: data.id })
  }

  registerSwap = async (data) => {
    const { id, swap_id } = data

    if (!id && !swap_id) {
      return
    }

    const fromSwap = await this.swapService_.retrieve(swap_id, {
      relations: [
        "order",
        "order.payments",
        "order.region",
        "order.swaps",
        "order.discounts",
        "return_order",
        "return_order.items",
        "return_order.shipping_method",
        "additional_items",
        "shipping_address",
        "shipping_methods",
      ],
    })
    let fromOrder = fromSwap.order

    if (
      !(
        fromSwap.confirmed_at !== null &&
        fromSwap.return_order.status === "received"
      )
    ) {
      return
    }

    await this.brightpearlService_.createSwapCredit(fromOrder, fromSwap)
    await this.brightpearlService_.createSwapOrder(fromOrder, fromSwap)
  }

  registerShipment = async (data) => {
    const { fulfillment_id } = data
    const shipment = await this.fulfillmentService_.retrieve(fulfillment_id)
    const noteId = shipment.metadata.goods_out_note
    if (noteId) {
      await this.brightpearlService_.registerGoodsOutTrackingNumber(
        noteId,
        shipment
      )
      await this.brightpearlService_.registerGoodsOutShipped(noteId, shipment)
    }
  }

  registerReturn = async (data) => {
    const { id, return_id } = data

    const order = await this.orderService_.retrieve(id, {
      relations: ["region", "payments"],
    })

    const fromReturn = await this.returnService_.retrieve(return_id, {
      relations: ["items"],
    })

    return this.brightpearlService_
      .createSalesCredit(order, fromReturn)
      .catch((err) => console.log(err))
  }

  registerRefund = async (data) => {
    const { id, refund_id } = data
    const order = await this.orderService_.retrieve(id, {
      relations: ["region", "payments"],
    })
    const refund = await this.paymentProviderService_.retrieveRefund(refund_id)
    return this.brightpearlService_
      .createRefundCredit(order, refund)
      .catch((err) => console.log(err))
  }
}

export default OrderSubscriber
