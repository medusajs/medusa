class WebshipperSubscriber {
  constructor({ eventBusService, logger, webshipperFulfillmentService }) {
    this.webshipperService_ = webshipperFulfillmentService

    eventBusService.subscribe("webshipper.shipment", this.handleShipment)
  }

  handleShipment = async ({ headers, body }) => {
    return this.webshipperService_.handleWebhook(headers, body).catch((err) => {
      logger.warn(err)
    })
  }
}

export default WebshipperSubscriber
