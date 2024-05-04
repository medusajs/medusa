export type Subscriber<T = unknown> = (
  data: T,
  eventName: string
) => Promise<void>

export type Option = Record<string, unknown>

export type Metadata = {
  service: string
  action: string
  object: string
  eventGroupId?: string
}

export type SubscriberContext = { subscriberId: string }

export type SubscriberDescriptor = {
  id: string
  subscriber: Subscriber
}

export type EventHandler<T = unknown> = (
  eventName: string,
  data: T
) => Promise<void>

export type EmitData<T = unknown> = {
  eventName: string
  data: T
  options?: Option
}

export type MessageBody<T = unknown> = {
  metadata: Metadata
  data: T
}

export type Message<T = unknown> = {
  eventName: string
  body: MessageBody<T>
  options?: Option
}

export type MessageFormat<T = unknown> = {
  eventName: string
  data: T | T[]
  metadata: Metadata
}
