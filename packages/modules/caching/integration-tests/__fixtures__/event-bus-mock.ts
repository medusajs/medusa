import {
  EventBusTypes,
  IEventBusModuleService,
  InterceptorSubscriber,
  Message,
  Subscriber,
} from "@medusajs/types"

export class EventBusServiceMock implements IEventBusModuleService {
  protected readonly subscribers_: Map<string | symbol, Set<Subscriber>> =
    new Map()
  readonly interceptors_: Set<InterceptorSubscriber> = new Set()

  async emit<T>(
    messages: Message<T> | Message<T>[],
    options?: Record<string, unknown>
  ): Promise<void> {
    const messages_ = Array.isArray(messages) ? messages : [messages]

    for (const message of messages_) {
      for (const interceptor of this.interceptors_) {
        await interceptor(message, { isGrouped: false })
      }

      const subscribers = this.subscribers_.get(message.name)
      const starSubscribers = this.subscribers_.get("*")

      for (const subscriber of [
        ...(subscribers ?? []),
        ...(starSubscribers ?? []),
      ]) {
        const { options, ...payload } = message
        await subscriber(payload)
      }
    }
  }

  subscribe(event: string | symbol, subscriber: Subscriber): this {
    this.subscribers_.set(event, new Set([subscriber]))
    return this
  }

  addInterceptor(interceptor: InterceptorSubscriber): this {
    this.interceptors_.add(interceptor)
    return this
  }

  removeInterceptor(interceptor: InterceptorSubscriber): this {
    this.interceptors_.delete(interceptor)
    return this
  }

  unsubscribe(
    event: string | symbol,
    subscriber: Subscriber,
    context?: EventBusTypes.SubscriberContext
  ): this {
    return this
  }

  releaseGroupedEvents(eventGroupId: string): Promise<void> {
    throw new Error("Method not implemented.")
  }
  clearGroupedEvents(eventGroupId: string): Promise<void> {
    throw new Error("Method not implemented.")
  }
}
