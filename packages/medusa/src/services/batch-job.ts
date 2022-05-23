import { DeepPartial, EntityManager } from "typeorm"
import { BatchJob } from "../models"
import { BatchJobRepository } from "../repositories/batch-job"
import {
  BatchJobCreateProps,
  BatchJobStatus,
  BatchJobUpdateProps,
  FilterableBatchJobProps,
} from "../types/batch-job"
import { FindConfig } from "../types/common"
import { TransactionBaseService } from "../interfaces"
import { buildQuery } from "../utils"
import { MedusaError } from "medusa-core-utils"
import { EventBusService } from "./index"

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
    CANCELED: "batch.canceled",
    COMPLETED: "batch.completed",
    PROCESS_COMPLETE: "batch-process.complete",
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

  async confirm(batchJobOrId: string | BatchJob): Promise<BatchJob | never> {
    return await this.atomicPhase_(async (manager) => {
      let batchJob: BatchJob = batchJobOrId as BatchJob
      if (typeof batchJobOrId === "string") {
        batchJob = await this.retrieve(batchJobOrId)
      }

      batchJob.confirmed_at = new Date()

      await this.eventBus_
        .withTransaction(manager)
        .emit(BatchJobService.Events.PROCESS_COMPLETE, {
          id: batchJob.id,
        })

      return batchJob
    })
  }

  async validateBatchContext(
    type: string,
    context: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    // TODO validate context with batch job strategy corresponding to the given type

    return context
  }

  async create(data: BatchJobCreateProps): Promise<BatchJob> {
    return await this.atomicPhase_(async (manager) => {
      const batchJobRepo: BatchJobRepository = manager.getCustomRepository(
        this.batchJobRepository_
      )

      const validatedContext = await this.validateBatchContext(
        data.type,
        data.context
      )

      const toCreate = {
        status: BatchJobStatus.CREATED,
        ...data,
        context: validatedContext,
      } as DeepPartial<BatchJob>

      const batchJob = await batchJobRepo.create(toCreate)
      const result = await batchJobRepo.save(batchJob)

      await this.eventBus_
        .withTransaction(manager)
        .emit(BatchJobService.Events.CREATED, {
          id: result.id,
        })

      return result
    })
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

      const { context, type, ...rest } = data
      if (context) {
        batchJob.context = await this.validateBatchContext(type, context)
      }

      Object.keys(rest)
        .filter((key) => typeof rest[key] !== `undefined`)
        .forEach((key) => {
          batchJob[key] = rest[key]
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

      await batchJobRepo.save(batchJob)

      await this.eventBus_
        .withTransaction(manager)
        .emit(BatchJobService.Events.COMPLETED, {
          id: batchJob.id,
        })

      return batchJob
    })
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
      await batchJobRepo.save(batchJob)

      await this.eventBus_
        .withTransaction(manager)
        .emit(BatchJobService.Events.CANCELED, {
          id: batchJob.id,
        })

      return batchJob
    })
  }
}

export default BatchJobService
