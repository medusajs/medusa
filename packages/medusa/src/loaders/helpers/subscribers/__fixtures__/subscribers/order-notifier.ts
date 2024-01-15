import { OrderService } from "../../../../../services"
import {
  SubscriberArgs,
  SubscriberConfig,
} from "../../../../../types/subscribers"

export default async function orderNotifier({
  data,
  eventName,
  container,
  pluginOptions,
}: SubscriberArgs) {
  return Promise.resolve()
}

export const config: SubscriberConfig = {
  event: [
    OrderService.Events.PLACED,
    OrderService.Events.CANCELED,
    OrderService.Events.COMPLETED,
  ],
}
