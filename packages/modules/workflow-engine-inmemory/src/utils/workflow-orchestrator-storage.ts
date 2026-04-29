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
import {
  InferEntityType,
  Logger,
  ModulesSdkTypes,
} from "@medusajs/framework/types"
import {
  isPresent,
  MedusaError,
  TransactionState,
  TransactionStepState,
} from "@medusajs/framework/utils"
import { WorkflowOrchestratorService } from "@services"
import { type CronExpression, parseExpression } from "cron-parser"
import { WorkflowExecution } from "../models/workflow-execution"

const THIRTY_MINUTES_IN_MS = 1000 * 60 * 30

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

function calculateDelayFromExpression(expression: CronExpression): number {
  const nextTime = expression.next().getTime()
  const now = Date.now()
  const delay = nextTime - now

  // If the calculated delay is negative or zero, get the next occurrence
  if (delay <= 0) {
    const nextNextTime = expression.next().getTime()
    return Math.max(1, nextNextTime - now)
  }

  return delay
}

function parseNextExecution(
  optionsOrExpression: SchedulerOptions | CronExpression | string | number
) {
  if (typeof optionsOrExpression === "object") {
    if ("cron" in optionsOrExpression) {
      const expression = parseExpression(optionsOrExpression.cron)
      return calculateDelayFromExpression(expression)
    }

    if ("interval" in optionsOrExpression) {
      return optionsOrExpression.interval
    }

    return calculateDelayFromExpression(optionsOrExpression)
  }

  const result = parseInt(`${optionsOrExpression}`)

  if (isNaN(result)) {
    const expression = parseExpression(`${optionsOrExpression}`)
    return calculateDelayFromExpression(expression)
  }

  return result
}

