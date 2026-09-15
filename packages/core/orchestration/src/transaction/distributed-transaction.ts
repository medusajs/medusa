import { isDefined, TransactionStepState } from "@medusajs/utils"
import { EventEmitter } from "events"
import { setTimeout as setTimeoutPromise } from "node:timers/promises"
import { IDistributedTransactionStorage } from "./datastore/abstract-storage"
import { BaseInMemoryDistributedTransactionStorage } from "./datastore/base-in-memory-storage"
import { NonSerializableCheckPointError, SkipExecutionError } from "./errors"
import { TransactionOrchestrator } from "./transaction-orchestrator"
import { TransactionStep, TransactionStepHandler } from "./transaction-step"
import {
  TransactionFlow,
  TransactionHandlerType,
  TransactionState,
  TransactionStepStatus,
} from "./types"

const flowMergeableProperties = [
  "state",
  "hasFailedSteps",
  "hasSkippedOnFailureSteps",
  "hasSkippedSteps",
  "hasRevertedSteps",
  "cancelledAt",
  "startedAt",
  "hasAsyncSteps",
  "_v",
  "timedOutAt",
]

const mergeStep = (
  currentStep: TransactionStep,
  storedStep: TransactionStep
) => {
  const mergeProperties = [
    "attempts",
    "failures",
    "temporaryFailedAt",
    "retryRescheduledAt",
    "hasScheduledRetry",
    "lastAttempt",
    "_v",
    "stepFailed",
    "startedAt",
  ]

  for (const prop of mergeProperties) {
    if (prop === "hasScheduledRetry" || prop === "stepFailed") {
      currentStep[prop] = storedStep[prop] ?? currentStep[prop]
      continue
    }

    currentStep[prop] =
      storedStep[prop] || currentStep[prop]
        ? Math.max(storedStep[prop] ?? 0, currentStep[prop] ?? 0)
        : currentStep[prop] ?? storedStep[prop]
  }
}

const getErrorSignature = (err: TransactionStepError) =>
  `${err.action}:${err.handlerType}:${err.error?.message}`

/**
 * @typedef TransactionMetadata
 * @property model_id - The id of the model_id that created the transaction (modelId).
 * @property idempotency_key - The idempotency key of the transaction.
 * @property action - The action of the transaction.
 * @property action_type - The type of the transaction.
 * @property attempt - The number of attempts for the transaction.
 * @property timestamp - The timestamp of the transaction.
 */
export type TransactionMetadata = {
  model_id: string
  idempotency_key: string
  action: string
  action_type: TransactionHandlerType
  attempt: number
  timestamp: number
}

/**
 * @typedef TransactionContext
 * @property payload - Object containing the initial payload.
 * @property invoke - Object containing responses of Invoke handlers on steps flagged with saveResponse.
 * @property compensate - Object containing responses of Compensate handlers on steps flagged with saveResponse.
 */
export class TransactionContext {
  constructor(
    public payload: unknown = undefined,
    public invoke: Record<string, unknown> = {},
    public compensate: Record<string, unknown> = {}
  ) {}
}

export class TransactionStepError {
  constructor(
    public action: string,
    public handlerType: TransactionHandlerType,
    public error: Error | any
  ) {}
}

const stateFlowOrder = [
  TransactionState.NOT_STARTED,
  TransactionState.INVOKING,
  TransactionState.DONE,
  TransactionState.WAITING_TO_COMPENSATE,
  TransactionState.COMPENSATING,
  TransactionState.REVERTED,
  TransactionState.FAILED,
]

const stateFlowOrderMap = new Map<TransactionState, number>(
  stateFlowOrder.map((state, index) => [state, index])
)

const finishedStatesSet = new Set([
  TransactionState.DONE,
  TransactionState.REVERTED,
  TransactionState.FAILED,
])

