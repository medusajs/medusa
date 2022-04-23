import { EntityManager } from "typeorm"
import { BaseService } from "medusa-interfaces"
import { MedusaError } from "medusa-core-utils"

import { BatchJob } from "../models"
import { BatchJobRepository } from "../repositories/batch-job"
import { BatchJobStatus, FilterableBatchJobProps } from "../types/batch-job"
import { FindConfig } from "../types/common"
import EventBusService from "./event-bus"

type InjectedContainer = {
  manager: EntityManager
  eventBusService: EventBusService
  batchJobRepository: typeof BatchJobRepository
}

class BatchJobService extends BaseService<BatchJobService> {
  protected readonly container_: InjectedContainer
  protected readonly batchJobRepository_: typeof BatchJobRepository
  protected readonly eventBus_: EventBusService

  static Events = {
    CREATED: "batch.created",
    UPDATED: "batch.updated",
    COMPLETED: "batch.completed",
    CANCELED: "batch.canceled",
  }

  constructor(container: InjectedContainer) {
    super()

    this.container_ = container
    this.manager_ = container.manager
    this.batchJobRepository_ = container.batchJobRepository
    this.eventBus_ = container.eventBusService
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

  async retrieve(
    batchJobId: string,
    config: FindConfig<BatchJob> = {}
  ): Promise<BatchJob> {
    return await this.atomicPhase_(async (manager) => {
      const batchJobRepo: BatchJobRepository = manager.getCustomRepository(
        this.batchJobRepository_
      )

      const validatedId = this.validateId_(batchJobId)
      const query = this.buildQuery_({ id: validatedId }, config)
      const batchJob = await batchJobRepo.findOne(query)

      if (!batchJob) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `Batch job with id ${batchJobId} was not found`
        )
      }

      return batchJob
    })
  }

  /*
   * if job is started with dry_run: true, then it's required
   * to confirm the job before it's written to DB
   */
  async confirm(batchJobId: string): Promise<BatchJob> {
    return await this.atomicPhase_(async (manager) => {
      const result = await this.retrieve(batchJobId)

      await this.eventBus_
        .withTransaction(manager)
        .emit(BatchJobService.Events.COMPLETED, {
          id: result.id,
        })

      return result
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
