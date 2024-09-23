import { SubscriberArgs, SubscriberConfig } from "../../types"

export default async function orderNotifier(_: SubscriberArgs) {
  return await Promise.resolve()
}

export const config: SubscriberConfig = {
  event: ["order.placed", "order.canceled", "order.completed"],
  context: { subscriberId: "order-notifier" },
}
