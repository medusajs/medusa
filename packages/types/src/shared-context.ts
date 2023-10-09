import { EntityManager } from "typeorm"

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
