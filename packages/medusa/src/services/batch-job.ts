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

  /*
   * if job is started with dry_run: true, then it's required
   * to complete the job before it's written to DB
   */
  async complete(batchJobId: string, userId: string): Promise<BatchJob> {
    return await this.atomicPhase_(async (manager) => {
      // logic...

      const batchJobRepo: BatchJobRepository = manager.getCustomRepository(
        this.batchJobRepository_
      )

      const batchJob = await batchJobRepo.findOne(batchJobId)

      if (!batchJob || batchJob.created_by_id !== userId) {
        // TODO: check if user is admin
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "You cannot complete batch jobs created by other users"
        )
      }

      // check that job has run

      if (batchJob.awaiting_confirmation_at && !batchJob.confirmed_at) {
        batchJob.confirmed_at = new Date()

        await batchJobRepo.save(batchJob)

        const result = (await batchJobRepo.findOne(batchJobId)) as BatchJob

        await this.eventBus_
          .withTransaction(manager)
          .emit(BatchJobService.Events.UPDATED, {
            id: result.id,
          })

        return result
      }

      return batchJob
    })
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
