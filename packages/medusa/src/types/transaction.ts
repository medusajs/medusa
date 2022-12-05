import { EntityManager } from "typeorm"

export type TransactionContext = {
  transactionManager?: EntityManager
}
