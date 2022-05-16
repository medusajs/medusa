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
    CANCELED: "batch.canceled",
    COMPLETED: "batch.completed",
    PROCESS_COMPLETE: "batch-process.complete",
  }

  constructor({
    manager,
    batchJobRepository,
    eventBusService,
  }: InjectedDependencies) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0])

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

  async cancel(batchJobOrId: string | BatchJob): Promise<BatchJob | never> {
    return await this.atomicPhase_(async (manager) => {
      const batchJobRepo: BatchJobRepository = manager.getCustomRepository(
        this.batchJobRepository_
      )

      let batchJob: BatchJob = batchJobOrId as BatchJob
      if (typeof batchJobOrId === "string") {
        batchJob = await this.retrieve(batchJobOrId)
      }

      if (batchJob.status === BatchJobStatus.COMPLETED) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "Cannot cancel completed batch job"
        )
      }

      batchJob.canceled_at = new Date()
      batchJob.status = BatchJobStatus.CANCELED
      await batchJobRepo.save(batchJob)

      await this.eventBus_
        .withTransaction(manager)
        .emit(BatchJobService.Events.CANCELED, {
          id: batchJob.id,
        })

      return batchJob
    })
  }

  /*
   * if job is started with dry_run: true, then it's required
   * to confirm the job before it's written to DB
   */
  async confirm(batchJobOrId: string | BatchJob): Promise<BatchJob | never> {
    return await this.atomicPhase_(async (manager) => {
      let batchJob: BatchJob = batchJobOrId as BatchJob
      if (typeof batchJobOrId === "string") {
        batchJob = await this.retrieve(batchJobOrId)
      }

      await this.eventBus_
        .withTransaction(manager)
        .emit(BatchJobService.Events.PROCESS_COMPLETE, {
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

        const query = buildQuery(selector, config)
        return await batchJobRepo.findAndCount(query)
      }
    )
  }
}

export default BatchJobService