export class TransactionCheckpoint {
  static readonly #ALLOWED_STATE_TRANSITIONS = {
    [TransactionStepState.DORMANT]: [TransactionStepState.NOT_STARTED],
    [TransactionStepState.NOT_STARTED]: [
      TransactionStepState.INVOKING,
      TransactionStepState.COMPENSATING,
      TransactionStepState.FAILED,
      TransactionStepState.SKIPPED,
      TransactionStepState.SKIPPED_FAILURE,
    ],
    [TransactionStepState.INVOKING]: [
      TransactionStepState.FAILED,
      TransactionStepState.DONE,
      TransactionStepState.TIMEOUT,
      TransactionStepState.SKIPPED,
    ],
    [TransactionStepState.COMPENSATING]: [
      TransactionStepState.REVERTED,
      TransactionStepState.FAILED,
    ],
    [TransactionStepState.DONE]: [TransactionStepState.COMPENSATING],
  } as const

  static readonly #ALLOWED_STATUS_TRANSITIONS = {
    [TransactionStepStatus.WAITING]: [
      TransactionStepStatus.OK,
      TransactionStepStatus.TEMPORARY_FAILURE,
      TransactionStepStatus.PERMANENT_FAILURE,
    ],
    [TransactionStepStatus.TEMPORARY_FAILURE]: [
      TransactionStepStatus.IDLE,
      TransactionStepStatus.PERMANENT_FAILURE,
    ],
    [TransactionStepStatus.PERMANENT_FAILURE]: [TransactionStepStatus.IDLE],
  } as const

  constructor(
    public flow: TransactionFlow,
    public context: TransactionContext,
    public errors: TransactionStepError[] = []
  ) {}

  /**
   * Merge the current checkpoint with incoming data from a concurrent save operation.
   * This handles race conditions when multiple steps complete simultaneously.
   *
   * @param storedData - The checkpoint data being saved
   * @param savingStepId - Optional step ID if this is a step-specific save
   */
  static mergeCheckpoints(
    currentTransactionData: TransactionCheckpoint,
    storedData?: TransactionCheckpoint
  ): TransactionCheckpoint {
    if (!currentTransactionData || !storedData) {
      return currentTransactionData
    }

    TransactionCheckpoint.#mergeFlow(currentTransactionData, storedData)
    TransactionCheckpoint.#mergeErrors(
      currentTransactionData.errors ?? [],
      storedData.errors
    )

    return currentTransactionData
  }

  static #mergeFlow(
    currentTransactionData: TransactionCheckpoint,
    storedData: TransactionCheckpoint
  ): void {
    const currentTransactionContext = currentTransactionData.context
    const storedContext = storedData.context

    if (currentTransactionData.flow._v >= storedData.flow._v) {
      for (const prop of flowMergeableProperties) {
        if (
          prop === "startedAt" ||
          prop === "cancelledAt" ||
          prop === "timedOutAt"
        ) {
          currentTransactionData.flow[prop] =
            storedData.flow[prop] || currentTransactionData.flow[prop]
              ? Math.max(
                  storedData.flow[prop] ?? 0,
                  currentTransactionData.flow[prop] ?? 0
                )
              : currentTransactionData.flow[prop] ??
                storedData.flow[prop] ??
                (undefined as any)
        } else if (prop === "_v") {
          currentTransactionData.flow[prop] = Math.max(
            storedData.flow[prop] ?? 0,
            currentTransactionData.flow[prop] ?? 0
          )
        } else if (prop === "state") {
          const currentStateIndex =
            stateFlowOrderMap.get(currentTransactionData.flow.state) ?? -1
          const storedStateIndex =
            stateFlowOrderMap.get(storedData.flow.state) ?? -1

          if (storedStateIndex > currentStateIndex) {
            currentTransactionData.flow.state = storedData.flow.state
          } else if (
            currentStateIndex < storedStateIndex &&
            currentTransactionData.flow.state !==
              TransactionState.WAITING_TO_COMPENSATE
          ) {
            throw new SkipExecutionError(
              `Transaction is behind another execution`
            )
          }
        } else if (
          storedData.flow[prop] &&
          !currentTransactionData.flow[prop]
        ) {
          currentTransactionData.flow[prop] = storedData.flow[prop]
        }
      }
    }

    const storedSteps = Object.values(storedData.flow.steps)

    for (const storedStep of storedSteps) {
      if (storedStep.id === "_root") {
        continue
      }

      const stepName = storedStep.definition.action!
      const stepId = storedStep.id

      // Merge context responses
      if (
        storedContext.invoke[stepName] &&
        !currentTransactionContext.invoke[stepName]
      ) {
        currentTransactionContext.invoke[stepName] =
          storedContext.invoke[stepName]
      }

      if (
        storedContext.compensate[stepName] &&
        !currentTransactionContext.compensate[stepName]
      ) {
        currentTransactionContext.compensate[stepName] =
          storedContext.compensate[stepName]
      }

      const currentStepVersion = currentTransactionData.flow.steps[stepId]._v!
      const storedStepVersion = storedData.flow.steps[stepId]._v!

      if (storedStepVersion > currentStepVersion) {
        throw new SkipExecutionError(`Transaction is behind another execution`)
      }

      // Determine which state is further along in the process
      const shouldUpdateInvoke = TransactionCheckpoint.#shouldUpdateStepState(
        currentTransactionData.flow.steps[stepId].invoke,
        storedStep.invoke
      )

      const shouldUpdateCompensate =
        TransactionCheckpoint.#shouldUpdateStepState(
          currentTransactionData.flow.steps[stepId].compensate,
          storedStep.compensate
        )

      if (shouldUpdateInvoke) {
        currentTransactionData.flow.steps[stepId].invoke = storedStep.invoke
      }

      if (shouldUpdateCompensate) {
        currentTransactionData.flow.steps[stepId].compensate =
          storedStep.compensate
      }

      mergeStep(currentTransactionData.flow.steps[stepId], storedStep)
    }
  }

  /**
   * Determines if the stored step state should replace the current step state.
   * This validates both state and status transitions according to TransactionStep rules.
   */
  static #shouldUpdateStepState(
    currentStepState: {
      state: TransactionStepState
      status: TransactionStepStatus
    },
    storedStepState: {
      state: TransactionStepState
      status: TransactionStepStatus
    }
  ): boolean {
    if (
      currentStepState.state === storedStepState.state &&
      currentStepState.status === storedStepState.status
    ) {
      return false
    }

    // Check if state transition from stored to current is allowed
    const allowedStatesFromCurrent =
      TransactionCheckpoint.#ALLOWED_STATE_TRANSITIONS[
        currentStepState.state
      ] || []
    const isStateTransitionValid = allowedStatesFromCurrent.includes(
      storedStepState.state
    )

    if (currentStepState.state !== storedStepState.state) {
      return isStateTransitionValid
    }

    // States are the same, check status transition
    // Special case: WAITING status can always be transitioned
    if (currentStepState.status === TransactionStepStatus.WAITING) {
      return true
    }

    // Check if status transition from stored to current is allowed
    const allowedStatusesFromCurrent =
      TransactionCheckpoint.#ALLOWED_STATUS_TRANSITIONS[
        currentStepState.status
      ] || []

    return allowedStatusesFromCurrent.includes(storedStepState.status)
  }

  static #mergeErrors(
    currentErrors: TransactionStepError[],
    incomingErrors: TransactionStepError[]
  ): void {
    const existingErrorSignatures = new Set(
      currentErrors.map(getErrorSignature)
    )

    for (const error of incomingErrors) {
      if (!existingErrorSignatures.has(getErrorSignature(error))) {
        currentErrors.push(error)
        existingErrorSignatures.add(getErrorSignature(error))
      }
    }
  }
}

