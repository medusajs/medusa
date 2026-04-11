import { raw } from "@medusajs/framework/mikro-orm/core"
import {
  DistributedTransactionType,
  IDistributedSchedulerStorage,
  IDistributedTransactionStorage,
  SchedulerOptions,
  SkipCancelledExecutionError,
  SkipExecutionError,
  SkipStepAlreadyFinishedError,
  TransactionCheckpoint,
  TransactionContext,
  TransactionFlow,
  TransactionOptions,
  TransactionStep,
  TransactionStepError,
} from "@medusajs/framework/orchestration"
import { Logger, ModulesSdkTypes } from "@medusajs/framework/types"
import {
  isDefined,
  isPresent,
  MedusaError,
  promiseAll,
  TransactionState,
  TransactionStepState,
} from "@medusajs/framework/utils"
import { WorkflowOrchestratorService } from "@services"
import {
  Queue,
  QueueOptions,
  RepeatOptions,
  Worker,
  WorkerOptions,
} from "bullmq"
import Redis from "ioredis"

enum JobType {
  SCHEDULE = "schedule",
  RETRY = "retry",
  STEP_TIMEOUT = "step_timeout",
  TRANSACTION_TIMEOUT = "transaction_timeout",
}

const THIRTY_MINUTES_IN_MS = 1000 * 60 * 30
const REPEATABLE_CLEARER_JOB_ID = "clear-expired-executions"

const doneStates = new Set([
  TransactionStepState.DONE,
  TransactionStepState.REVERTED,
  TransactionStepState.FAILED,
  TransactionStepState.SKIPPED,
  TransactionStepState.SKIPPED_FAILURE,
  TransactionStepState.TIMEOUT,
])

const finishedStates = new Set([
  TransactionState.DONE,
  TransactionState.FAILED,
  TransactionState.REVERTED,
])

