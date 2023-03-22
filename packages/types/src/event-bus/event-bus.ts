import { Subscriber, SubscriberContext } from "."
import { ITransactionBaseService } from "../transaction-base/transaction-base"

export interface IEventBusService extends ITransactionBaseService {
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
  emit<T>(event: string, data: T, options?: unknown): Promise<unknown | void>
}
