import { MedusaContainer } from "@medusajs/types"

interface SubscriberContext extends Record<string, unknown> {
  subscriberId?: string
}

export type SubscriberConfig = {
  event: string | string[]
  context?: SubscriberContext
}

export type SubscriberHandler<T> = (
  data: T,
  eventName: string,
  container: MedusaContainer,
  pluginOptions: Record<string, unknown>
) => Promise<void>
