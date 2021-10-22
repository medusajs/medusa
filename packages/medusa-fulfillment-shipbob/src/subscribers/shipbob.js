class ShipbobSubscriber {
  constructor({ eventBusService, shipbobFulfillmentService }) {
    this.shipbobService_ = shipbobFulfillmentService

    eventBusService.subscribe("shipbob.shipment", this.handleShipment)
  }

  handleShipment = async ({ headers, body }) => {
    if (headers.order_shipped === 'order_shipped') {
      return this.shipbobService_.orderShipped(body)
    }
    // should we update Shipment metadata?
  }
}

export default ShipbobSubscriber
