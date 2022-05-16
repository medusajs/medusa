import { EntityManager } from "typeorm"
import { MedusaError } from "medusa-core-utils"
import { BatchJob } from "../models"
import { BatchJobRepository } from "../repositories/batch-job"
import {
  BatchJobStatus,
  BatchJobUpdateProps,
  FilterableBatchJobProps,
} from "../types/batch-job"
import { FindConfig } from "../types/common"
import { TransactionBaseService } from "../interfaces"
import { buildQuery } from "../utils"
import EventBusService from "./event-bus"

type InjectedDependencies = {
  manager: EntityManager
  eventBusService: EventBusService
  batchJobRepository: typeof BatchJobRepository
}

class BatchJobService extends TransactionBaseService<BatchJobService> {
  protected manager_: EntityManager
  protected transactionManager_: EntityManager | undefined
  protected readonly batchJobRepository_: typeof BatchJobRepository
  protected readonly eventBus_: EventBusService

  static readonly Events = {
    CREATED: "batch.created",
    UPDATED: "batch.updated",
    COMPLETED: "batch.completed",
    CANCELED: "batch.canceled",
  }

  constructor({
    manager,
    batchJobRepository,
    eventBusService,
  }: InjectedDependencies) {
    super({ manager, batchJobRepository, eventBusService })

    this.manager_ = manager
    this.batchJobRepository_ = batchJobRepository
    this.eventBus_ = eventBusService
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

  async update(
    batchJobId: string,
    data: BatchJobUpdateProps
  ): Promise<BatchJob> {
    return await this.atomicPhase_(async (manager) => {
      const batchJobRepo: BatchJobRepository = manager.getCustomRepository(
        this.batchJobRepository_
      )

      const batchJob = await this.retrieve(batchJobId)

      const { status, ...rest } = data

      if (typeof status !== "undefined") {
        batchJob.status = status

        switch (status) {
          case BatchJobStatus.PROCESSING:
            batchJob.processing_at = new Date()
            break
          case BatchJobStatus.AWAITING_CONFIRMATION:
            batchJob.awaiting_confirmation_at = new Date()
            break
          case BatchJobStatus.COMPLETED:
            batchJob.completed_at = new Date()
            break
          case BatchJobStatus.CANCELLED:
            batchJob.cancelled_at = new Date()
            break
        }
      }

      Object.keys(rest)
        .filter((restKey) => typeof rest[restKey] !== `undefined`)
        .forEach((restKey) => {
          batchJob[restKey] = rest[restKey]
        })

      return await batchJobRepo.save(batchJob)
    })
  }

  /*
   * if job is started with dry_run: true, then it's required
   * to complete the job before it's written to DB
   */
  async complete(batchJobOrId: string | BatchJob): Promise<BatchJob | never> {
    return await this.atomicPhase_(async (manager) => {
      const batchJobRepo: BatchJobRepository = manager.getCustomRepository(
        this.batchJobRepository_
      )

      let batchJob: BatchJob = batchJobOrId as BatchJob
      if (typeof batchJobOrId === "string") {
        batchJob = await this.retrieve(batchJobOrId)
      }

      if (batchJob.status !== BatchJobStatus.AWAITING_CONFIRMATION) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Cannot complete a batch job with status "${batchJob.status}"`
        )
      }

      batchJob.completed_at = new Date()
      batchJob.status = BatchJobStatus.COMPLETED

      await batchJobRepo.save(batchJob)

      await this.eventBus_
        .withTransaction(manager)
        .emit(BatchJobService.Events.COMPLETED, {
          id: batchJob.id,
        })

      return batchJob
    })
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

        const query = buildQuery<BatchJob>(selector, config)
        return await batchJobRepo.findAndCount(query)
      }
    )
  }
}

export default BatchJobService
