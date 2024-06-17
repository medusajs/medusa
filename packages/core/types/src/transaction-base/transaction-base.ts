import { EntityManager } from "typeorm"

export interface ITransactionBaseService {
  withTransaction(transactionManager?: EntityManager): this
}
