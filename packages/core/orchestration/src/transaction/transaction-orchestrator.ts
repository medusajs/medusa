import {
  DistributedTransaction,
  TransactionCheckpoint,
  TransactionPayload,
} from "./distributed-transaction"
import { TransactionStep, TransactionStepHandler } from "./transaction-step"
import {
  DistributedTransactionEvent,
  StepFeatures,
  TransactionHandlerType,
  TransactionModelOptions,
  TransactionOptions,
  TransactionState,
  TransactionStepsDefinition,
  TransactionStepStatus,
} from "./types"

import { MedusaError, promiseAll, TransactionStepState } from "@medusajs/utils"
import { EventEmitter } from "events"
import {
  isErrorLike,
  PermanentStepFailureError,
  serializeError,
  SkipStepResponse,
  TransactionStepTimeoutError,
  TransactionTimeoutError,
} from "./errors"

export type TransactionFlow = {
  modelId: string
  options?: TransactionModelOptions
  definition: TransactionStepsDefinition
  transactionId: string
  metadata?: {
    eventGroupId?: string
    [key: string]: unknown
  }
  hasAsyncSteps: boolean
  hasFailedSteps: boolean
  hasSkippedOnFailureSteps: boolean
  hasWaitingSteps: boolean
  hasSkippedSteps: boolean
  hasRevertedSteps: boolean
  timedOutAt: number | null
  startedAt?: number
  state: TransactionState
  steps: {
    [key: string]: TransactionStep
  }
}

/**
 * @class TransactionOrchestrator is responsible for managing and executing distributed transactions.
 * It is based on a single transaction definition, which is used to execute all the transaction steps
 */
export class TransactionOrchestrator extends EventEmitter {
  private static ROOT_STEP = "_root"
  public static DEFAULT_TTL = 30
  private invokeSteps: string[] = []
  private compensateSteps: string[] = []

  public static DEFAULT_RETRIES = 0

  private static workflowOptions: {
    [modelId: string]: TransactionOptions
  } = {}

  public static getWorkflowOptions(modelId: string): TransactionOptions {
    return this.workflowOptions[modelId]
  }

  constructor(
    public id: string,
    private definition: TransactionStepsDefinition,
    private options?: TransactionModelOptions
  ) {
    super()
    this.parseFlowOptions()
  }

  private static SEPARATOR = ":"
  public static getKeyName(...params: string[]): string {
    return params.join(this.SEPARATOR)
  }

  private getPreviousStep(flow: TransactionFlow, step: TransactionStep) {
    const id = step.id.split(".")
    id.pop()
    const parentId = id.join(".")
    return flow.steps[parentId]
  }

  public getOptions(): TransactionModelOptions {
    return this.options ?? {}
  }

  private getInvokeSteps(flow: TransactionFlow): string[] {
    if (this.invokeSteps.length) {
      return this.invokeSteps
    }

    const steps = Object.keys(flow.steps)

    steps.sort((a, b) => flow.steps[a].depth - flow.steps[b].depth)
    this.invokeSteps = steps

    return steps
  }

  private getCompensationSteps(flow: TransactionFlow): string[] {
    if (this.compensateSteps.length) {
      return this.compensateSteps
    }

    const steps = Object.keys(flow.steps)
    steps.sort(
      (a, b) => (flow.steps[b].depth || 0) - (flow.steps[a].depth || 0)
    )
    this.compensateSteps = steps

    return steps
  }

  private canMoveForward(flow: TransactionFlow, previousStep: TransactionStep) {
    const states = [
      TransactionStepState.DONE,
      TransactionStepState.FAILED,
      TransactionStepState.TIMEOUT,
      TransactionStepState.SKIPPED,
      TransactionStepState.SKIPPED_FAILURE,
    ]

    const siblings = this.getPreviousStep(flow, previousStep).next.map(
      (sib) => flow.steps[sib]
    )

    return (
      !!previousStep.definition.noWait ||
      siblings.every((sib) => states.includes(sib.invoke.state))
    )
  }

  private canMoveBackward(flow: TransactionFlow, step: TransactionStep) {
    const states = [
      TransactionStepState.DONE,
      TransactionStepState.REVERTED,
      TransactionStepState.FAILED,
      TransactionStepState.DORMANT,
    ]
    const siblings = step.next.map((sib) => flow.steps[sib])
    return (
      siblings.length === 0 ||
      siblings.every((sib) => states.includes(sib.compensate.state))
    )
  }

