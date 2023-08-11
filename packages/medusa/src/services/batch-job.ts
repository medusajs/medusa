import { Request } from "express"
import { isDefined, MedusaError } from "medusa-core-utils"
import { EntityManager } from "typeorm"
import { TransactionBaseService } from "../interfaces"
import { BatchJob } from "../models"
import { BatchJobRepository } from "../repositories/batch-job"
import {
  BatchJobCreateProps,
  BatchJobResultError,
  BatchJobStatus,
  BatchJobUpdateProps,
  CreateBatchJobInput,
  FilterableBatchJobProps,
} from "../types/batch-job"
import { FindConfig } from "../types/common"
import { buildQuery } from "../utils"
import EventBusService from "./event-bus"
import { StrategyResolverService } from "./index"

type InjectedDependencies = {
  manager: EntityManager
  eventBusService: EventBusService
  batchJobRepository: typeof BatchJobRepository
  strategyResolverService: StrategyResolverService
}

class BatchJobService extends TransactionBaseService {
  static readonly Events = {
    CREATED: "batch.created",
    UPDATED: "batch.updated",
    PRE_PROCESSED: "batch.pre_processed",
    CONFIRMED: "batch.confirmed",
    PROCESSING: "batch.processing",
    COMPLETED: "batch.completed",
    CANCELED: "batch.canceled",
    FAILED: "batch.failed",
  }

  protected readonly batchJobRepository_: typeof BatchJobRepository
  protected readonly eventBus_: EventBusService
  protected readonly strategyResolver_: StrategyResolverService

  protected batchJobStatusMapToProps = new Map<
    BatchJobStatus,
    { entityColumnName: string; eventType: string }
  >([
    [
      BatchJobStatus.PRE_PROCESSED,
      {
        entityColumnName: "pre_processed_at",
        eventType: BatchJobService.Events.PRE_PROCESSED,
      },
    ],
    [
      BatchJobStatus.CONFIRMED,
      {
        entityColumnName: "confirmed_at",
        eventType: BatchJobService.Events.CONFIRMED,
      },
    ],
    [
      BatchJobStatus.PROCESSING,
      {
        entityColumnName: "processing_at",
        eventType: BatchJobService.Events.PROCESSING,
      },
    ],
    [
      BatchJobStatus.COMPLETED,
      {
        entityColumnName: "completed_at",
        eventType: BatchJobService.Events.COMPLETED,
      },
    ],
    [
      BatchJobStatus.CANCELED,
      {
        entityColumnName: "canceled_at",
        eventType: BatchJobService.Events.CANCELED,
      },
    ],
    [
      BatchJobStatus.FAILED,
      {
        entityColumnName: "failed_at",
        eventType: BatchJobService.Events.FAILED,
      },
    ],
  ])

