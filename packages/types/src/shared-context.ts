import { EntityManager } from "typeorm"

export type SharedContext = {
  transactionManager?: EntityManager
}

export type Context<TManager = unknown> = {
  transactionManager?: TManager
  isolationLevel?: string
  enableNestedTransactions?: boolean
  transactionId?: string
}