  private canContinue(flow: TransactionFlow, step: TransactionStep): boolean {
    if (flow.state == TransactionState.COMPENSATING) {
      return this.canMoveBackward(flow, step)
    } else {
      const previous = this.getPreviousStep(flow, step)
      if (previous.id === TransactionOrchestrator.ROOT_STEP) {
        return true
      }

      return this.canMoveForward(flow, previous)
    }
  }

  private hasExpired(
    {
      transaction,
      step,
    }: {
      transaction?: DistributedTransaction
      step?: TransactionStep
    },
    dateNow: number
  ): boolean {
    const hasStepTimedOut =
      step &&
      step.hasTimeout() &&
      !step.isCompensating() &&
      dateNow > step.startedAt! + step.getTimeout()! * 1e3

    const hasTransactionTimedOut =
      transaction &&
      transaction.hasTimeout() &&
      transaction.getFlow().state !== TransactionState.COMPENSATING &&
      dateNow >
        transaction.getFlow().startedAt! + transaction.getTimeout()! * 1e3

    return !!hasStepTimedOut || !!hasTransactionTimedOut
  }

  private async checkTransactionTimeout(
    transaction: DistributedTransaction,
    currentSteps: TransactionStep[]
  ) {
    const flow = transaction.getFlow()
    let hasTimedOut = false
    if (!flow.timedOutAt && this.hasExpired({ transaction }, Date.now())) {
      flow.timedOutAt = Date.now()

      void transaction.clearTransactionTimeout()

      for (const step of currentSteps) {
        await TransactionOrchestrator.setStepTimeout(
          transaction,
          step,
          new TransactionTimeoutError()
        )
      }

      await transaction.saveCheckpoint()

      this.emit(DistributedTransactionEvent.TIMEOUT, { transaction })

      hasTimedOut = true
    }

    return hasTimedOut
  }

  private async checkStepTimeout(
    transaction: DistributedTransaction,
    step: TransactionStep
  ) {
    let hasTimedOut = false
    if (
      !step.timedOutAt &&
      step.canCancel() &&
      this.hasExpired({ step }, Date.now())
    ) {
      step.timedOutAt = Date.now()

      await TransactionOrchestrator.setStepTimeout(
        transaction,
        step,
        new TransactionStepTimeoutError()
      )
      hasTimedOut = true

      await transaction.saveCheckpoint()

      this.emit(DistributedTransactionEvent.TIMEOUT, { transaction })
    }
    return hasTimedOut
  }

  private async checkAllSteps(transaction: DistributedTransaction): Promise<{
    current: TransactionStep[]
    next: TransactionStep[]
    total: number
    remaining: number
    completed: number
  }> {
    let hasSkipped = false
    let hasSkippedOnFailure = false
    let hasIgnoredFailure = false
    let hasFailed = false
    let hasWaiting = false
    let hasReverted = false
    let completedSteps = 0

    const flow = transaction.getFlow()

    const nextSteps: TransactionStep[] = []
    const currentSteps: TransactionStep[] = []

    const allSteps =
      flow.state === TransactionState.COMPENSATING
        ? this.getCompensationSteps(flow)
        : this.getInvokeSteps(flow)

    for (const step of allSteps) {
      if (
        step === TransactionOrchestrator.ROOT_STEP ||
        !this.canContinue(flow, flow.steps[step])
      ) {
        continue
      }

      const stepDef = flow.steps[step]
      const curState = stepDef.getStates()

      const hasTimedOut = await this.checkStepTimeout(transaction, stepDef)
      if (hasTimedOut) {
        continue
      }

      if (curState.status === TransactionStepStatus.WAITING) {
        currentSteps.push(stepDef)
        hasWaiting = true

        if (stepDef.hasAwaitingRetry()) {
          if (stepDef.canRetryAwaiting()) {
            stepDef.retryRescheduledAt = null
            nextSteps.push(stepDef)
          } else if (!stepDef.retryRescheduledAt) {
            stepDef.hasScheduledRetry = true
            stepDef.retryRescheduledAt = Date.now()

            await transaction.scheduleRetry(
              stepDef,
              stepDef.definition.retryIntervalAwaiting!
            )
          }
        }

        continue
      } else if (curState.status === TransactionStepStatus.TEMPORARY_FAILURE) {
        currentSteps.push(stepDef)

        if (!stepDef.canRetry()) {
          if (stepDef.hasRetryInterval() && !stepDef.retryRescheduledAt) {
            stepDef.hasScheduledRetry = true
            stepDef.retryRescheduledAt = Date.now()

            await transaction.scheduleRetry(
              stepDef,
              stepDef.definition.retryInterval!
            )
          }
          continue
        }
        stepDef.retryRescheduledAt = null
      }

      if (stepDef.canInvoke(flow.state) || stepDef.canCompensate(flow.state)) {
        nextSteps.push(stepDef)
      } else {
        completedSteps++

        if (curState.state === TransactionStepState.SKIPPED_FAILURE) {
          hasSkippedOnFailure = true
        } else if (curState.state === TransactionStepState.SKIPPED) {
          hasSkipped = true
        } else if (curState.state === TransactionStepState.REVERTED) {
          hasReverted = true
        } else if (curState.state === TransactionStepState.FAILED) {
          if (stepDef.definition.continueOnPermanentFailure) {
            hasIgnoredFailure = true
          } else {
            hasFailed = true
          }
        }
      }
    }

    flow.hasWaitingSteps = hasWaiting
    flow.hasRevertedSteps = hasReverted

    const totalSteps = allSteps.length - 1
    if (
      flow.state === TransactionState.WAITING_TO_COMPENSATE &&
      nextSteps.length === 0 &&
      !hasWaiting
    ) {
      flow.state = TransactionState.COMPENSATING
      this.flagStepsToRevert(flow)

      this.emit(DistributedTransactionEvent.COMPENSATE_BEGIN, { transaction })

      return await this.checkAllSteps(transaction)
    } else if (completedSteps === totalSteps) {
      if (hasSkippedOnFailure) {
        flow.hasSkippedOnFailureSteps = true
      }
      if (hasSkipped) {
        flow.hasSkippedSteps = true
      }
      if (hasIgnoredFailure) {
        flow.hasFailedSteps = true
      }
      if (hasFailed) {
        flow.state = TransactionState.FAILED
      } else {
        flow.state = hasReverted
          ? TransactionState.REVERTED
          : TransactionState.DONE
      }
    }

    return {
      current: currentSteps,
      next: nextSteps,
      total: totalSteps,
      remaining: totalSteps - completedSteps,
      completed: completedSteps,
    }
  }

