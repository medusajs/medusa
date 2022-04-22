import { EntityManager } from "typeorm"
import { BatchJob } from "../models"
import { BatchJobRepository } from "../repositories/batch-job"
import { BatchJobStatus, FilterableBatchJobProps } from "../types/batch-job"
import { FindConfig } from "../types/common"
import { TransactionBaseService } from "../interfaces"
import { buildQuery } from "../utils"
import { MedusaError } from "medusa-core-utils"
import EventBusService from "./event-bus"

type InjectedDependencies = {
  manager: EntityManager
  eventBusService: EventBusService
  batchJobRepository: typeof BatchJobRepository
}

class BatchJobService extends TransactionBaseService<BatchJobService> {
  protected readonly manager_: EntityManager
  protected readonly transactionManager_: EntityManager | undefined
  protected readonly batchJobRepository_: typeof BatchJobRepository
  protected readonly eventBus_: EventBusService

  static readonly Events = {
    CREATED: "batch.created",
    UPDATED: "batch.updated",
    COMPLETED: "batch.completed",
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

  /*
   * if job is started with dry_run: true, then it's required
   * to complete the job before it's written to DB
   */
  async complete(batchJobId: string): Promise<BatchJob> {
    return await this.atomicPhase_(async (manager) => {
      const batchJobRepo: BatchJobRepository = manager.getCustomRepository(
        this.batchJobRepository_
      )

      const batchJob = await this.retrieve(batchJobId)

      // check that job has run
      if (batchJob.status !== BatchJobStatus.AWAITING_CONFIRMATION) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Cannot complete a batch job with status "${batchJob.status}"`
        )
      }

      batchJob.completed_at = new Date()
      batchJob.status = BatchJobStatus.COMPLETED

      await batchJobRepo.save(batchJob)

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

        const query = buildQuery<BatchJob>(selector, config)
        return await batchJobRepo.findAndCount(query)
      }
    )
  }
}

export default BatchJobService
