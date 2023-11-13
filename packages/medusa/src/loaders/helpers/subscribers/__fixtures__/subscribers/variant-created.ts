import { ProductVariantService } from "../../../../../services"
import { SubscriberConfig } from "../../../../../types/subscribers"

export default async function () {
  return Promise.resolve()
}

export const config: SubscriberConfig = {
  event: ProductVariantService.Events.CREATED,
}
