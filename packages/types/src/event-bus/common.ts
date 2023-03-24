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
  