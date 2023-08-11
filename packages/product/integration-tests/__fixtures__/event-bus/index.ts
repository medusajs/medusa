import {
  EventBusTypes,
  IEventBusModuleService,
  Subscriber,
} from "@medusajs/types"

export class EventBusService implements IEventBusModuleService {
  async emit<T>(
    eventName: string,
    data: T,
    options: Record<string, unknown>
  ): Promise<void>

  async emit<T>(data: EventBusTypes.EmitData<T>[]): Promise<void>

  async emit<T, TInput extends string | EventBusTypes.EmitData<T>[] = string>(
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

  withTransaction() {}
}
