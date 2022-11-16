import { ProductVariantService, EventBusService } from "../services"
import { Redis } from "ioredis"

type ProductVariantUpdatedEventData = {
  id: string
  product_id: string
  fields: string[]
}

class PricingSubscriber {
  protected readonly eventBus_: EventBusService
  protected readonly redis_: Redis

  constructor({ eventBusService, redisClient }) {
    this.eventBus_ = eventBusService
    this.redis_ = redisClient

    this.eventBus_.subscribe(
      ProductVariantService.Events.UPDATED,
      async (data) => {
        const { id, fields } = data as ProductVariantUpdatedEventData
        if (fields.includes("prices")) {
          await this.redis_.del()
          const keys = await this.redis_.keys(`ps:${id}*`)
          const pipeline = this.redis_.pipeline()

          keys.forEach(function (key) {
            pipeline.del(key)
          })

          await pipeline.exec()
        }
      }
    )
  }
}

export default PricingSubscriber