export class InMemoryDistributedTransactionStorage
  implements IDistributedTransactionStorage, IDistributedSchedulerStorage
{
  private workflowExecutionService_: ModulesSdkTypes.IMedusaInternalService<any>
  private logger_: Logger
  private workflowOrchestratorService_: WorkflowOrchestratorService

  private storage: Record<string, TransactionCheckpoint> = {}
  private scheduled: Map<
    string,
    {
      timer: NodeJS.Timeout
      expression: CronExpression | number
      numberOfExecutions: number
      config: SchedulerOptions
    }
  > = new Map()
  private retries: Map<string, NodeJS.Timeout> = new Map()
  private timeouts: Map<string, NodeJS.Timeout> = new Map()
  private pendingTimers: Set<NodeJS.Timeout> = new Set()

  private clearTimeout_: NodeJS.Timeout
  private isLocked: Map<string, boolean> = new Map()

  constructor({
    workflowExecutionService,
    logger,
  }: {
    workflowExecutionService: ModulesSdkTypes.IMedusaInternalService<any>
    logger: Logger
  }) {
    this.workflowExecutionService_ = workflowExecutionService
    this.logger_ = logger
  }

  async onApplicationStart() {
    this.clearTimeout_ = setInterval(async () => {
      try {
        await this.clearExpiredExecutions()
      } catch {}
    }, THIRTY_MINUTES_IN_MS)
  }

  async onApplicationShutdown() {
    clearInterval(this.clearTimeout_)

    for (const timer of this.pendingTimers) {
      clearTimeout(timer)
    }
    this.pendingTimers.clear()

    for (const timer of this.retries.values()) {
      clearTimeout(timer)
    }
    this.retries.clear()

    for (const timer of this.timeouts.values()) {
      clearTimeout(timer)
    }
    this.timeouts.clear()

    // Clean up scheduled job timers
    for (const job of this.scheduled.values()) {
      clearTimeout(job.timer)
    }
    this.scheduled.clear()
  }

  setWorkflowOrchestratorService(workflowOrchestratorService) {
    this.workflowOrchestratorService_ = workflowOrchestratorService
  }

  private createManagedTimer(
    callback: () => void | Promise<void>,
    delay: number
  ): NodeJS.Timeout {
    const timer = setTimeout(async () => {
      this.pendingTimers.delete(timer)
      const res = callback()
      if (res instanceof Promise) {
        await res
      }
    }, delay)

    this.pendingTimers.add(timer)
    return timer
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

  async get(
    key: string,
    options?: TransactionOptions & {
      isCancelling?: boolean
    }
  ): Promise<TransactionCheckpoint | undefined> {
    const [_, workflowId, transactionId] = key.split(":")
    const trx: InferEntityType<typeof WorkflowExecution> | undefined =
      await this.workflowExecutionService_
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
        .catch(() => undefined)

    if (trx) {
      const { flow, errors } = this.storage[key]
        ? JSON.parse(JSON.stringify(this.storage[key]))
        : {}
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
        flow ?? (trx?.execution as TransactionFlow),
        trx?.context?.data as TransactionContext,
        errors ?? (trx?.context?.errors as TransactionStepError[])
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
    if (this.isLocked.has(key)) {
      throw new Error("Transaction storage is locked")
    }

    this.isLocked.set(key, true)

    try {
      /**
       * Store the retention time only if the transaction is done, failed or reverted.
       * From that moment, this tuple can be later on archived or deleted after the retention time.
       */
      const { retentionTime } = options ?? {}

      const hasFinished = finishedStates.has(data.flow.state)

      await this.#preventRaceConditionExecutionIfNecessary({
        data,
        key,
        options,
      })

      // Only store retention time if it's provided
      if (retentionTime) {
        Object.assign(data, {
          retention_time: retentionTime,
        })
      }

      // Store in memory
      const isNotStarted = data.flow.state === TransactionState.NOT_STARTED
      const isManualTransactionId = !data.flow.transactionId.startsWith("auto-")

      if (isNotStarted && isManualTransactionId) {
        const storedData = this.storage[key]
        if (storedData) {
          throw new SkipExecutionError(
            "Transaction already started for transactionId: " +
              data.flow.transactionId
          )
        }
      }

      if (data.flow._v) {
        const storedData = await this.get(key, {
          isCancelling: !!data.flow.cancelledAt,
        } as any)

        TransactionCheckpoint.mergeCheckpoints(data, storedData)
      }

      const { flow, context, errors } = data

      this.storage[key] = {
        flow: JSON.parse(JSON.stringify(flow)),
        context: JSON.parse(JSON.stringify(context)),
        errors: [...errors],
      } as TransactionCheckpoint

      // Optimize DB operations - only perform when necessary
      if (hasFinished) {
        if (!retentionTime) {
          if (!flow.metadata?.parentStepIdempotencyKey) {
            await this.deleteFromDb(data)
          } else {
            await this.saveToDb(data, retentionTime)
          }
        } else {
          await this.saveToDb(data, retentionTime)
        }

        delete this.storage[key]
      } else {
        await this.saveToDb(data, retentionTime)
      }

      return data
    } finally {
      this.isLocked.delete(key)
    }
  }

  async #preventRaceConditionExecutionIfNecessary({
    data,
    key,
    options,
  }: {
    data: TransactionCheckpoint
    key: string
    options?: TransactionOptions
  }) {
    const isInitialCheckpoint = [TransactionState.NOT_STARTED].includes(
      data.flow.state
    )
    /**
     * In case many execution can succeed simultaneously, we need to ensure that the latest
     * execution does continue if a previous execution is considered finished
     */
    const currentFlow = data.flow

    const rawData = this.storage[key]
    let data_ = {} as TransactionCheckpoint
    if (rawData) {
      data_ = rawData as TransactionCheckpoint
    } else {
      const getOptions = {
        ...options,
        isCancelling: !!data.flow.cancelledAt,
      } as Parameters<typeof this.get>[1]

      data_ =
        (await this.get(key, getOptions as TransactionOptions)) ??
        ({ flow: {} } as TransactionCheckpoint)
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

  async scheduleRetry(
    transaction: DistributedTransactionType,
    step: TransactionStep,
    timestamp: number,
    interval: number
  ): Promise<void> {
    const { modelId: workflowId, transactionId } = transaction
    const key = `${workflowId}:${transactionId}:${step.id}`

    const existingTimer = this.retries.get(key)
    if (existingTimer) {
      clearTimeout(existingTimer)
      this.pendingTimers.delete(existingTimer)
    }

    const timer = this.createManagedTimer(async () => {
      this.retries.delete(key)
      const context = transaction.getFlow().metadata ?? {}
      await this.workflowOrchestratorService_.run(workflowId, {
        transactionId,
        logOnError: true,
        throwOnError: false,
        context: {
          eventGroupId: context.eventGroupId,
          parentStepIdempotencyKey: context.parentStepIdempotencyKey,
          preventReleaseEvents: context.preventReleaseEvents,
        },
      })
    }, interval * 1e3)

    this.retries.set(key, timer)
  }

  async clearRetry(
    transaction: DistributedTransactionType,
    step: TransactionStep
  ): Promise<void> {
    const { modelId: workflowId, transactionId } = transaction

    const key = `${workflowId}:${transactionId}:${step.id}`
    const timer = this.retries.get(key)
    if (timer) {
      clearTimeout(timer)
      this.pendingTimers.delete(timer)
      this.retries.delete(key)
    }
  }

  async scheduleTransactionTimeout(
    transaction: DistributedTransactionType,
    timestamp: number,
    interval: number
  ): Promise<void> {
    const { modelId: workflowId, transactionId } = transaction
    const key = `${workflowId}:${transactionId}`

    const existingTimer = this.timeouts.get(key)
    if (existingTimer) {
      clearTimeout(existingTimer)
      this.pendingTimers.delete(existingTimer)
    }

    const timer = this.createManagedTimer(async () => {
      this.timeouts.delete(key)
      const context = transaction.getFlow().metadata ?? {}
      await this.workflowOrchestratorService_.run(workflowId, {
        transactionId,
        logOnError: true,
        throwOnError: false,
        context: {
          eventGroupId: context.eventGroupId,
          parentStepIdempotencyKey: context.parentStepIdempotencyKey,
          preventReleaseEvents: context.preventReleaseEvents,
        },
      })
    }, interval * 1e3)

    this.timeouts.set(key, timer)
  }

  async clearTransactionTimeout(
    transaction: DistributedTransactionType
  ): Promise<void> {
    const { modelId: workflowId, transactionId } = transaction

    const key = `${workflowId}:${transactionId}`
    const timer = this.timeouts.get(key)
    if (timer) {
      clearTimeout(timer)
      this.pendingTimers.delete(timer)
      this.timeouts.delete(key)
    }
  }

  async scheduleStepTimeout(
    transaction: DistributedTransactionType,
    step: TransactionStep,
    timestamp: number,
    interval: number
  ): Promise<void> {
    const { modelId: workflowId, transactionId } = transaction
    const key = `${workflowId}:${transactionId}:${step.id}`

    const existingTimer = this.timeouts.get(key)
    if (existingTimer) {
      clearTimeout(existingTimer)
      this.pendingTimers.delete(existingTimer)
    }

    const timer = this.createManagedTimer(async () => {
      this.timeouts.delete(key)
      const context = transaction.getFlow().metadata ?? {}
      await this.workflowOrchestratorService_.run(workflowId, {
        transactionId,
        logOnError: true,
        throwOnError: false,
        context: {
          eventGroupId: context.eventGroupId,
          parentStepIdempotencyKey: context.parentStepIdempotencyKey,
          preventReleaseEvents: context.preventReleaseEvents,
        },
      })
    }, interval * 1e3)

    this.timeouts.set(key, timer)
  }

  async clearStepTimeout(
    transaction: DistributedTransactionType,
    step: TransactionStep
  ): Promise<void> {
    const { modelId: workflowId, transactionId } = transaction

    const key = `${workflowId}:${transactionId}:${step.id}`
    const timer = this.timeouts.get(key)
    if (timer) {
      clearTimeout(timer)
      this.pendingTimers.delete(timer)
      this.timeouts.delete(key)
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
    await this.remove(jobId)

    let expression: CronExpression | number
    let nextExecution = parseNextExecution(schedulerOptions)

    if ("cron" in schedulerOptions) {
      // Cache the parsed expression to avoid repeated parsing
      expression = parseExpression(schedulerOptions.cron)
    } else if ("interval" in schedulerOptions) {
      expression = schedulerOptions.interval
    } else {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "Schedule cron or interval definition is required for scheduled jobs."
      )
    }

    const timer = setTimeout(async () => {
      this.jobHandler(jobId)
    }, nextExecution)

    // Set the timer's unref to prevent it from keeping the process alive
    timer.unref()

    this.scheduled.set(jobId, {
      timer,
      expression,
      numberOfExecutions: 0,
      config: schedulerOptions,
    })
  }

  async remove(jobId: string): Promise<void> {
    const job = this.scheduled.get(jobId)
    if (!job) {
      return
    }

    clearTimeout(job.timer)
    this.scheduled.delete(jobId)
  }

  async removeAll(): Promise<void> {
    for (const [key] of this.scheduled) {
      await this.remove(key)
    }
  }

  async jobHandler(jobId: string) {
    const job = this.scheduled.get(jobId)
    if (!job) {
      return
    }

    if (
      job.config?.numberOfExecutions !== undefined &&
      job.config.numberOfExecutions <= job.numberOfExecutions
    ) {
      this.scheduled.delete(jobId)
      return
    }

    const nextExecution = parseNextExecution(job.expression)

    try {
      await this.workflowOrchestratorService_.run(jobId, {
        logOnError: true,
        throwOnError: false,
      })

      const timer = this.createManagedTimer(() => {
        this.jobHandler(jobId)
      }, nextExecution)

      // Prevent timer from keeping the process alive
      timer.unref()

      this.scheduled.set(jobId, {
        timer,
        expression: job.expression,
        numberOfExecutions: (job.numberOfExecutions ?? 0) + 1,
        config: job.config,
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

  async clearExpiredExecutions(): Promise<void> {
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
