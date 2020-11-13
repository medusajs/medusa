class WebshipperSubscriber {
  constructor({ eventBusService, webshipperFulfillmentService }) {
    this.webshipperService_ = webshipperFulfillmentService

    eventBusService.subscribe("webshipper.shipment", this.handleShipment)
  }

  handleShipment = async ({ headers, body }) => {
    return this.webshipperService_.handleWebhook(headers, body)
  }
}

export default WebshipperSubscriber
