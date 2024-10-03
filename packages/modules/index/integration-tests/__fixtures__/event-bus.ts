import {
  EventBusTypes,
  IEventBusModuleService,
  Message,
  Subscriber,
} from "@medusajs/framework/types"

export class EventBusServiceMock implements IEventBusModuleService {
  protected readonly subscribers_: Map<string | symbol, Set<Subscriber>> =
    new Map()

  async emit<T>(
    messages: Message<T> | Message<T>[],
    options?: Record<string, unknown>
  ): Promise<void> {
    const messages_ = Array.isArray(messages) ? messages : [messages]

    for (const message of messages_) {
      const subscribers = this.subscribers_.get(message.name)

      for (const subscriber of subscribers ?? []) {
        const { options, ...payload } = message
        await subscriber(payload)
      }
    }
  }

  subscribe(event: string | symbol, subscriber: Subscriber): this {
    this.subscribers_.set(event, new Set([subscriber]))
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