  constructor({
    batchJobRepository,
    eventBusService,
    strategyResolverService,
  }: InjectedDependencies) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0])

    this.batchJobRepository_ = batchJobRepository
    this.eventBus_ = eventBusService
    this.strategyResolver_ = strategyResolverService
  }

  async retrieve(
    batchJobId: string,
    config: FindConfig<BatchJob> = {}
  ): Promise<BatchJob | never> {
    if (!isDefined(batchJobId)) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `"batchJobId" must be defined`
      )
    }

    const batchJobRepo = this.activeManager_.withRepository(
      this.batchJobRepository_
    )

    const query = buildQuery({ id: batchJobId }, config)
    const batchJob = await batchJobRepo.findOne(query)

    if (!batchJob) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Batch job with id ${batchJobId} was not found`
      )
    }

    return batchJob
  }

  async listAndCount(
    selector: FilterableBatchJobProps = {},
    config: FindConfig<BatchJob> = { skip: 0, take: 20 }
  ): Promise<[BatchJob[], number]> {
    const batchJobRepo = this.activeManager_.withRepository(
      this.batchJobRepository_
    )

    const query = buildQuery(selector, config)
    return await batchJobRepo.findAndCount(query)
  }

  async create(data: BatchJobCreateProps): Promise<BatchJob> {
    return await this.atomicPhase_(async (manager) => {
      const batchJobRepo = manager.withRepository(this.batchJobRepository_)

      const batchJob = batchJobRepo.create(data)
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
    batchJobOrId: BatchJob | string,
    data: BatchJobUpdateProps
  ): Promise<BatchJob> {
    return await this.atomicPhase_(async (manager) => {
      const batchJobRepo = manager.withRepository(this.batchJobRepository_)

      let batchJob = batchJobOrId as BatchJob
      if (typeof batchJobOrId === "string") {
        batchJob = await this.retrieve(batchJobOrId)
      }

      const { context, result, ...rest } = data
      if (context) {
        batchJob.context = { ...batchJob.context, ...context }
      }

      if (result) {
        batchJob.result = { ...batchJob.result, ...result }
      }

      Object.keys(rest)
        .filter((key) => typeof rest[key] !== `undefined`)
        .forEach((key) => {
          batchJob[key] = rest[key]
        })

      batchJob = await batchJobRepo.save(batchJob)

      await this.eventBus_
        .withTransaction(manager)
        .emit(BatchJobService.Events.UPDATED, {
          id: batchJob.id,
        })

      return batchJob
    })
  }

  protected async updateStatus(
    batchJobOrId: BatchJob | string,
    status: BatchJobStatus
  ): Promise<BatchJob | never> {
    let batchJob: BatchJob = batchJobOrId as BatchJob
    if (typeof batchJobOrId === "string") {
      batchJob = await this.retrieve(batchJobOrId)
    }

    const { entityColumnName, eventType } =
      this.batchJobStatusMapToProps.get(status) || {}

    if (!entityColumnName || !eventType) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Unable to update the batch job status from ${batchJob.status} to ${status}. The status doesn't exist`
      )
    }

    batchJob[entityColumnName] = new Date()

    const batchJobRepo = this.activeManager_.withRepository(
      this.batchJobRepository_
    )
    batchJob = await batchJobRepo.save(batchJob)
    batchJob.loadStatus()

    await this.eventBus_.withTransaction(this.activeManager_).emit(eventType, {
      id: batchJob.id,
    })

    return batchJob
  }

  async confirm(batchJobOrId: string | BatchJob): Promise<BatchJob | never> {
    return await this.atomicPhase_(async () => {
      let batchJob: BatchJob = batchJobOrId as BatchJob
      if (typeof batchJobOrId === "string") {
        batchJob = await this.retrieve(batchJobOrId)
      }

      if (batchJob.status !== BatchJobStatus.PRE_PROCESSED) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "Cannot confirm processing for a batch job that is not pre processed"
        )
      }

      return await this.updateStatus(batchJob, BatchJobStatus.CONFIRMED)
    })
  }

  async complete(batchJobOrId: string | BatchJob): Promise<BatchJob | never> {
    return await this.atomicPhase_(async () => {
      let batchJob: BatchJob = batchJobOrId as BatchJob
      if (typeof batchJobOrId === "string") {
        batchJob = await this.retrieve(batchJobOrId)
      }

      if (batchJob.status !== BatchJobStatus.PROCESSING) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Cannot complete a batch job with status "${batchJob.status}". The batch job must be processing`
        )
      }

      return await this.updateStatus(batchJob, BatchJobStatus.COMPLETED)
    })
  }

  async cancel(batchJobOrId: string | BatchJob): Promise<BatchJob | never> {
    return await this.atomicPhase_(async () => {
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

      return await this.updateStatus(batchJob, BatchJobStatus.CANCELED)
    })
  }

  async setPreProcessingDone(
    batchJobOrId: string | BatchJob
  ): Promise<BatchJob | never> {
    return await this.atomicPhase_(async () => {
      let batchJob: BatchJob = batchJobOrId as BatchJob
      if (typeof batchJobOrId === "string") {
        batchJob = await this.retrieve(batchJobOrId)
      }

      if (batchJob.status === BatchJobStatus.PRE_PROCESSED) {
        return batchJob
      }

      if (batchJob.status !== BatchJobStatus.CREATED) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "Cannot mark a batch job as pre processed if it is not in created status"
        )
      }

      batchJob = await this.updateStatus(
        batchJobOrId,
        BatchJobStatus.PRE_PROCESSED
      )

      if (batchJob.dry_run) {
        return batchJob
      }

      return await this.confirm(batchJob)
    })
  }

  async setProcessing(
    batchJobOrId: string | BatchJob
  ): Promise<BatchJob | never> {
    return await this.atomicPhase_(async () => {
      let batchJob: BatchJob = batchJobOrId as BatchJob
      if (typeof batchJobOrId === "string") {
        batchJob = await this.retrieve(batchJobOrId)
      }

      if (batchJob.status !== BatchJobStatus.CONFIRMED) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "Cannot mark a batch job as processing if the status is different that confirmed"
        )
      }

      return await this.updateStatus(batchJob, BatchJobStatus.PROCESSING)
    })
  }

  async setFailed(
    batchJobOrId: string | BatchJob,
    error?: BatchJobResultError | string
  ): Promise<BatchJob | never> {
    return await this.atomicPhase_(async () => {
      let batchJob = batchJobOrId as BatchJob

      if (error) {
        if (typeof batchJobOrId === "string") {
          batchJob = await this.retrieve(batchJobOrId)
        }

        const result = batchJob.result ?? {}

        await this.update(batchJob, {
          result: {
            ...result,
            errors: [...(result?.errors ?? []), error],
          },
        })
      }

      return await this.updateStatus(batchJob, BatchJobStatus.FAILED)
    })
  }

  async prepareBatchJobForProcessing(
    data: CreateBatchJobInput,
    req: Request
  ): Promise<CreateBatchJobInput | never> {
    return await this.atomicPhase_(async (transactionManager) => {
      const batchStrategy = this.strategyResolver_.resolveBatchJobByType(
        data.type
      )
      return await batchStrategy
        .withTransaction(transactionManager)
        .prepareBatchJobForProcessing(data, req)
    })
  }
}

export default BatchJobService
