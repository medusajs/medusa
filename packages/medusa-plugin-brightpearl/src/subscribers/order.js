class OrderSubscriber {
  constructor({
    eventBusService,
    orderService,
    swapService,
    brightpearlService,
  }) {
    this.orderService_ = orderService
    this.brightpearlService_ = brightpearlService
    this.swapService_ = swapService

    eventBusService.subscribe("order.refund_created", this.registerRefund)

    eventBusService.subscribe("order.items_returned", this.registerReturn)

    eventBusService.subscribe("order.placed", this.sendToBrightpearl)

    eventBusService.subscribe(
      "order.payment_captured",
      this.registerCapturedPayment
    )

    eventBusService.subscribe("order.shipment_created", this.registerShipment)
    eventBusService.subscribe("swap.shipment_created", this.registerShipment)

    // Before we initiate a swap we wait for the payment and the return
    eventBusService.subscribe("swap.payment_completed", this.registerSwap)
    eventBusService.subscribe("order.swap_received", this.registerSwap)
  }

  sendToBrightpearl = (order) => {
    return this.brightpearlService_.createSalesOrder(order)
  }

  registerCapturedPayment = (order) => {
    return this.brightpearlService_.createPayment(order)
  }

  registerSwap = async (data) => {
    const { order, swap, swap_id } = data

    if (!order && !swap) {
      return
    }

    let fromOrder = order
    if (!fromOrder) {
      fromOrder = await this.orderService_.retrieve(swap.order_id)
    }

    let fromSwap
    if (swap) {
      fromSwap = await this.swapService_.retrieve(swap._id)
    } else {
      fromSwap = await this.swapService_.retrieve(swap_id)
    }

    if (!(fromSwap.is_paid && fromSwap.return.status === "received")) {
      return
    }

    await this.brightpearlService_.createSwapCredit(fromOrder, fromSwap)
    await this.brightpearlService_.createSwapOrder(fromOrder, fromSwap)

    const paySwap = await this.swapService_.retrieve(fromSwap._id)
    await this.brightpearlService_.createSwapPayment(paySwap)
  }

  registerShipment = async (data) => {
    const { shipment } = data
    const noteId = shipment.metadata.goods_out_note
    if (noteId) {
      await this.brightpearlService_.registerGoodsOutTrackingNumber(
        noteId,
        shipment
      )
      await this.brightpearlService_.registerGoodsOutShipped(noteId, shipment)
    }
  }

  registerReturn = (data) => {
    const { order, return: fromReturn } = data
    return this.brightpearlService_
      .createSalesCredit(order, fromReturn)
      .catch((err) => console.log(err))
  }

  registerRefund = (data) => {
    const { order, refund } = data
    return this.brightpearlService_
      .createRefundCredit(order, refund)
      .catch((err) => console.log(err))
  }
}

export default OrderSubscriber
