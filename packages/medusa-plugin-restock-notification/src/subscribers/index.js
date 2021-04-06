class VariantSubscriber {
  constructor({ manager, eventBusService, restockNotificationService }) {
    this.manager_ = manager
    this.restockNotificationService_ = restockNotificationService

    eventBusService.subscribe(
      "product-variant.updated",
      this.handleVariantUpdate
    )
  }

  handleVariantUpdate = async (data) => {
    const { id, fields } = data
    if (fields.includes("inventory_quantity")) {
      return await this.manager_.transaction(
        async (m) =>
          await this.restockNotificationService_
            .withTransaction(m)
            .triggerRestock(id)
      )
    }
  }
}

export default VariantSubscriber