export class TransactionPayload {
  /**
   * @param metadata - The metadata of the transaction.
   * @param data - The initial payload data to begin a transation.
   * @param context - Object gathering responses of all steps flagged with saveResponse.
   */
  constructor(
    public metadata: TransactionMetadata,
    public data: Record<string, unknown>,
    public context: TransactionContext
  ) {}
}

/**
 * DistributedTransaction represents a distributed transaction, which is a transaction that is composed of multiple steps that are executed in a specific order.
 */

class DistributedTransaction extends EventEmitter {
  public modelId: string
  public transactionId: string
  public runId: string

  private errors: TransactionStepError[] = []
  private context: TransactionContext = new TransactionContext()
  private static keyValueStore: IDistributedTransactionStorage

  /**
   * Store data during the life cycle of the current transaction execution.
   * Store non persistent data such as transformers results, temporary data, etc.
   *
   * @private
   */
  #temporaryStorage = new Map<string, unknown>()

  public static setStorage(storage: IDistributedTransactionStorage) {
    this.keyValueStore = storage
  }

  public static keyPrefix = "dtrx"

  constructor(
    private flow: TransactionFlow,
    public handler: TransactionStepHandler,
    public payload?: any,
    errors?: TransactionStepError[],
    context?: TransactionContext
  ) {
    super()

    this.transactionId = flow.transactionId
    this.modelId = flow.modelId
    this.runId = flow.runId
    if (errors) {
      this.errors = errors
    }

    this.context.payload = payload
    if (context) {
      this.context = { ...context }
    }
  }

