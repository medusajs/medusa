class OrderSubscriber {
  constructor({ eventBusService, orderService, brightpearlService }) {
    this.orderService_ = orderService
    this.brightpearlService_ = brightpearlService

    eventBusService.subscribe("order.placed", this.sendToBrightpearl)
    eventBusService.subscribe("order.payment_captured", this.registerCapturedPayment)
    eventBusService.subscribe("order.shipment_created", this.registerShipment)
  }

  sendToBrightpearl = order => {
    return this.brightpearlService_.createSalesOrder(order)
  }

  registerCapturedPayment = order => {
    return this.brightpearlService_.createCapturedPayment(order)
  }

  registerShipment = async (data) => {
    const { order_id, shipment } = data
    const order = await this.orderService_.retrieve(order_id)
    const notes = await this.brightpearlService_.createGoodsOutNote(order, shipment)
    if (notes.length) {
      const noteId = notes[0]
      await this.brightpearlService_.registerGoodsOutTrackingNumber(noteId, shipment)
      await this.brightpearlService_.registerGoodsOutShipped(noteId, shipment)
    }
  }
}

export default OrderSubscriber
