import { EmitData, Subscriber, SubscriberContext } from "."
import { ITransactionBaseService } from "../transaction-base/transaction-base"

export interface IEventBusService extends ITransactionBaseService  {
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
