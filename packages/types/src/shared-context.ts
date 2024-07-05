import { EntityManager } from "typeorm"
import { EventBusTypes } from "./bundles"
import { Message } from "./event-bus"

/**
 * @deprecated use `Context` instead
 * @interface
 *
 * A context used to share resources, such as transaction manager, between the application and the module.
 */
export type SharedContext = {
  /**
   * An instance of a transaction manager.
   */
  transactionManager?: EntityManager
  /**
   * An instance of an entity manager.
   */
  manager?: EntityManager
}

export interface MessageAggregatorFormat {
  groupBy?: string[]
  sortBy?: { [key: string]: string[] | string | number }
}

export interface IMessageAggregator {
  save(msg: Message | Message[]): void
  getMessages(format?: MessageAggregatorFormat): Record<string, Message[]>
  clearMessages(): void
  saveRawMessageData<T>(
    messageData:
      | EventBusTypes.MessageFormat<T>
      | EventBusTypes.MessageFormat<T>[],
    options?: Record<string, unknown>
  ): void
}

/**
 * @interface
 * A context used to share resources, such as transaction manager, between the application and the module.
 */
export type Context<TManager = unknown> = {
  __type?: "MedusaContext"
  /**
   * An instance of a transaction manager of type `TManager`, which is a typed parameter passed to the context to specify the type of the `transactionManager`.
   */
  transactionManager?: TManager
  /**
   * An instance of a manager, typically an entity manager, of type `TManager`, which is a typed parameter passed to the context to specify the type of the `manager`.
   */
  manager?: TManager
  /**
   * A string indicating the isolation level of the context. Possible values are `READ UNCOMMITTED`, `READ COMMITTED`, `REPEATABLE READ`, or `SERIALIZABLE`.
   */
  isolationLevel?: string
  /**
   * A boolean value indicating whether nested transactions are enabled.
   */
  enableNestedTransactions?: boolean
  /**
   * A string indicating the ID of the group to aggregate the events to be emitted at a later point.
   */
  eventGroupId?: string
  /**
   * A string indicating the ID of the current transaction.
   */
  transactionId?: string

  /**
   * An instance of a message aggregator, which is used to aggregate messages to be emitted at a later point.
   */
  messageAggregator?: IMessageAggregator

  /**
   * A string indicating the ID of the current request.
   */
  requestId?: string

  /**
   * A string indicating the idempotencyKey of the current workflow execution.
   */
  idempotencyKey?: string
}
