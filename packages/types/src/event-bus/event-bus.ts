import { EmitData, Message, Subscriber, SubscriberContext } from "./common"
import { ITransactionBaseService } from "../transaction-base"

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
  emit<T>(data: EmitData<T>[]): Promise<unknown | void>
  emit<T>(data: Message<T>[]): Promise<unknown | void>
}
