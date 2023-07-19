import { EntityManager } from "typeorm"

export type SharedContext = {
  transactionManager?: EntityManager
  forkedManager?: EntityManager
}

export type Context<TManager = unknown> = {
  transactionManager?: TManager
  forkedManager?: TManager
  isolationLevel?: string
  enableNestedTransactions?: boolean
}
