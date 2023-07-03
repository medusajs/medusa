import { EntityManager } from "typeorm"

export type SharedContext = {
  transactionManager?: EntityManager
}

export type Context = {
  transactionManager?: unknown
}
