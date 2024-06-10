import {
  DistributedTransaction,
  IDistributedSchedulerStorage,
  IDistributedTransactionStorage,
  SchedulerOptions,
  TransactionCheckpoint,
  TransactionStep,
} from "@medusajs/orchestration"
import { ModulesSdkTypes } from "@medusajs/types"
import { TransactionState, promiseAll } from "@medusajs/utils"
import { WorkflowOrchestratorService } from "@services"
import { Queue, Worker } from "bullmq"
import Redis from "ioredis"

enum JobType {
  SCHEDULE = "schedule",
  RETRY = "retry",
  STEP_TIMEOUT = "step_timeout",
  TRANSACTION_TIMEOUT = "transaction_timeout",
}

// eslint-disable-next-line max-len
export class RedisDistributedTransactionStorage
  implements IDistributedTransactionStorage, IDistributedSchedulerStorage
{
  private static TTL_AFTER_COMPLETED = 60 * 15 // 15 minutes
  private workflowExecutionService_: ModulesSdkTypes.InternalModuleService<any>
  private workflowOrchestratorService_: WorkflowOrchestratorService

  private redisClient: Redis
  private queue: Queue
  private worker: Worker

  constructor({
    workflowExecutionService,
    redisConnection,
    redisWorkerConnection,
    redisQueueName,
  }: {
    workflowExecutionService: ModulesSdkTypes.InternalModuleService<any>
    redisConnection: Redis
    redisWorkerConnection: Redis
    redisQueueName: string
  }) {
    this.workflowExecutionService_ = workflowExecutionService

    this.redisClient = redisConnection

    this.queue = new Queue(redisQueueName, { connection: this.redisClient })
    this.worker = new Worker(
      redisQueueName,
      async (job) => {
        const allJobs = [
          JobType.RETRY,
          JobType.STEP_TIMEOUT,
          JobType.TRANSACTION_TIMEOUT,
        ]

        if (allJobs.includes(job.name as JobType)) {
          await this.executeTransaction(
            job.data.workflowId,
            job.data.transactionId
          )
        }

        // Note: We might even want a separate worker with different concurrency settings in the future, but for now we keep it simple
        if (job.name === JobType.SCHEDULE) {
          await this.executeScheduledJob(
            job.data.jobId,
            job.data.schedulerOptions
          )
        }
      },
      { connection: redisWorkerConnection }
    )
  }

  async onApplicationPrepareShutdown() {
    // Close worker gracefully, i.e. wait for the current jobs to finish
    await this.worker.close()
  }

  async onApplicationShutdown() {
    await this.queue.close()
  }

  setWorkflowOrchestratorService(workflowOrchestratorService) {
    this.workflowOrchestratorService_ = workflowOrchestratorService
  }

  private async saveToDb(data: TransactionCheckpoint) {
    await this.workflowExecutionService_.upsert([
      {
        workflow_id: data.flow.modelId,
        transaction_id: data.flow.transactionId,
        execution: data.flow,
        context: {
          data: data.context,
          errors: data.errors,
        },
        state: data.flow.state,
      },
    ])
  }

  private async deleteFromDb(data: TransactionCheckpoint) {
    await this.workflowExecutionService_.delete([
      {
        workflow_id: data.flow.modelId,
        transaction_id: data.flow.transactionId,
      },
    ])
  }

  private async executeTransaction(workflowId: string, transactionId: string) {
    return await this.workflowOrchestratorService_.run(workflowId, {
      transactionId,
      throwOnError: false,
    })
  }

  private async executeScheduledJob(
    jobId: string,
    schedulerOptions: SchedulerOptions
  ) {
    // TODO: In the case of concurrency being forbidden, we want to generate a predictable transaction ID and rely on the idempotency
    // of the transaction to ensure that the transaction is only executed once.
    return await this.workflowOrchestratorService_.run(jobId, {
      throwOnError: false,
    })
  }

  async get(key: string): Promise<TransactionCheckpoint | undefined> {
    const data = await this.redisClient.get(key)

    return data ? JSON.parse(data) : undefined
  }

  async list(): Promise<TransactionCheckpoint[]> {
    const keys = await this.redisClient.keys(
      DistributedTransaction.keyPrefix + ":*"
    )
    const transactions: any[] = []
    for (const key of keys) {
      const data = await this.redisClient.get(key)
      if (data) {
        transactions.push(JSON.parse(data))
      }
    }
    return transactions
  }

  async save(
    key: string,
    data: TransactionCheckpoint,
    ttl?: number
  ): Promise<void> {
    let retentionTime

    /**
     * Store the retention time only if the transaction is done, failed or reverted.
     * From that moment, this tuple can be later on archived or deleted after the retention time.
     */
    const hasFinished = [
      TransactionState.DONE,
      TransactionState.FAILED,
      TransactionState.REVERTED,
    ].includes(data.flow.state)

    if (hasFinished) {
      retentionTime = data.flow.options?.retentionTime
      Object.assign(data, {
        retention_time: retentionTime,
      })
    }

    const stringifiedData = JSON.stringify(data)
    const parsedData = JSON.parse(stringifiedData)

    if (!hasFinished) {
      if (ttl) {
        await this.redisClient.set(key, stringifiedData, "EX", ttl)
      } else {
        await this.redisClient.set(key, stringifiedData)
      }
    }

    if (hasFinished && !retentionTime) {
      await this.deleteFromDb(parsedData)
    } else {
      await this.saveToDb(parsedData)
    }

    if (hasFinished) {
      // await this.redisClient.del(key)
      await this.redisClient.set(
        key,
        stringifiedData,
        "EX",
        RedisDistributedTransactionStorage.TTL_AFTER_COMPLETED
      )
    }
  }

  async scheduleRetry(
    transaction: DistributedTransaction,
    step: TransactionStep,
    timestamp: number,
    interval: number
  ): Promise<void> {
    await this.queue.add(
      JobType.RETRY,
      {
        workflowId: transaction.modelId,
        transactionId: transaction.transactionId,
        stepId: step.id,
      },
      {
        delay: interval > 0 ? interval * 1000 : undefined,
        jobId: this.getJobId(JobType.RETRY, transaction, step),
        removeOnComplete: true,
      }
    )
  }

  async clearRetry(
    transaction: DistributedTransaction,
    step: TransactionStep
  ): Promise<void> {
    await this.removeJob(JobType.RETRY, transaction, step)
  }

  async scheduleTransactionTimeout(
    transaction: DistributedTransaction,
    timestamp: number,
    interval: number
  ): Promise<void> {
    await this.queue.add(
      JobType.TRANSACTION_TIMEOUT,
      {
        workflowId: transaction.modelId,
        transactionId: transaction.transactionId,
      },
      {
        delay: interval * 1000,
        jobId: this.getJobId(JobType.TRANSACTION_TIMEOUT, transaction),
        removeOnComplete: true,
      }
    )
  }

  async clearTransactionTimeout(
    transaction: DistributedTransaction
  ): Promise<void> {
    await this.removeJob(JobType.TRANSACTION_TIMEOUT, transaction)
  }

  async scheduleStepTimeout(
    transaction: DistributedTransaction,
    step: TransactionStep,
    timestamp: number,
    interval: number
  ): Promise<void> {
    await this.queue.add(
      JobType.STEP_TIMEOUT,
      {
        workflowId: transaction.modelId,
        transactionId: transaction.transactionId,
        stepId: step.id,
      },
      {
        delay: interval * 1000,
        jobId: this.getJobId(JobType.STEP_TIMEOUT, transaction, step),
        removeOnComplete: true,
      }
    )
  }

  async clearStepTimeout(
    transaction: DistributedTransaction,
    step: TransactionStep
  ): Promise<void> {
    await this.removeJob(JobType.STEP_TIMEOUT, transaction, step)
  }

  private getJobId(
    type: JobType,
    transaction: DistributedTransaction,
    step?: TransactionStep
  ) {
    const key = [type, transaction.modelId, transaction.transactionId]

    if (step) {
      key.push(step.id, step.attempts + "")
      if (step.isCompensating()) {
        key.push("compensate")
      }
    }

    return key.join(":")
  }

  private async removeJob(
    type: JobType,
    transaction: DistributedTransaction,
    step?: TransactionStep
  ) {
    const jobId = this.getJobId(type, transaction, step)
    const job = await this.queue.getJob(jobId)

    if (job && job.attemptsStarted === 0) {
      await job.remove()
    }
  }

  /* Scheduler storage methods */
  async schedule(
    jobDefinition: string | { jobId: string },
    schedulerOptions: SchedulerOptions
  ): Promise<void> {
    const jobId =
      typeof jobDefinition === "string" ? jobDefinition : jobDefinition.jobId

    // In order to ensure that the schedule configuration is always up to date, we first cancel an existing job, if there was one
    // any only then we add the new one.
    await this.remove(jobId)

    await this.queue.add(
      JobType.SCHEDULE,
      {
        jobId,
        schedulerOptions,
      },
      {
        repeat: {
          pattern: schedulerOptions.cron,
          limit: schedulerOptions.numberOfExecutions,
        },
        jobId: `${JobType.SCHEDULE}_${jobId}`,
      }
    )
  }

  async remove(jobId: string): Promise<void> {
    await this.queue.removeRepeatableByKey(`${JobType.SCHEDULE}_${jobId}`)
  }

  async removeAll(): Promise<void> {
    const repeatableJobs = await this.queue.getRepeatableJobs()
    await promiseAll(
      repeatableJobs.map((job) => this.queue.removeRepeatableByKey(job.key))
    )
  }
}
