import { EntityManager } from "typeorm"

export type SharedContext = {
  transactionManager?: EntityManager
}
