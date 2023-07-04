class VariantSubscriber {
  constructor({ manager, eventBusService, restockNotificationService }) {
    this.manager_ = manager
    this.restockNotificationService_ = restockNotificationService

    eventBusService.subscribe(
      "product-variant.updated",
      this.handleVariantUpdate
    )

    eventBusService.subscribe(
      "restock-notification.execute",
      this.handleDelayedExecute
    )
  }

  handleDelayedExecute = async (data) => {
    const { variant_id } = data
    return await this.restockNotificationService_.restockExecute(variant_id)
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

    return Promise.resolve()
  }
}

export default VariantSubscriber
