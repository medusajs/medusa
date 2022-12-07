import {
  CacheService,
  EventBusService,
  ProductVariantService,
} from "../services"

type ProductVariantUpdatedEventData = {
  id: string
  product_id: string
  fields: string[]
}

class PricingSubscriber {
  protected readonly eventBus_: EventBusService
  protected readonly cacheService_: CacheService

  constructor({ eventBusService, cacheService }) {
    this.eventBus_ = eventBusService
    this.cacheService_ = cacheService

    this.eventBus_.subscribe(
      ProductVariantService.Events.UPDATED,
      async (data) => {
        const { id, fields } = data as ProductVariantUpdatedEventData
        if (fields.includes("prices")) {
          await this.cacheService_.invalidate(`ps:${id}*`)
        }
      }
    )
  }
}

export default PricingSubscriber
