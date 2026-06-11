import {
  EventBusTypes,
  IEventBusModuleService,
  Message,
  Subscriber,
} from "@medusajs/framework/types"

/**
 * In-memory event bus. Events are dispatched synchronously to the
 * registered subscribers and every emitted message is recorded so tests
 * can assert on the events the module published.
 */
export class FakeEventBus implements IEventBusModuleService {
  protected readonly subscribers_: Map<string | symbol, Set<Subscriber>> =
    new Map()

  emitted: Message[] = []

  async emit<T>(
    messages: Message<T> | Message<T>[],
    options?: Record<string, unknown>
  ): Promise<void> {
    const messages_ = Array.isArray(messages) ? messages : [messages]

    for (const message of messages_) {
      this.emitted.push(message)

      const subscribers = this.subscribers_.get(message.name)

      for (const subscriber of subscribers ?? []) {
        const { options, ...payload } = message
        await subscriber(payload)
      }
    }
  }

  subscribe(event: string | symbol, subscriber: Subscriber): this {
    const subscribers = this.subscribers_.get(event) ?? new Set()
    subscribers.add(subscriber)
    this.subscribers_.set(event, subscribers)
    return this
  }

  unsubscribe(
    event: string | symbol,
    subscriber: Subscriber,
    context?: EventBusTypes.SubscriberContext
  ): this {
    this.subscribers_.get(event)?.delete(subscriber)
    return this
  }

  reset() {
    this.emitted = []
  }

  async releaseGroupedEvents(eventGroupId: string): Promise<void> {}

  async clearGroupedEvents(eventGroupId: string): Promise<void> {}
}
