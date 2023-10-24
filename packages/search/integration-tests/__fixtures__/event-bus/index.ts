import {
  EventBusTypes,
  IEventBusModuleService,
  Message,
  Subscriber,
} from "@medusajs/types"
import { isString } from "@medusajs/utils"

export class EventBusService implements IEventBusModuleService {
  protected readonly subscribers_: Map<string | symbol, Set<Subscriber>> =
    new Map()

  async emit<T>(
    eventName: string,
    data: T,
    options: Record<string, unknown>
  ): Promise<void>

  async emit<T>(data: EventBusTypes.EmitData<T>[]): Promise<void>

  async emit<T>(data: EventBusTypes.Message<T>[]): Promise<void>

  async emit<
    T,
    TInput extends string | EventBusTypes.EmitData<T>[] | Message<T>[] = string
  >(
    eventOrData: TInput,
    data?: T,
    options: Record<string, unknown> = {}
  ): Promise<void> {
    const eventData = isString(eventOrData)
      ? {
          eventName: eventOrData,
          data,
          options,
        }
      : eventOrData

    for (const event of eventData as
      | EventBusTypes.EmitData[]
      | EventBusTypes.Message<T>[]) {
      const subscribers = this.subscribers_.get(event.eventName)

      for (const subscriber of subscribers ?? []) {
        await subscriber(
          (event as EventBusTypes.EmitData).data ?? (event as Message<T>).body,
          event.eventName
        )
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

  withTransaction() {}
}
