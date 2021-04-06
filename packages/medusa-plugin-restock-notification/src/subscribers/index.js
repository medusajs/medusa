class VariantSubscriber {
  constructor({ eventBusService, restockNotificationService }) {
    this.restockNotificationService_ = restockNotificationService

    eventBusService.subscribe(
      "product_variant.updated",
      this.handleVariantUpdate
    )
  }

  handleVariantUpdate = async (data) => {
    const { id, fields } = data
    if (fields.includes("inventory_quantity")) {
      return this.restockNotificationService_.triggerRestock(id)
    }
  }
}

export default VariantSubscriber