  public getFlow() {
    return this.flow
  }

  public getContext() {
    return this.context
  }

  public getErrors(handlerType?: TransactionHandlerType) {
    if (!isDefined(handlerType)) {
      return this.errors
    }

    return this.errors.filter((error) => error.handlerType === handlerType)
  }

  public addError(
    action: string,
    handlerType: TransactionHandlerType,
    error: Error | any
  ) {
    this.errors.push({
      action,
      handlerType,
      error,
    })
  }

  public addResponse(
    action: string,
    handlerType: TransactionHandlerType,
    response: unknown
  ) {
    this.context[handlerType][action] = response
  }

  public hasFinished(): boolean {
    return finishedStatesSet.has(this.getState())
  }

  public getState(): TransactionState {
    return this.getFlow().state
  }

  public get isPartiallyCompleted(): boolean {
    return !!this.getFlow().hasFailedSteps || !!this.getFlow().hasSkippedSteps
  }

  public canInvoke(): boolean {
    return (
      this.getFlow().state === TransactionState.NOT_STARTED ||
      this.getFlow().state === TransactionState.INVOKING
    )
  }

  public canRevert(): boolean {
    return (
      this.getFlow().state === TransactionState.DONE ||
      this.getFlow().state === TransactionState.COMPENSATING
    )
  }

  public hasTimeout(): boolean {
    return !!this.getTimeout()
  }

  public getTimeout(): number | undefined {
    return this.getFlow().options?.timeout
  }

  public async saveCheckpoint({
    ttl = 0,
    parallelSteps = 0,
    stepId,
    _v,
  }: {
    ttl?: number
    parallelSteps?: number
    stepId?: string
    _v?: number
  } = {}): Promise<TransactionCheckpoint | undefined> {
    const options = {
      ...(TransactionOrchestrator.getWorkflowOptions(this.modelId) ??
        this.getFlow().options),
    }

    if (!options?.store) {
      return
    }

    options.stepId = stepId
    if (_v) {
      options.parallelSteps = parallelSteps
      options._v = _v
    }

    const key = TransactionOrchestrator.getKeyName(
      DistributedTransaction.keyPrefix,
      this.modelId,
      this.transactionId
    )

    let checkpoint: TransactionCheckpoint

    let retries = 0
    let backoffMs = 50
    const maxRetries = (options?.parallelSteps || 1) + 2
    while (retries < maxRetries) {
      checkpoint = this.#serializeCheckpointData()

      try {
        const savedCheckpoint = await DistributedTransaction.keyValueStore.save(
          key,
          checkpoint,
          ttl,
          options
        )

        return savedCheckpoint
      } catch (error) {
        if (TransactionOrchestrator.isExpectedError(error)) {
          throw error
        } else if (checkpoint.flow.state === TransactionState.NOT_STARTED) {
          throw new SkipExecutionError(
            "Transaction already started for transactionId: " +
              this.transactionId
          )
        }

        retries++
        // Exponential backoff with jitter
        const jitter = Math.random() * backoffMs

        await setTimeoutPromise(backoffMs + jitter)

        backoffMs = Math.min(backoffMs * 2, 500)

        const lastCheckpoint = await DistributedTransaction.loadTransaction(
          this.modelId,
          this.transactionId
        )

        if (!lastCheckpoint) {
          throw new SkipExecutionError("Transaction already finished")
        }

        /**
         * Merge the stored checkpoint into the live flow, context and errors,
         * mutating them in place.
         *
         * Steps that run concurrently hold a reference to their own
         * TransactionStep instance, taken from the flow at the time they were
         * scheduled. Swapping `this.flow` for a freshly built object graph
         * would detach those references, so any state transition applied to them
         * while this save is being retried would be written to an orphaned object 
         * and silently lost, leaving the transaction stuck.
         */
        TransactionCheckpoint.mergeCheckpoints(
          new TransactionCheckpoint(this.flow, this.context, this.errors),
          lastCheckpoint
        )

        continue
      }
    }

    throw new Error(
      `Max retries (${maxRetries}) exceeded for saving checkpoint due to version conflicts`
    )
  }

