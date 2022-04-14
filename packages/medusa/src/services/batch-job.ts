import { EntityManager } from "typeorm"
import { BaseService } from "medusa-interfaces"
import { MedusaError } from "medusa-core-utils"

import { BatchJob } from "../models"
import { BatchJobRepository } from "../repositories/batch-job"
import { FilterableBatchJobProps } from "../types/batch-job"
import { FindConfig } from "../types/common"

type InjectedContainer = {
  manager: EntityManager
  batchJobRepository: typeof BatchJobRepository
}

class BatchJobService extends BaseService<BatchJobService> {
  protected readonly container_: InjectedContainer
  protected readonly batchJobRepository_: typeof BatchJobRepository

  static Events = {
    CREATED: "batch.created",
    UPDATED: "batch.updated",
    CANCELED: "batch.canceled",
  }

  constructor(container: InjectedContainer) {
    super()

    this.container_ = container
    this.manager_ = container.manager
    this.batchJobRepository_ = container.batchJobRepository
  }

  withTransaction(transactionManager: EntityManager): BatchJobService {
    if (!transactionManager) {
      return this
    }

    const cloned = new BatchJobService({
      ...this.container_,
      manager: transactionManager,
    })

    cloned.transactionManager_ = transactionManager

    return cloned
  }

  async listAndCount(
    selector: FilterableBatchJobProps = {},
    config: FindConfig<BatchJob> = { skip: 0, take: 20 }
  ): Promise<[BatchJob[], number]> {
    return await this.atomicPhase_(
      async (
        transactionManager: EntityManager
      ): Promise<[BatchJob[], number]> => {
        const batchJobRepo = transactionManager.getCustomRepository(
          this.batchJobRepository_
        )

        const query = this.buildQuery_(selector, config)
        return await batchJobRepo.findAndCount(query)
      }
    )
  }
}

export default BatchJobService
