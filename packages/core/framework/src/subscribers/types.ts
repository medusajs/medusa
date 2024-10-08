import { Event, MedusaContainer } from "@medusajs/types"

interface SubscriberContext extends Record<string, unknown> {
  subscriberId?: string
}

export type SubscriberConfig = {
  event: string | string[]
  context?: SubscriberContext
}

export type SubscriberArgs<T = unknown> = {
  event: Event<T>
  container: MedusaContainer
  pluginOptions: Record<string, unknown>
}
