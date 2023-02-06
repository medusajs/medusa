import { EntityManager } from "typeorm"

export interface IEventBusService {
  emit(event: string, data: any): Promise<void>
  withTransaction(transactionManager?: EntityManager): this
}
