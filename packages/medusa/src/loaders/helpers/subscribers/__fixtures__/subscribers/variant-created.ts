import {
  SubscriberArgs,
  SubscriberConfig,
} from "../../../../../types/subscribers"

export default async function ({
  data,
  eventName,
  container,
  pluginOptions,
}: SubscriberArgs) {
  return Promise.resolve()
}

export const config: SubscriberConfig = {
  event: "variant.created",
}
