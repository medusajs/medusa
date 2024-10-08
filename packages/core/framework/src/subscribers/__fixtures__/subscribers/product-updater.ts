import { SubscriberArgs, SubscriberConfig } from "../../types"

export default async function productUpdater(_: SubscriberArgs) {
  return await Promise.resolve()
}

export const config: SubscriberConfig = {
  event: "product.updated",
  context: {
    subscriberId: "product-updater",
  },
}
