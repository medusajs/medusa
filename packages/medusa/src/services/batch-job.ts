import { EntityManager } from "typeorm"

import { BatchJob } from "../models"
import { BatchJobRepository } from "../repositories/batch-job"
import { FilterableBatchJobProps } from "../types/batch-job"
import { FindConfig } from "../types/common"
import { TransactionBaseService } from "../interfaces"
import { buildQuery, validateId } from "../utils"
import { MedusaError } from "medusa-core-utils"

type InjectedDependencies = {
  manager: EntityManager
  batchJobRepository: typeof BatchJobRepository
}

class BatchJobService extends TransactionBaseService<BatchJobService> {
  protected manager_: EntityManager
  protected transactionManager_: EntityManager | undefined
  protected readonly batchJobRepository_: typeof BatchJobRepository

  static readonly Events = {
    CREATED: "batch.created",
    UPDATED: "batch.updated",
    CANCELED: "batch.canceled",
  }

  constructor({ manager, batchJobRepository }: InjectedDependencies) {
    super({ manager, batchJobRepository })

    this.manager_ = manager
    this.batchJobRepository_ = batchJobRepository
  }

  async retrieve(
    batchJobId: string,
    config: FindConfig<BatchJob> = {}
  ): Promise<BatchJob | never> {
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const batchJobRepo = transactionManager.getCustomRepository(
          this.batchJobRepository_
        )

        const query = buildQuery<BatchJob>({ id: batchJobId }, config)
        const batchJob = await batchJobRepo.findOne(query)

        if (!batchJob) {
          throw new MedusaError(
            MedusaError.Types.NOT_FOUND,
            `Batch job with id ${batchJobId} was not found`
          )
        }

        return batchJob
      }
    )
  }

  async listAndCount(
    selector: FilterableBatchJobProps = {},
    config: FindConfig<BatchJob> = { skip: 0, take: 20 }
  ): Promise<[BatchJob[], number]> {
    return await this.atomicPhase_(
      async (manager: EntityManager): Promise<[BatchJob[], number]> => {
        const batchJobRepo = manager.getCustomRepository(
          this.batchJobRepository_
        )

        const query = buildQuery(selector, config)
        return await batchJobRepo.findAndCount(query)
      }
    )
  }
}

export default BatchJobService