  private flagStepsToRevert(flow: TransactionFlow): void {
    for (const step in flow.steps) {
      if (step === TransactionOrchestrator.ROOT_STEP) {
        continue
      }

      const stepDef = flow.steps[step]
      const curState = stepDef.getStates()
      if (
        [TransactionStepState.DONE, TransactionStepState.TIMEOUT].includes(
          curState.state
        ) ||
        curState.status === TransactionStepStatus.PERMANENT_FAILURE
      ) {
        stepDef.beginCompensation()
        stepDef.changeState(TransactionStepState.NOT_STARTED)
      }
    }
  }

  private static async setStepSuccess(
    transaction: DistributedTransaction,
    step: TransactionStep,
    response: unknown
  ): Promise<void> {
    const hasStepTimedOut =
      step.getStates().state === TransactionStepState.TIMEOUT

    if (step.saveResponse) {
      transaction.addResponse(
        step.definition.action!,
        step.isCompensating()
          ? TransactionHandlerType.COMPENSATE
          : TransactionHandlerType.INVOKE,
        response
      )
    }

    const flow = transaction.getFlow()
    const options = TransactionOrchestrator.getWorkflowOptions(flow.modelId)

    if (!hasStepTimedOut) {
      step.changeStatus(TransactionStepStatus.OK)
    }

    if (step.isCompensating()) {
      step.changeState(TransactionStepState.REVERTED)
    } else if (!hasStepTimedOut) {
      step.changeState(TransactionStepState.DONE)
    }

    if (step.definition.async || options?.storeExecution) {
      await transaction.saveCheckpoint()
    }

    const cleaningUp: Promise<unknown>[] = []
    if (step.hasRetryScheduled()) {
      cleaningUp.push(transaction.clearRetry(step))
    }
    if (step.hasTimeout()) {
      cleaningUp.push(transaction.clearStepTimeout(step))
    }

    await promiseAll(cleaningUp)

    const eventName = step.isCompensating()
      ? DistributedTransactionEvent.COMPENSATE_STEP_SUCCESS
      : DistributedTransactionEvent.STEP_SUCCESS
    transaction.emit(eventName, { step, transaction })
  }

