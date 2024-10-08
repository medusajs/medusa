import { ITransactionBaseService } from "../transaction-base"
import { Message, Subscriber, SubscriberContext } from "./common"

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

  emit<T>(data: Message<T> | Message<T>[]): Promise<unknown | void>
}
