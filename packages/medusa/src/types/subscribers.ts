import { MedusaContainer } from "@medusajs/types"

interface SubscriberContext extends Record<string, unknown> {
  subscriberId?: string
}

export type SubscriberConfig = {
  event: string | string[]
  context?: SubscriberContext
}

export type SubscriberArgs<T = unknown> = {
  data:
    | T
    | {
        metadata: {
          service: string
          action: string
          object: string
          eventGroupId?: string
        }
        data: T
      }
  eventName: string
  container: MedusaContainer
  pluginOptions: Record<string, unknown>
}