  public static async loadTransaction(
    modelId: string,
    transactionId: string,
    options?: { isCancelling?: boolean }
  ): Promise<TransactionCheckpoint | null> {
    const key = TransactionOrchestrator.getKeyName(
      DistributedTransaction.keyPrefix,
      modelId,
      transactionId
    )

    const workflowOptions = TransactionOrchestrator.getWorkflowOptions(modelId)

    const loadedData = await DistributedTransaction.keyValueStore.get(key, {
      ...workflowOptions,
      isCancelling: options?.isCancelling,
    })

    if (loadedData) {
      return loadedData
    }

    return null
  }

  public async scheduleRetry(
    step: TransactionStep,
    interval: number
  ): Promise<void> {
    if (this.hasFinished()) {
      return
    }

    await DistributedTransaction.keyValueStore.scheduleRetry(
      this,
      step,
      Date.now(),
      interval
    )
  }

  public async clearRetry(step: TransactionStep): Promise<void> {
    await DistributedTransaction.keyValueStore.clearRetry(this, step)
  }

  public async scheduleTransactionTimeout(interval: number): Promise<void> {
    // schedule transaction timeout only if there are async steps
    if (!this.getFlow().hasAsyncSteps) {
      return
    }

    await DistributedTransaction.keyValueStore.scheduleTransactionTimeout(
      this,
      Date.now(),
      interval
    )
  }

  public async clearTransactionTimeout(): Promise<void> {
    if (!this.getFlow().hasAsyncSteps) {
      return
    }

    await DistributedTransaction.keyValueStore.clearTransactionTimeout(this)
  }

  public async scheduleStepTimeout(
    step: TransactionStep,
    interval: number
  ): Promise<void> {
    // schedule step timeout only if the step is async
    if (!step.definition.async) {
      return
    }

    await this.saveCheckpoint()
    await DistributedTransaction.keyValueStore.scheduleStepTimeout(
      this,
      step,
      Date.now(),
      interval
    )
  }

  public async clearStepTimeout(step: TransactionStep): Promise<void> {
    if (!step.definition.async || step.isCompensating()) {
      return
    }

    await DistributedTransaction.keyValueStore.clearStepTimeout(this, step)
  }

  public setTemporaryData(key: string, value: unknown) {
    this.#temporaryStorage.set(key, value)
  }

  public getTemporaryData(key: string) {
    return this.#temporaryStorage.get(key)
  }

  public hasTemporaryData(key: string) {
    return this.#temporaryStorage.has(key)
  }

  /**
   * Try to serialize the checkpoint data
   * If it fails, it means that the context or the errors are not serializable
   * and we should handle it
   *
   * @internal
   * @returns
   */
  #serializeCheckpointData() {
    try {
      JSON.stringify(this.context)
    } catch {
      throw new NonSerializableCheckPointError(
        "Unable to serialize context object. Please make sure the workflow input and steps response are serializable."
      )
    }

    let errorsToUse = this.getErrors()
    try {
      JSON.stringify(errorsToUse)
    } catch {
      // Sanitize non-serializable errors
      const sanitizedErrors: TransactionStepError[] = []
      for (const error of this.errors) {
        try {
          JSON.stringify(error)
          sanitizedErrors.push(error)
        } catch {
          sanitizedErrors.push({
            action: error.action,
            handlerType: error.handlerType,
            error: {
              name: error.error?.name || "Error",
              message: error.error?.message || String(error.error),
              stack: error.error?.stack,
            },
          })
        }
      }
      errorsToUse = sanitizedErrors
      this.errors = sanitizedErrors
    }

    return new TransactionCheckpoint(
      JSON.parse(JSON.stringify(this.getFlow())),
      this.getContext(),
      [...errorsToUse]
    )
  }
}

DistributedTransaction.setStorage(
  new BaseInMemoryDistributedTransactionStorage()
)

global.DistributedTransaction ??= DistributedTransaction
const GlobalDistributedTransaction =
  global.DistributedTransaction as typeof DistributedTransaction

export {
  GlobalDistributedTransaction as DistributedTransaction,
  DistributedTransaction as DistributedTransactionType,
}
