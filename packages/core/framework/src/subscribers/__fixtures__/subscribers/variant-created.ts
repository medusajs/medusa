import { SubscriberArgs, SubscriberConfig } from "../../types"

export default async function (_: SubscriberArgs) {
  return await Promise.resolve()
}

export const config: SubscriberConfig = {
  event: "variant.created",
}
