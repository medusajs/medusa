import { Context } from "../shared-context"

export type Subscriber<TData = unknown> = (data: TData) => Promise<void>

export type SubscriberContext = {
  subscriberId: string
}

export type SubscriberDescriptor = {
  id: string
  subscriber: Subscriber
}

export type EventHandler<TData = unknown> = (
  data: TData,
  eventName: string
) => Promise<void>

export type EventMetadata = Record<string, unknown> & {
  eventGroupId?: string
}

export type MessageBody<TData = unknown> = {
  eventName: string
  metadata?: EventMetadata
  data: TData
}

export type Message<TData = unknown> = MessageBody<TData> & {
  options?: Record<string, unknown>
}

export type RawMessageFormat<TData = any> = {
  eventName: string
  data: TData
  source: string
  object: string
  action?: string
  context?: Pick<Context, "eventGroupId">
  options?: Record<string, any>
}
