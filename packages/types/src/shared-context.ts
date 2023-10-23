import { EntityManager } from "typeorm"

export type SharedContext = {
  transactionManager?: EntityManager
  manager?: EntityManager
}

/**
 * @internal The interface tag is used to ensure that the type is documented similar to interfaces.
 * @interface
 * 
 * A shared context object that is used to share resources between the application and the module.
 * 
 * @prop transactionManager - An instance of a transaction manager of type `TManager`, which is a typed parameter passed to the context to specify the type of the `transactionManager`.
 * @prop manager - An instance of a manager, typically an entity manager, of type `TManager`, which is a typed parameter passed to the context to specify the type of the `manager`.
 * @prop isolationLevel - A string indicating the isolation level of the context. Possible values are `READ UNCOMMITTED`, `READ COMMITTED`, `REPEATABLE READ`, or `SERIALIZABLE`.
 * @prop enableNestedTransactions - a boolean value indicating whether nested transactions are enabled.
 * @prop transactionId - a string indicating the ID of the current transaction.
 */
export type Context<TManager = unknown> = {
  transactionManager?: TManager
  manager?: TManager
  isolationLevel?: string
  enableNestedTransactions?: boolean
  transactionId?: string
}
