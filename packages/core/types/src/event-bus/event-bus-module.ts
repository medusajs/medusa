import { Message, Subscriber, SubscriberContext } from "./common"

export interface IEventBusModuleService {
  emit<T>(
    data: Message<T> | Message<T>[],
    options?: Record<string, unknown>
  ): Promise<void>

  subscribe(
    eventName: string | symbol,
    subscriber: Subscriber,
    context?: SubscriberContext
  ): this

  unsubscribe(
    eventName: string | symbol,
    subscriber: Subscriber,
    context?: SubscriberContext
  ): this

  releaseGroupedEvents(eventGroupId: string): Promise<void>
}
