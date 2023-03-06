import { MedusaError, TransactionBaseService } from "medusa-core-utils"
import { EntityManager } from "typeorm"
import { AbstractBatchJobStrategy } from "../interfaces"

type InjectedDependencies = {
  manager: EntityManager
  [key: string]: unknown
}

export default class StrategyResolver extends TransactionBaseService {
  constructor(protected readonly container: InjectedDependencies) {
    super(container)
  }

  resolveBatchJobByType(type: string): AbstractBatchJobStrategy {
    let resolved: AbstractBatchJobStrategy
    try {
      resolved = this.container[`batchType_${type}`] as AbstractBatchJobStrategy
    } catch (e) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Unable to find a BatchJob strategy with the type ${type}`
      )
    }
    return resolved
  }
}
