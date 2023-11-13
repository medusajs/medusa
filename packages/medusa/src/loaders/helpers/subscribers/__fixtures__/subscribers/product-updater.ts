import { ProductService } from "../../../../../services"
import { SubscriberConfig } from "../../../../../types/subscribers"

export default async function productUpdater() {
  return Promise.resolve()
}

export const config: SubscriberConfig = {
  event: ProductService.Events.UPDATED,
  context: {
    subscriberId: "product-updater",
  },
}
