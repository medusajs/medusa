import { EntityManager } from "typeorm"

/**
 * {@label SharedContext}
 * 
 * The context shared between modules.
 * 
 * @param transactionManager - the Entity manager used for transactions.
 * @param manager - the Entity manager used to resolve dependencies from the container.
 */
export type SharedContext = {
  transactionManager?: EntityManager
  manager?: EntityManager
}

export type Context<TManager = unknown> = {
  transactionManager?: TManager
  manager?: TManager
  isolationLevel?: string
  enableNestedTransactions?: boolean
  transactionId?: string
}
