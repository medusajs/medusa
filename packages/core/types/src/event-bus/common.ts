import { Context } from "../shared-context"

export type Subscriber<T = unknown> = (
  data: T,
  eventName: string
) => Promise<void>

export type SubscriberContext = {
  subscriberId: string
}

export type SubscriberDescriptor = {
  id: string
  subscriber: Subscriber
}

export type EventHandler<T = unknown> = (
  data: T,
  eventName: string
) => Promise<void>

export type EmitData<T = unknown> = {
  eventName: string
  data: T
  options?: Record<string, unknown>
}

export type MessageBody<T = unknown> = {
  metadata: {
    source: string
    action: string
    object: string
    eventGroupId?: string
  }
  data: T
}

export type Message<T = unknown> = {
  eventName: string
  body: MessageBody<T>
  options?: Record<string, unknown>
}

export type RawMessageFormat<T = any> = {
  eventName: string
  data: T
  source: string
  object: string
  action?: string
  context?: Pick<Context, "eventGroupId">
  options?: Record<string, any>
}