  private static async skipStep(
    transaction: DistributedTransaction,
    step: TransactionStep
  ): Promise<void> {
    const hasStepTimedOut =
      step.getStates().state === TransactionStepState.TIMEOUT

    const flow = transaction.getFlow()
    const options = TransactionOrchestrator.getWorkflowOptions(flow.modelId)

    if (!hasStepTimedOut) {
      step.changeStatus(TransactionStepStatus.OK)
      step.changeState(TransactionStepState.SKIPPED)
    }

    if (step.definition.async || options?.storeExecution) {
      await transaction.saveCheckpoint()
    }

    const cleaningUp: Promise<unknown>[] = []
    if (step.hasRetryScheduled()) {
      cleaningUp.push(transaction.clearRetry(step))
    }
    if (step.hasTimeout()) {
      cleaningUp.push(transaction.clearStepTimeout(step))
    }

    await promiseAll(cleaningUp)

    const eventName = DistributedTransactionEvent.STEP_SKIPPED
    transaction.emit(eventName, { step, transaction })
  }

  private static async setStepTimeout(
    transaction: DistributedTransaction,
    step: TransactionStep,
    error: TransactionStepTimeoutError | TransactionTimeoutError
  ): Promise<void> {
    if (
      [
        TransactionStepState.TIMEOUT,
        TransactionStepState.DONE,
        TransactionStepState.REVERTED,
      ].includes(step.getStates().state)
    ) {
      return
    }

    step.changeState(TransactionStepState.TIMEOUT)

    transaction.addError(
      step.definition.action!,
      TransactionHandlerType.INVOKE,
      error
    )

    await TransactionOrchestrator.setStepFailure(
      transaction,
      step,
      undefined,
      0,
      true,
      error
    )

    await transaction.clearStepTimeout(step)
  }

  private static async setStepFailure(
    transaction: DistributedTransaction,
    step: TransactionStep,
    error: Error | any,
    maxRetries: number = TransactionOrchestrator.DEFAULT_RETRIES,
    isTimeout = false,
    timeoutError?: TransactionStepTimeoutError | TransactionTimeoutError
  ): Promise<void> {
    step.failures++

    if (isErrorLike(error)) {
      error = serializeError(error)
    }

    if (
      !isTimeout &&
      step.getStates().status !== TransactionStepStatus.PERMANENT_FAILURE
    ) {
      step.changeStatus(TransactionStepStatus.TEMPORARY_FAILURE)
    }

    const flow = transaction.getFlow()
    const options = TransactionOrchestrator.getWorkflowOptions(flow.modelId)

    const cleaningUp: Promise<unknown>[] = []

    const hasTimedOut = step.getStates().state === TransactionStepState.TIMEOUT
    if (step.failures > maxRetries || hasTimedOut) {
      if (!hasTimedOut) {
        step.changeState(TransactionStepState.FAILED)
      }

      step.changeStatus(TransactionStepStatus.PERMANENT_FAILURE)

      if (!isTimeout) {
        transaction.addError(
          step.definition.action!,
          step.isCompensating()
            ? TransactionHandlerType.COMPENSATE
            : TransactionHandlerType.INVOKE,
          error
        )
      }

      if (!step.isCompensating()) {
        if (
          step.definition.continueOnPermanentFailure &&
          !TransactionTimeoutError.isTransactionTimeoutError(timeoutError!)
        ) {
          for (const childStep of step.next) {
            const child = flow.steps[childStep]
            child.changeState(TransactionStepState.SKIPPED_FAILURE)
          }
        } else {
          flow.state = TransactionState.WAITING_TO_COMPENSATE
        }
      }

      if (step.hasTimeout()) {
        cleaningUp.push(transaction.clearStepTimeout(step))
      }
    }

    if (step.definition.async || options?.storeExecution) {
      await transaction.saveCheckpoint()
    }

    if (step.hasRetryScheduled()) {
      cleaningUp.push(transaction.clearRetry(step))
    }

    await promiseAll(cleaningUp)

    const eventName = step.isCompensating()
      ? DistributedTransactionEvent.COMPENSATE_STEP_FAILURE
      : DistributedTransactionEvent.STEP_FAILURE
    transaction.emit(eventName, { step, transaction })
  }

