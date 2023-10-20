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

export type Message<T> = {
  eventName: string
  body: {
    metadata: {
      service: string
      action: string
      object: string
    }
    data: T
  }
}

export type MessageData<T> = {
  eventName: string
  metadata: {
    service: string
    action: string
    object: string
  }
  data: T | T[]
}