const failedStates = new Set([
  TransactionState.FAILED,
  TransactionState.REVERTED,
])
export class RedisDistributedTransactionStorage
  implements IDistributedTransactionStorage, IDistributedSchedulerStorage
{
  private workflowExecutionService_: ModulesSdkTypes.IMedusaInternalService<any>
  private logger_: Logger
  private workflowOrchestratorService_: WorkflowOrchestratorService

  private redisClient: Redis
  private redisWorkerConnection: Redis
  private queueName: string
  private jobQueueName: string
  private queue: Queue
  private jobQueue?: Queue
  private worker: Worker
  private jobWorker?: Worker
  private cleanerQueueName: string
  private cleanerWorker_: Worker
  private cleanerQueue_?: Queue

  // Per-queue options
  private mainQueueOptions_: Omit<QueueOptions, "connection">
  private mainWorkerOptions_: Omit<WorkerOptions, "connection">
  private jobQueueOptions_: Omit<QueueOptions, "connection">
  private jobWorkerOptions_: Omit<WorkerOptions, "connection">
  private cleanerQueueOptions_: Omit<QueueOptions, "connection">
  private cleanerWorkerOptions_: Omit<WorkerOptions, "connection">

  #isWorkerMode: boolean = false

  constructor({
    workflowExecutionService,
    redisConnection,
    redisWorkerConnection,
    redisQueueName,
    redisJobQueueName,
    redisMainQueueOptions,
    redisMainWorkerOptions,
    redisJobQueueOptions,
    redisJobWorkerOptions,
    redisCleanerQueueOptions,
    redisCleanerWorkerOptions,
    logger,
    isWorkerMode,
  }: {
    workflowExecutionService: ModulesSdkTypes.IMedusaInternalService<any>
    redisConnection: Redis
    redisWorkerConnection: Redis
    redisQueueName: string
    redisJobQueueName: string
    redisMainQueueOptions: Omit<QueueOptions, "connection">
    redisMainWorkerOptions: Omit<WorkerOptions, "connection">
    redisJobQueueOptions: Omit<QueueOptions, "connection">
    redisJobWorkerOptions: Omit<WorkerOptions, "connection">
    redisCleanerQueueOptions: Omit<QueueOptions, "connection">
    redisCleanerWorkerOptions: Omit<WorkerOptions, "connection">
    logger: Logger
    isWorkerMode: boolean
  }) {
    this.workflowExecutionService_ = workflowExecutionService
    this.logger_ = logger
    this.redisClient = redisConnection
    this.redisWorkerConnection = redisWorkerConnection
    this.cleanerQueueName = "workflows-cleaner"
    this.queueName = redisQueueName
    this.jobQueueName = redisJobQueueName

    // Store per-queue options
    this.mainQueueOptions_ = redisMainQueueOptions ?? {}
    this.mainWorkerOptions_ = redisMainWorkerOptions ?? {}
    this.jobQueueOptions_ = redisJobQueueOptions ?? {}
    this.jobWorkerOptions_ = redisJobWorkerOptions ?? {}
    this.cleanerQueueOptions_ = redisCleanerQueueOptions ?? {}
    this.cleanerWorkerOptions_ = redisCleanerWorkerOptions ?? {}

    // Create queues with their respective options
    this.queue = new Queue(redisQueueName, {
      ...this.mainQueueOptions_,
      connection: this.redisClient,
    })
    this.jobQueue = isWorkerMode
      ? new Queue(redisJobQueueName, {
          ...this.jobQueueOptions_,
          connection: this.redisClient,
        })
      : undefined
    this.cleanerQueue_ = isWorkerMode
      ? new Queue(this.cleanerQueueName, {
          ...this.cleanerQueueOptions_,
          connection: this.redisClient,
        })
      : undefined
    this.#isWorkerMode = isWorkerMode
  }

  async onApplicationPrepareShutdown() {
    // Close worker gracefully, i.e. wait for the current jobs to finish
    await this.worker?.close()
    await this.jobWorker?.close()

    await this.cleanerWorker_?.close()
  }

  async onApplicationShutdown() {
    await this.queue?.close()
    await this.jobQueue?.close()
    await this.cleanerQueue_?.close()
  }

  async onApplicationStart() {
    await this.ensureRedisConnection()
    const allowedJobs = [
      JobType.RETRY,
      JobType.STEP_TIMEOUT,
      JobType.TRANSACTION_TIMEOUT,
    ]

    // Per-worker options with their respective configurations
    const mainWorkerOptions: WorkerOptions = {
      ...this.mainWorkerOptions_,
      connection: this.redisWorkerConnection,
    }
    const jobWorkerOptions: WorkerOptions = {
      ...this.jobWorkerOptions_,
      connection: this.redisWorkerConnection,
    }
    const cleanerWorkerOptions: WorkerOptions = {
      ...this.cleanerWorkerOptions_,
      connection: this.redisWorkerConnection,
    }

    // TODO: Remove this once we have released to all clients (Added: v2.6+)
    // Remove all repeatable jobs from the old queue since now we have a queue dedicated to scheduled jobs
    await this.removeAllRepeatableJobs(this.queue)

    if (this.#isWorkerMode) {
      this.worker = new Worker(
        this.queueName,
        async (job) => {
          this.logger_.debug(
            `executing job ${job.name} from queue ${
              this.queueName
            } with the following data: ${JSON.stringify(job.data)}`
          )
          if (allowedJobs.includes(job.name as JobType)) {
            try {
              await this.executeTransaction(
                job.data.workflowId,
                job.data.transactionId,
                job.data.transactionMetadata
              )
            } catch (error) {
              if (!SkipExecutionError.isSkipExecutionError(error)) {
                throw error
              }
            }
          }

          if (job.name === JobType.SCHEDULE) {
            // Remove repeatable job from the old queue since now we have a queue dedicated to scheduled jobs
            await this.remove(job.data.jobId)
          }
        },
        mainWorkerOptions
      )

      this.jobWorker = new Worker(
        this.jobQueueName,
        async (job) => {
          this.logger_.debug(
            `executing scheduled job ${job.data.jobId} from queue ${
              this.jobQueueName
            } with the following options: ${JSON.stringify(
              job.data.schedulerOptions
            )}`
          )
          return await this.executeScheduledJob(
            job.data.jobId,
            job.data.schedulerOptions
          )
        },
        jobWorkerOptions
      )

      this.cleanerWorker_ = new Worker(
        this.cleanerQueueName,
        async () => {
          await this.clearExpiredExecutions()
        },
        cleanerWorkerOptions
      )

      await this.cleanerQueue_?.add(
        "cleaner",
        {},
        {
          repeat: {
            every: THIRTY_MINUTES_IN_MS,
          },
          jobId: REPEATABLE_CLEARER_JOB_ID,
          removeOnComplete: true,
          removeOnFail: true,
        }
      )
    }
  }

  setWorkflowOrchestratorService(workflowOrchestratorService) {
    this.workflowOrchestratorService_ = workflowOrchestratorService
  }

  private async ensureRedisConnection(): Promise<void> {
    const reconnectTasks: Promise<void>[] = []

    if (this.redisClient.status !== "ready") {
      this.logger_.warn(
        `[Workflow-engine-redis] Redis connection is not ready (status: ${this.redisClient.status}). Attempting to reconnect...`
      )
      reconnectTasks.push(
        this.redisClient
          .connect()
          .then(() => {
            this.logger_.info(
              "[Workflow-engine-redis] Redis connection reestablished successfully"
            )
          })
          .catch((error) => {
            this.logger_.error(
              "[Workflow-engine-redis] Failed to reconnect to Redis",
              error
            )
            throw new MedusaError(
              MedusaError.Types.DB_ERROR,
              `Redis connection failed: ${error.message}`
            )
          })
      )
    }

    if (this.redisWorkerConnection.status !== "ready") {
      this.logger_.warn(
        `[Workflow-engine-redis] Redis worker connection is not ready (status: ${this.redisWorkerConnection.status}). Attempting to reconnect...`
      )
      reconnectTasks.push(
        this.redisWorkerConnection
          .connect()
          .then(() => {
            this.logger_.info(
              "[Workflow-engine-redis] Redis worker connection reestablished successfully"
            )
          })
          .catch((error) => {
            this.logger_.error(
              "[Workflow-engine-redis] Failed to reconnect to Redis worker connection",
              error
            )
            throw new MedusaError(
              MedusaError.Types.DB_ERROR,
              `Redis worker connection failed: ${error.message}`
            )
          })
      )
    }

    if (reconnectTasks.length > 0) {
      await promiseAll(reconnectTasks)
    }
  }

  private async saveToDb(data: TransactionCheckpoint, retentionTime?: number) {
    const isNotStarted = data.flow.state === TransactionState.NOT_STARTED
    const asyncVersion = data.flow._v

    const isFinished = finishedStates.has(data.flow.state)
    const isWaitingToCompensate =
      data.flow.state === TransactionState.WAITING_TO_COMPENSATE

    const isFlowInvoking = data.flow.state === TransactionState.INVOKING

    const stepsArray = Object.values(data.flow.steps) as TransactionStep[]
    let currentStep!: TransactionStep

    const targetStates = isFlowInvoking
      ? new Set([
          TransactionStepState.INVOKING,
          TransactionStepState.DONE,
          TransactionStepState.FAILED,
        ])
      : new Set([TransactionStepState.COMPENSATING])

    for (let i = stepsArray.length - 1; i >= 0; i--) {
      const step = stepsArray[i]

      if (step.id === "_root") {
        break
      }

      const isTargetState = targetStates.has(step.invoke?.state)

      if (isTargetState && !currentStep) {
        currentStep = step
        break
      }
    }

    let shouldStoreCurrentSteps = false
    if (currentStep) {
      for (const step of stepsArray) {
        if (step.id === "_root") {
          continue
        }

        if (
          step.depth === currentStep.depth &&
          step?.definition?.store === true
        ) {
          shouldStoreCurrentSteps = true
          break
        }
      }
    }

    if (
      !(isNotStarted || isFinished || isWaitingToCompensate) &&
      !shouldStoreCurrentSteps &&
      !asyncVersion
    ) {
      return
    }

    await this.workflowExecutionService_.upsert([
      {
        workflow_id: data.flow.modelId,
        transaction_id: data.flow.transactionId,
        run_id: data.flow.runId,
        execution: data.flow,
        context: {
          data: data.context,
          errors: data.errors,
        },
        state: data.flow.state,
        retention_time: retentionTime,
      },
    ])
  }

  private async deleteFromDb(data: TransactionCheckpoint) {
    await this.workflowExecutionService_.delete([
      {
        run_id: data.flow.runId,
      },
    ])
  }

  private async executeTransaction(
    workflowId: string,
    transactionId: string,
    transactionMetadata: TransactionFlow["metadata"] = {}
  ) {
    return await this.workflowOrchestratorService_.run(workflowId, {
      transactionId,
      logOnError: true,
      throwOnError: false,
      context: {
        eventGroupId: transactionMetadata.eventGroupId,
        parentStepIdempotencyKey: transactionMetadata.parentStepIdempotencyKey,
        preventReleaseEvents: transactionMetadata.preventReleaseEvents,
      },
    })
  }

  private async executeScheduledJob(
    jobId: string,
    schedulerOptions: SchedulerOptions
  ) {
    try {
      // TODO: In the case of concurrency being forbidden, we want to generate a predictable transaction ID and rely on the idempotency
      // of the transaction to ensure that the transaction is only executed once.
      await this.workflowOrchestratorService_.run(jobId, {
        logOnError: true,
      })
    } catch (e) {
      if (e instanceof MedusaError && e.type === MedusaError.Types.NOT_FOUND) {
        this.logger_?.warn(
          `Tried to execute a scheduled workflow with ID ${jobId} that does not exist, removing it from the scheduler.`
        )

        await this.remove(jobId)
        return
      }

      throw e
    }
  }

  async get(
    key: string,
    options?: TransactionOptions & {
      isCancelling?: boolean
      _cachedRawData?: string | null
    }
  ): Promise<TransactionCheckpoint | undefined> {
    const [_, workflowId, transactionId] = key.split(":")

    const [trx, rawData] = await promiseAll([
      this.workflowExecutionService_
        .list(
          {
            workflow_id: workflowId,
            transaction_id: transactionId,
          },
          {
            select: ["execution", "context"],
            order: {
              id: "desc",
            },
            take: 1,
          }
        )
        .then((trx) => trx[0])
        .catch(() => undefined),
      options?._cachedRawData !== undefined
        ? Promise.resolve(options._cachedRawData)
        : this.redisClient.get(key),
    ])

    if (trx) {
      let flow!: TransactionFlow, errors!: TransactionStepError[]
      if (rawData) {
        const data = JSON.parse(rawData)
        flow = data.flow
        errors = data.errors
      }

      const { idempotent } = options ?? {}
      const execution = trx.execution as TransactionFlow

      if (!idempotent) {
        const isFailedOrReverted = failedStates.has(execution.state)

        const isDone = execution.state === TransactionState.DONE

        const isCancellingAndFailedOrReverted =
          options?.isCancelling && isFailedOrReverted

        const isNotCancellingAndDoneOrFailedOrReverted =
          !options?.isCancelling && (isDone || isFailedOrReverted)

        if (
          isCancellingAndFailedOrReverted ||
          isNotCancellingAndDoneOrFailedOrReverted
        ) {
          return
        }
      }

      return new TransactionCheckpoint(
        flow ?? (trx.execution as TransactionFlow),
        trx.context?.data as TransactionContext,
        errors ?? (trx.context?.errors as TransactionStepError[])
      )
    }

    return
  }

  async save(
    key: string,
    data: TransactionCheckpoint,
    ttl?: number,
    options?: TransactionOptions
  ): Promise<TransactionCheckpoint> {
    /**
     * Store the retention time only if the transaction is done, failed or reverted.
     */
    const { retentionTime } = options ?? {}

    let lockAcquired = false

    let storedData: TransactionCheckpoint | undefined

    if (data.flow._v) {
      lockAcquired = await this.#acquireLock(key)

      if (!lockAcquired) {
        throw new Error("Lock not acquired")
      }

      storedData = await this.get(key, {
        isCancelling: !!data.flow.cancelledAt,
      } as any)

      TransactionCheckpoint.mergeCheckpoints(data, storedData)
    }

    try {
      const hasFinished = finishedStates.has(data.flow.state)

      await this.#preventRaceConditionExecutionIfNecessary({
        data: data,
        key,
        options,
        storedData,
      })

      // Only set if not exists
      const shouldSetNX =
        data.flow.state === TransactionState.NOT_STARTED &&
        !data.flow.transactionId.startsWith("auto-")

      if (retentionTime) {
        Object.assign(data, {
          retention_time: retentionTime,
        })
      }

      const execPipeline = () => {
        const stringifiedData = JSON.stringify({
          errors: data.errors,
          flow: data.flow,
        })

        const pipeline = this.redisClient.pipeline()

        if (!hasFinished) {
          if (ttl) {
            if (shouldSetNX) {
              pipeline.set(key, stringifiedData, "EX", ttl, "NX")
            } else {
              pipeline.set(key, stringifiedData, "EX", ttl)
            }
          } else {
            if (shouldSetNX) {
              pipeline.set(key, stringifiedData, "NX")
            } else {
              pipeline.set(key, stringifiedData)
            }
          }
        } else {
          pipeline.unlink(key)
        }

        return pipeline.exec().then((result) => {
          if (!shouldSetNX) {
            return result
          }

          const actionResult = result?.pop()
          const isOk = !!actionResult?.pop()
          if (!isOk) {
            throw new SkipExecutionError(
              "Transaction already started for transactionId: " +
                data.flow.transactionId
            )
          }

          return result
        })
      }

      // Parallelize DB and Redis operations for better performance
      if (hasFinished && !retentionTime) {
        if (!data.flow.metadata?.parentStepIdempotencyKey) {
          await promiseAll([this.deleteFromDb(data), execPipeline()])
        } else {
          await promiseAll([this.saveToDb(data, retentionTime), execPipeline()])
        }
      } else {
        await promiseAll([this.saveToDb(data, retentionTime), execPipeline()])
      }

      return data as TransactionCheckpoint
    } finally {
      if (lockAcquired) {
        await this.#releaseLock(key)
      }
    }
  }

  async scheduleRetry(
    transaction: DistributedTransactionType,
    step: TransactionStep,
    timestamp: number,
    interval: number
  ): Promise<void> {
    await this.queue.add(
      JobType.RETRY,
      {
        workflowId: transaction.modelId,
        transactionId: transaction.transactionId,
        transactionMetadata: transaction.getFlow().metadata,
        stepId: step.id,
      },
      {
        delay: interval > 0 ? interval * 1000 : undefined,
        jobId: this.getJobId(JobType.RETRY, transaction, step, interval),
        removeOnComplete: true,
      }
    )
  }

  async clearRetry(
    transaction: DistributedTransactionType,
    step: TransactionStep
  ): Promise<void> {
    // Pass retry interval to ensure we remove the correct job (with -retry suffix if interval > 0)
    const interval =
      step.definition.retryInterval ||
      step.definition.retryIntervalAwaiting ||
      0
    await this.removeJob(JobType.RETRY, transaction, step, interval)
  }

  async scheduleTransactionTimeout(
    transaction: DistributedTransactionType,
    _: number,
    interval: number
  ): Promise<void> {
    await this.queue.add(
      JobType.TRANSACTION_TIMEOUT,
      {
        workflowId: transaction.modelId,
        transactionId: transaction.transactionId,
        transactionMetadata: transaction.getFlow().metadata,
      },
      {
        delay: interval * 1000,
        jobId: this.getJobId(JobType.TRANSACTION_TIMEOUT, transaction),
        removeOnComplete: true,
      }
    )
  }

  async clearTransactionTimeout(
    transaction: DistributedTransactionType
  ): Promise<void> {
    await this.removeJob(JobType.TRANSACTION_TIMEOUT, transaction)
  }

  async scheduleStepTimeout(
    transaction: DistributedTransactionType,
    step: TransactionStep,
    timestamp: number,
    interval: number
  ): Promise<void> {
    await this.queue.add(
      JobType.STEP_TIMEOUT,
      {
        workflowId: transaction.modelId,
        transactionId: transaction.transactionId,
        transactionMetadata: transaction.getFlow().metadata,
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
    transaction: DistributedTransactionType,
    step: TransactionStep
  ): Promise<void> {
    await this.removeJob(JobType.STEP_TIMEOUT, transaction, step)
  }

  private getJobId(
    type: JobType,
    transaction: DistributedTransactionType,
    step?: TransactionStep,
    interval?: number
  ) {
    const key = [type, transaction.modelId, transaction.transactionId]

    if (step) {
      key.push(step.id)

      // Step timeout has a single job per step
      if (type !== JobType.STEP_TIMEOUT) {
        key.push(step.attempts + "")
      }

      // Add suffix for retry scheduling (interval > 0) to avoid collision with async execution (interval = 0)
      if (type === JobType.RETRY && isDefined(interval) && interval > 0) {
        key.push("retry")
      }

      if (step.isCompensating()) {
        key.push("compensate")
      }
    }

    return key.join(":")
  }

  private async removeJob(
    type: JobType,
    transaction: DistributedTransactionType,
    step?: TransactionStep,
    interval?: number
  ) {
    const jobId = this.getJobId(type, transaction, step, interval)

    if (type === JobType.SCHEDULE) {
      const job = await this.jobQueue?.getJob(jobId)
      if (job) {
        await job.remove()
      }
    } else {
      const job = await this.queue.getJob(jobId)

      if (job && job.attemptsStarted === 0) {
        await job.remove()
      }
    }
  }

  /* Scheduler storage methods */
  async schedule(
    jobDefinition: string | { jobId: string },
    schedulerOptions: SchedulerOptions
  ): Promise<void> {
    const jobId =
      typeof jobDefinition === "string" ? jobDefinition : jobDefinition.jobId

    if ("cron" in schedulerOptions && "interval" in schedulerOptions) {
      throw new Error(
        `Unable to register a job with both scheduler options interval and cron.`
      )
    }

    const repeatOptions: RepeatOptions = {
      limit: schedulerOptions.numberOfExecutions,
      key: `${JobType.SCHEDULE}_${jobId}`,
    }

    if ("cron" in schedulerOptions) {
      repeatOptions.pattern = schedulerOptions.cron
    } else {
      repeatOptions.every = schedulerOptions.interval
    }

    // If it is the same key (eg. the same workflow name), the old one will get overridden.
    await this.jobQueue?.add(
      JobType.SCHEDULE,
      {
        jobId,
        schedulerOptions,
      },
      {
        repeat: repeatOptions,
        removeOnComplete: {
          age: 86400,
          count: 1000,
        },
        removeOnFail: {
          age: 604800,
          count: 5000,
        },
      }
    )
  }

  async remove(jobId: string): Promise<void> {
    await this.jobQueue?.removeRepeatableByKey(`${JobType.SCHEDULE}_${jobId}`)
  }

  async removeAll(): Promise<void> {
    return await this.removeAllRepeatableJobs(this.jobQueue!)
  }

  private async removeAllRepeatableJobs(queue: Queue): Promise<void> {
    const repeatableJobs = (await queue.getRepeatableJobs()) ?? []
    await promiseAll(
      repeatableJobs.map((job) => queue.removeRepeatableByKey(job.key))
    )
  }

  /**
   * Generate a lock key for the given transaction key
   */
  #getLockKey(key: string): string {
    return `${key}:lock`
  }

  async #acquireLock(key: string, ttlSeconds: number = 2): Promise<boolean> {
    const lockKey = this.#getLockKey(key)

    const result = await this.redisClient.set(
      lockKey,
      1,
      "EX",
      ttlSeconds,
      "NX"
    )
    return result === "OK"
  }

  async #releaseLock(key: string): Promise<void> {
    const lockKey = this.#getLockKey(key)
    await this.redisClient.del(lockKey)
  }

  async #preventRaceConditionExecutionIfNecessary({
    data,
    key,
    options,
    storedData,
  }: {
    data: TransactionCheckpoint
    key: string
    options?: TransactionOptions
    storedData?: TransactionCheckpoint
  }) {
    const isInitialCheckpoint = [TransactionState.NOT_STARTED].includes(
      data.flow.state
    )
    /**
     * In case many execution can succeed simultaneously, we need to ensure that the latest
     * execution does continue if a previous execution is considered finished
     */
    const currentFlow = data.flow

    let data_ = storedData ?? ({} as TransactionCheckpoint)

    if (!storedData) {
      const rawData = await this.redisClient.get(key)
      if (rawData) {
        data_ = JSON.parse(rawData)
      } else {
        // Pass cached raw data to avoid redundant Redis fetch
        const getOptions = {
          ...options,
          isCancelling: !!data.flow.cancelledAt,
          _cachedRawData: rawData,
        } as Parameters<typeof this.get>[1]

        data_ =
          (await this.get(key, getOptions as TransactionOptions)) ??
          ({ flow: {} } as TransactionCheckpoint)
      }
    }

    const { flow: latestUpdatedFlow } = data_
    if (options?.stepId) {
      const stepId = options.stepId
      const currentStep = data.flow.steps[stepId]
      const latestStep = latestUpdatedFlow.steps?.[stepId]
      if (latestStep && currentStep) {
        const isCompensating = data.flow.state === TransactionState.COMPENSATING

        const latestState = isCompensating
          ? latestStep.compensate?.state
          : latestStep.invoke?.state

        const shouldSkip = doneStates.has(latestState)

        if (shouldSkip) {
          throw new SkipStepAlreadyFinishedError(
            `Step ${stepId} already finished by another execution`
          )
        }
      }
    }

    if (
      !isInitialCheckpoint &&
      !isPresent(latestUpdatedFlow) &&
      !data.flow.metadata?.parentStepIdempotencyKey
    ) {
      /**
       * the initial checkpoint expect no other checkpoint to have been stored.
       * In case it is not the initial one and another checkpoint is trying to
       * find if a concurrent execution has finished, we skip the execution.
       * The already finished execution would have deleted the checkpoint already.
       */
      throw new SkipExecutionError("Already finished by another execution")
    }

    // Ensure that the latest execution was not cancelled, otherwise we skip the execution
    const latestTransactionCancelledAt = latestUpdatedFlow.cancelledAt
    const currentTransactionCancelledAt = currentFlow.cancelledAt

    if (
      !!latestTransactionCancelledAt &&
      currentTransactionCancelledAt == null
    ) {
      throw new SkipCancelledExecutionError(
        "Workflow execution has been cancelled during the execution"
      )
    }
  }

  async clearExpiredExecutions() {
    await this.workflowExecutionService_.delete({
      retention_time: {
        $ne: null,
      },
      updated_at: {
        $lte: raw(
          (_alias) =>
            `CURRENT_TIMESTAMP - (INTERVAL '1 second' * "retention_time")`
        ),
      },
      state: {
        $in: [
          TransactionState.DONE,
          TransactionState.FAILED,
          TransactionState.REVERTED,
        ],
      },
    })
  }
}
