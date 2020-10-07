class OrderSubscriber {
  constructor({ eventBusService, orderService, brightpearlService }) {
    this.orderService_ = orderService
    this.brightpearlService_ = brightpearlService

    eventBusService.subscribe("order.refund_created", this.registerRefund)

    eventBusService.subscribe("order.items_returned", this.registerReturn)

    eventBusService.subscribe("order.placed", this.sendToBrightpearl)

    eventBusService.subscribe(
      "order.payment_captured",
      this.registerCapturedPayment
    )

    eventBusService.subscribe("order.shipment_created", this.registerShipment)
  }

  sendToBrightpearl = (order) => {
    return this.brightpearlService_.createSalesOrder(order)
  }

  registerCapturedPayment = (order) => {
    return this.brightpearlService_.createPayment(order)
  }

  registerShipment = async (data) => {
    const { order_id, shipment } = data
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
