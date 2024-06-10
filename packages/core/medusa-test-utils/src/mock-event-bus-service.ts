import {
  EmitData,
  EventBusTypes,
  IEventBusModuleService,
  Message,
  Subscriber,
} from "@medusajs/types"

export default class EventBusService implements IEventBusModuleService {
  emit<T>(
    eventName: string,
    data: T,
    options?: Record<string, unknown>
  ): Promise<void>
  emit<T>(data: EmitData<T>[]): Promise<void>
  emit<T>(data: Message<T>[]): Promise<void>

  async emit<
    T,
    TInput extends
      | string
      | EventBusTypes.EmitData<T>[]
      | EventBusTypes.Message<T>[] = string
  >(
    eventOrData: TInput,
    data?: T,
    options: Record<string, unknown> = {}
  ): Promise<void> {}

  subscribe(event: string | symbol, subscriber: Subscriber): this {
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
    return Promise.resolve()
  }
}