  private async executeNext(
    transaction: DistributedTransaction
  ): Promise<void> {
    let continueExecution = true

    while (continueExecution) {
      if (transaction.hasFinished()) {
        return
      }

      const flow = transaction.getFlow()
      const options = TransactionOrchestrator.getWorkflowOptions(flow.modelId)
      const nextSteps = await this.checkAllSteps(transaction)
      const execution: Promise<void | unknown>[] = []

      const hasTimedOut = await this.checkTransactionTimeout(
        transaction,
        nextSteps.current
      )

      if (hasTimedOut) {
        continue
      }

      if (nextSteps.remaining === 0) {
        if (transaction.hasTimeout()) {
          void transaction.clearTransactionTimeout()
        }

        await transaction.saveCheckpoint()

        this.emit(DistributedTransactionEvent.FINISH, { transaction })
      }

      let hasSyncSteps = false
      for (const step of nextSteps.next) {
        const curState = step.getStates()
        const type = step.isCompensating()
          ? TransactionHandlerType.COMPENSATE
          : TransactionHandlerType.INVOKE

        step.lastAttempt = Date.now()
        step.attempts++

        if (curState.state === TransactionStepState.NOT_STARTED) {
          if (!step.startedAt) {
            step.startedAt = Date.now()
          }

          if (step.isCompensating()) {
            step.changeState(TransactionStepState.COMPENSATING)

            if (step.definition.noCompensation) {
              step.changeState(TransactionStepState.REVERTED)
              continue
            }
          } else if (flow.state === TransactionState.INVOKING) {
            step.changeState(TransactionStepState.INVOKING)
          }
        }

        step.changeStatus(TransactionStepStatus.WAITING)

        const payload = new TransactionPayload(
          {
            model_id: flow.modelId,
            idempotency_key: TransactionOrchestrator.getKeyName(
              flow.modelId,
              flow.transactionId,
              step.definition.action!,
              type
            ),
            action: step.definition.action + "",
            action_type: type,
            attempt: step.attempts,
            timestamp: Date.now(),
          },
          transaction.payload,
          transaction.getContext()
        )

        if (step.hasTimeout() && !step.timedOutAt && step.attempts === 1) {
          await transaction.scheduleStepTimeout(step, step.definition.timeout!)
        }

        transaction.emit(DistributedTransactionEvent.STEP_BEGIN, {
          step,
          transaction,
        })

        const isAsync = step.isCompensating()
          ? step.definition.compensateAsync
          : step.definition.async

        const setStepFailure = async (
          error: Error | any,
          { endRetry }: { endRetry?: boolean } = {}
        ) => {
          await TransactionOrchestrator.setStepFailure(
            transaction,
            step,
            error,
            endRetry ? 0 : step.definition.maxRetries
          )

          if (isAsync) {
            await transaction.scheduleRetry(
              step,
              step.definition.retryInterval ?? 0
            )
          }
        }

        if (!isAsync) {
          hasSyncSteps = true
          execution.push(
            transaction
              .handler(
                step.definition.action + "",
                type,
                payload,
                transaction,
                step,
                this
              )
              .then(async (response: any) => {
                if (this.hasExpired({ transaction, step }, Date.now())) {
                  await this.checkStepTimeout(transaction, step)
                  await this.checkTransactionTimeout(
                    transaction,
                    nextSteps.next.includes(step) ? nextSteps.next : [step]
                  )
                }

                if (SkipStepResponse.isSkipStepResponse(response?.output)) {
                  await TransactionOrchestrator.skipStep(transaction, step)
                  return
                }

                await TransactionOrchestrator.setStepSuccess(
                  transaction,
                  step,
                  response
                )
              })
              .catch(async (error) => {
                if (this.hasExpired({ transaction, step }, Date.now())) {
                  await this.checkStepTimeout(transaction, step)
                  await this.checkTransactionTimeout(
                    transaction,
                    nextSteps.next.includes(step) ? nextSteps.next : [step]
                  )
                }

                if (
                  PermanentStepFailureError.isPermanentStepFailureError(error)
                ) {
                  await setStepFailure(error, { endRetry: true })
                  return
                }

                await setStepFailure(error)
              })
          )
        } else {
          execution.push(
            transaction.saveCheckpoint().then(() => {
              transaction
                .handler(
                  step.definition.action + "",
                  type,
                  payload,
                  transaction,
                  step,
                  this
                )
                .then(async (response: any) => {
                  if (!step.definition.backgroundExecution) {
                    const eventName = DistributedTransactionEvent.STEP_AWAITING
                    transaction.emit(eventName, { step, transaction })

                    return
                  }

                  if (this.hasExpired({ transaction, step }, Date.now())) {
                    await this.checkStepTimeout(transaction, step)
                    await this.checkTransactionTimeout(
                      transaction,
                      nextSteps.next.includes(step) ? nextSteps.next : [step]
                    )
                  }

                  if (SkipStepResponse.isSkipStepResponse(response)) {
                    await TransactionOrchestrator.skipStep(transaction, step)
                    return
                  }

                  await TransactionOrchestrator.setStepSuccess(
                    transaction,
                    step,
                    response
                  )

                  await transaction.scheduleRetry(
                    step,
                    step.definition.retryInterval ?? 0
                  )
                })
                .catch(async (error) => {
                  if (
                    PermanentStepFailureError.isPermanentStepFailureError(error)
                  ) {
                    await setStepFailure(error, { endRetry: true })
                    return
                  }

                  await setStepFailure(error)
                })
            })
          )
        }
      }

      if (hasSyncSteps && options?.storeExecution) {
        await transaction.saveCheckpoint()
      }

      await promiseAll(execution)

      if (nextSteps.next.length === 0) {
        continueExecution = false
      }
    }
  }

