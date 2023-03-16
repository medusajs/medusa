import { TransactionBaseService } from "@medusajs/medusa"
import { EmitData, Subscriber, SubscriberContext } from "../event-bus"

export interface IEventBusService extends TransactionBaseService {
  emit<T>(event: string, data: T, options?: unknown): Promise<unknown | void>
}

export interface IEventBusModuleService {
  emit<T>(
    eventName: string,
    data: T,
    options: Record<string, unknown>
  ): Promise<void>
  emit<T>(data: EmitData<T>[]): Promise<void>

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
}
