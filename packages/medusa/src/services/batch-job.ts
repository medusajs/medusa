import { DeepPartial, EntityManager } from "typeorm"

import { BatchJob } from "../models"
import { BatchJobRepository } from "../repositories/batch-job"
import {
  BatchJobCreateProps,
  BatchJobStatus,
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

      // TODO use strategy to validate the context

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
}

export default BatchJobService