  /**
   * Start a new transaction or resume a transaction that has been previously started
   * @param transaction - The transaction to resume
   */
  public async resume(transaction: DistributedTransaction): Promise<void> {
    if (transaction.modelId !== this.id) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        `TransactionModel "${transaction.modelId}" cannot be orchestrated by "${this.id}" model.`
      )
    }

    if (transaction.hasFinished()) {
      return
    }

    const flow = transaction.getFlow()

    if (flow.state === TransactionState.NOT_STARTED) {
      flow.state = TransactionState.INVOKING
      flow.startedAt = Date.now()

      if (this.getOptions().store) {
        await transaction.saveCheckpoint(
          flow.hasAsyncSteps ? 0 : TransactionOrchestrator.DEFAULT_TTL
        )
      }

      if (transaction.hasTimeout()) {
        await transaction.scheduleTransactionTimeout(transaction.getTimeout()!)
      }

      this.emit(DistributedTransactionEvent.BEGIN, { transaction })
    } else {
      this.emit(DistributedTransactionEvent.RESUME, { transaction })
    }

    await this.executeNext(transaction)
  }

  /**
   * Cancel and revert a transaction compensating all its executed steps. It can be an ongoing transaction or a completed one
   * @param transaction - The transaction to be reverted
   */
  public async cancelTransaction(
    transaction: DistributedTransaction
  ): Promise<void> {
    if (transaction.modelId !== this.id) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        `TransactionModel "${transaction.modelId}" cannot be orchestrated by "${this.id}" model.`
      )
    }

    const flow = transaction.getFlow()
    if (flow.state === TransactionState.FAILED) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        `Cannot revert a permanent failed transaction.`
      )
    }

    flow.state = TransactionState.WAITING_TO_COMPENSATE

    await this.executeNext(transaction)
  }

  private parseFlowOptions() {
    const [steps, features] = TransactionOrchestrator.buildSteps(
      this.definition
    )

    this.options ??= {}

    const hasAsyncSteps = features.hasAsyncSteps
    const hasStepTimeouts = features.hasStepTimeouts
    const hasRetriesTimeout = features.hasRetriesTimeout
    const hasTransactionTimeout = !!this.options.timeout
    const isIdempotent = !!this.options.idempotent

    if (hasAsyncSteps) {
      this.options.store = true
    }

    if (
      hasStepTimeouts ||
      hasRetriesTimeout ||
      hasTransactionTimeout ||
      isIdempotent
    ) {
      this.options.store = true
      this.options.storeExecution = true
    }

    const parsedOptions = {
      ...this.options,
      hasAsyncSteps,
      hasStepTimeouts,
      hasRetriesTimeout,
    }
    TransactionOrchestrator.workflowOptions[this.id] = parsedOptions

    return [steps, features]
  }

  private createTransactionFlow(
    transactionId: string,
    flowMetadata?: TransactionFlow["metadata"]
  ): TransactionFlow {
    const [steps, features] = TransactionOrchestrator.buildSteps(
      this.definition
    )

    const flow: TransactionFlow = {
      modelId: this.id,
      options: this.options,
      transactionId: transactionId,
      metadata: flowMetadata,
      hasAsyncSteps: features.hasAsyncSteps,
      hasFailedSteps: false,
      hasSkippedOnFailureSteps: false,
      hasSkippedSteps: false,
      hasWaitingSteps: false,
      hasRevertedSteps: false,
      timedOutAt: null,
      state: TransactionState.NOT_STARTED,
      definition: this.definition,
      steps,
    }

    return flow
  }

  private static async loadTransactionById(
    modelId: string,
    transactionId: string
  ): Promise<TransactionCheckpoint | null> {
    const transaction = await DistributedTransaction.loadTransaction(
      modelId,
      transactionId
    )

    if (transaction !== null) {
      const flow = transaction.flow
      const [steps] = TransactionOrchestrator.buildSteps(
        flow.definition,
        flow.steps
      )

      transaction.flow.steps = steps
      return transaction
    }

    return null
  }

  private static buildSteps(
    flow: TransactionStepsDefinition,
    existingSteps?: { [key: string]: TransactionStep }
  ): [{ [key: string]: TransactionStep }, StepFeatures] {
    const states: { [key: string]: TransactionStep } = {
      [TransactionOrchestrator.ROOT_STEP]: {
        id: TransactionOrchestrator.ROOT_STEP,
        next: [] as string[],
      } as TransactionStep,
    }

    const actionNames = new Set<string>()
    const queue: any[] = [
      { obj: flow, level: [TransactionOrchestrator.ROOT_STEP] },
    ]

    const features = {
      hasAsyncSteps: false,
      hasStepTimeouts: false,
      hasRetriesTimeout: false,
    }

    while (queue.length > 0) {
      const { obj, level } = queue.shift()

      for (const key of Object.keys(obj)) {
        if (typeof obj[key] === "object" && obj[key] !== null) {
          queue.push({ obj: obj[key], level: [...level] })
        } else if (key === "action") {
          if (actionNames.has(obj.action)) {
            throw new Error(`Action "${obj.action}" is already defined.`)
          }

          actionNames.add(obj.action)
          level.push(obj.action)
          const id = level.join(".")
          const parent = level.slice(0, level.length - 1).join(".")

          if (!existingSteps || parent === TransactionOrchestrator.ROOT_STEP) {
            states[parent].next?.push(id)
          }

          const definitionCopy = { ...obj }
          delete definitionCopy.next

          if (definitionCopy.async) {
            features.hasAsyncSteps = true
          }

          if (definitionCopy.timeout) {
            features.hasStepTimeouts = true
          }

          if (
            definitionCopy.retryInterval ||
            definitionCopy.retryIntervalAwaiting
          ) {
            features.hasRetriesTimeout = true
          }

          states[id] = Object.assign(
            new TransactionStep(),
            existingSteps?.[id] || {
              id,
              uuid: definitionCopy.uuid,
              depth: level.length - 1,
              definition: definitionCopy,
              saveResponse: definitionCopy.saveResponse ?? true,
              invoke: {
                state: TransactionStepState.NOT_STARTED,
                status: TransactionStepStatus.IDLE,
              },
              compensate: {
                state: TransactionStepState.DORMANT,
                status: TransactionStepStatus.IDLE,
              },
              attempts: 0,
              failures: 0,
              lastAttempt: null,
              next: [],
            }
          )
        }
      }
    }

    return [states, features]
  }

  /** Create a new transaction
   * @param transactionId - unique identifier of the transaction
   * @param handler - function to handle action of the transaction
   * @param payload - payload to be passed to all the transaction steps
   * @param flowMetadata - flow metadata which can include event group id for example
   */
  public async beginTransaction(
    transactionId: string,
    handler: TransactionStepHandler,
    payload?: unknown,
    flowMetadata?: TransactionFlow["metadata"]
  ): Promise<DistributedTransaction> {
    const existingTransaction =
      await TransactionOrchestrator.loadTransactionById(this.id, transactionId)

    let newTransaction = false
    let modelFlow: TransactionFlow
    if (!existingTransaction) {
      modelFlow = this.createTransactionFlow(transactionId, flowMetadata)
      newTransaction = true
    } else {
      modelFlow = existingTransaction.flow
    }

    const transaction = new DistributedTransaction(
      modelFlow,
      handler,
      payload,
      existingTransaction?.errors,
      existingTransaction?.context
    )

    if (
      newTransaction &&
      this.getOptions().store &&
      this.getOptions().storeExecution
    ) {
      await transaction.saveCheckpoint(
        modelFlow.hasAsyncSteps ? 0 : TransactionOrchestrator.DEFAULT_TTL
      )
    }

    return transaction
  }

  /** Returns an existing transaction
   * @param transactionId - unique identifier of the transaction
   * @param handler - function to handle action of the transaction
   */
  public async retrieveExistingTransaction(
    transactionId: string,
    handler: TransactionStepHandler
  ): Promise<DistributedTransaction> {
    const existingTransaction =
      await TransactionOrchestrator.loadTransactionById(this.id, transactionId)

    if (!existingTransaction) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Transaction ${transactionId} could not be found.`
      )
    }

    const transaction = new DistributedTransaction(
      existingTransaction.flow,
      handler,
      undefined,
      existingTransaction?.errors,
      existingTransaction?.context
    )

    return transaction
  }

  private static getStepByAction(
    flow: TransactionFlow,
    action: string
  ): TransactionStep | null {
    for (const key in flow.steps) {
      if (action === flow.steps[key]?.definition?.action) {
        return flow.steps[key]
      }
    }
    return null
  }

  private static async getTransactionAndStepFromIdempotencyKey(
    responseIdempotencyKey: string,
    handler?: TransactionStepHandler,
    transaction?: DistributedTransaction
  ): Promise<[DistributedTransaction, TransactionStep]> {
    const [modelId, transactionId, action, actionType] =
      responseIdempotencyKey.split(TransactionOrchestrator.SEPARATOR)

    if (!transaction && !handler) {
      throw new Error(
        "If a transaction is not provided, the handler is required"
      )
    }

    if (!transaction) {
      const existingTransaction =
        await TransactionOrchestrator.loadTransactionById(
          modelId,
          transactionId
        )

      if (existingTransaction === null) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `Transaction ${transactionId} could not be found.`
        )
      }

      transaction = new DistributedTransaction(
        existingTransaction.flow,
        handler!,
        undefined,
        existingTransaction.errors,
        existingTransaction.context
      )
    }

    const step = TransactionOrchestrator.getStepByAction(
      transaction.getFlow(),
      action
    )

    if (step === null) {
      throw new Error("Action not found.")
    } else if (
      step.isCompensating()
        ? actionType !== TransactionHandlerType.COMPENSATE
        : actionType !== TransactionHandlerType.INVOKE
    ) {
      throw new Error("Incorrect action type.")
    }
    return [transaction, step]
  }

  /** Skip the execution of a specific transaction and step
   * @param responseIdempotencyKey - The idempotency key for the step
   * @param handler - The handler function to execute the step
   * @param transaction - The current transaction. If not provided it will be loaded based on the responseIdempotencyKey
   */
  public async skipStep(
    responseIdempotencyKey: string,
    handler?: TransactionStepHandler,
    transaction?: DistributedTransaction
  ): Promise<DistributedTransaction> {
    const [curTransaction, step] =
      await TransactionOrchestrator.getTransactionAndStepFromIdempotencyKey(
        responseIdempotencyKey,
        handler,
        transaction
      )

    if (step.getStates().status === TransactionStepStatus.WAITING) {
      this.emit(DistributedTransactionEvent.RESUME, {
        transaction: curTransaction,
      })

      await TransactionOrchestrator.skipStep(curTransaction, step)

      await this.executeNext(curTransaction)
    } else {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        `Cannot skip a step when status is ${step.getStates().status}`
      )
    }

    return curTransaction
  }

  /** Register a step success for a specific transaction and step
   * @param responseIdempotencyKey - The idempotency key for the step
   * @param handler - The handler function to execute the step
   * @param transaction - The current transaction. If not provided it will be loaded based on the responseIdempotencyKey
   * @param response - The response of the step
   */
  public async registerStepSuccess(
    responseIdempotencyKey: string,
    handler?: TransactionStepHandler,
    transaction?: DistributedTransaction,
    response?: unknown
  ): Promise<DistributedTransaction> {
    const [curTransaction, step] =
      await TransactionOrchestrator.getTransactionAndStepFromIdempotencyKey(
        responseIdempotencyKey,
        handler,
        transaction
      )

    if (step.getStates().status === TransactionStepStatus.WAITING) {
      this.emit(DistributedTransactionEvent.RESUME, {
        transaction: curTransaction,
      })

      await TransactionOrchestrator.setStepSuccess(
        curTransaction,
        step,
        response
      )

      await this.executeNext(curTransaction)
    } else {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        `Cannot set step success when status is ${step.getStates().status}`
      )
    }

    return curTransaction
  }

  /**
   * Register a step failure for a specific transaction and step
   * @param responseIdempotencyKey - The idempotency key for the step
   * @param error - The error that caused the failure
   * @param handler - The handler function to execute the step
   * @param transaction - The current transaction
   * @param response - The response of the step
   */
  public async registerStepFailure(
    responseIdempotencyKey: string,
    error?: Error | any,
    handler?: TransactionStepHandler,
    transaction?: DistributedTransaction
  ): Promise<DistributedTransaction> {
    const [curTransaction, step] =
      await TransactionOrchestrator.getTransactionAndStepFromIdempotencyKey(
        responseIdempotencyKey,
        handler,
        transaction
      )

    if (step.getStates().status === TransactionStepStatus.WAITING) {
      this.emit(DistributedTransactionEvent.RESUME, {
        transaction: curTransaction,
      })

      await TransactionOrchestrator.setStepFailure(
        curTransaction,
        step,
        error,
        0
      )

      await this.executeNext(curTransaction)
    } else {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        `Cannot set step failure when status is ${step.getStates().status}`
      )
    }

    return curTransaction
  }
}
