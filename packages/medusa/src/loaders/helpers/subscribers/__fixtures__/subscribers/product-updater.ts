import {
  SubscriberArgs,
  SubscriberConfig,
} from "../../../../../types/subscribers"

export default async function productUpdater({
  data,
  eventName,
  container,
  pluginOptions,
}: SubscriberArgs) {
  return Promise.resolve()
}

export const config: SubscriberConfig = {
  event: "product.updated",
  context: {
    subscriberId: "product-updater",
  },
}
