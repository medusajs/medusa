import { ulid } from "ulid"
import {
  DistributedTransaction,
  DistributedTransactionType,
  TransactionCheckpoint,
  TransactionPayload,
} from "./distributed-transaction"
import { TransactionStep, TransactionStepHandler } from "./transaction-step"
import {
  DistributedTransactionEvent,
  StepFeatures,
  TransactionFlow,
  TransactionHandlerType,
  TransactionModelOptions,
  TransactionOptions,
  TransactionState,
  TransactionStepsDefinition,
  TransactionStepStatus,
} from "./types"

import { Context } from "@medusajs/types"
import {
  isDefined,
  isErrorLike,
  isObject,
  isString,
  MedusaError,
  promiseAll,
  serializeError,
  TransactionStepState,
} from "@medusajs/utils"
import { EventEmitter } from "events"
import {
  PermanentStepFailureError,
  SkipCancelledExecutionError,
  SkipExecutionError,
  SkipStepAlreadyFinishedError,
  SkipStepResponse,
  TransactionStepTimeoutError,
  TransactionTimeoutError,
} from "./errors"

const canMoveForwardStates = new Set([
  TransactionStepState.DONE,
  TransactionStepState.FAILED,
  TransactionStepState.TIMEOUT,
  TransactionStepState.SKIPPED,
  TransactionStepState.SKIPPED_FAILURE,
])

const canMoveBackwardStates = new Set([
  TransactionStepState.DONE,
  TransactionStepState.REVERTED,
  TransactionStepState.FAILED,
  TransactionStepState.DORMANT,
  TransactionStepState.SKIPPED,
])

const flagStepsToRevertStates = new Set([
  TransactionStepState.DONE,
  TransactionStepState.TIMEOUT,
])

const setStepTimeoutSkipStates = new Set([
  TransactionStepState.TIMEOUT,
  TransactionStepState.DONE,
  TransactionStepState.REVERTED,
])

/**
 * @class TransactionOrchestrator is responsible for managing and executing distributed transactions.
 * It is based on a single transaction definition, which is used to execute all the transaction steps
 */
export class TransactionOrchestrator extends EventEmitter {
  id: string

  private static ROOT_STEP = "_root"
  public static DEFAULT_TTL = 30
  private invokeSteps: string[] = []
  private compensateSteps: string[] = []
  private definition: TransactionStepsDefinition
  private options?: TransactionModelOptions

  public static DEFAULT_RETRIES = 0

  private static workflowOptions: {
    [modelId: string]: TransactionOptions
  } = {}

  public static getWorkflowOptions(modelId: string): TransactionOptions {
    return TransactionOrchestrator.workflowOptions[modelId]
  }

  /**
   * Trace workflow transaction for instrumentation
   */
  static traceTransaction?: (
    transactionResume: (...args: any[]) => Promise<void>,
    metadata: {
      model_id: string
      transaction_id: string
      flow_metadata: TransactionFlow["metadata"]
    }
  ) => Promise<any>

  /**
   * Trace workflow steps for instrumentation
   */
  static traceStep?: (
    handler: (...args: any[]) => Promise<any>,
    metadata: {
      action: string
      type: "invoke" | "compensate"
      step_id: string
      step_uuid: string
      attempts: number
      failures: number
      async: boolean
      idempotency_key: string
    }
  ) => Promise<any>

  constructor({
    id,
    definition,
    options,
    isClone,
  }: {
    id: string
    definition: TransactionStepsDefinition
    options?: TransactionModelOptions
    isClone?: boolean
  }) {
    super()

    this.id = id
    this.definition = definition
    this.options = options

    if (!isClone) {
      this.parseFlowOptions()
    }
  }

  public static isExpectedError(error: Error): boolean {
    return (
      SkipCancelledExecutionError.isSkipCancelledExecutionError(error) ||
      SkipExecutionError.isSkipExecutionError(error) ||
      SkipStepAlreadyFinishedError.isSkipStepAlreadyFinishedError(error)
    )
  }

  static clone(orchestrator: TransactionOrchestrator): TransactionOrchestrator {
    return new TransactionOrchestrator({
      id: orchestrator.id,
      definition: orchestrator.definition,
      options: orchestrator.options,
      isClone: true,
    })
  }

  private static SEPARATOR = ":"
  public static getKeyName(...params: string[]): string {
    return params.join(this.SEPARATOR)
  }

  private static getPreviousStep(flow: TransactionFlow, step: TransactionStep) {
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

  private static countSiblings(
    flow: TransactionFlow,
    step: TransactionStep
  ): number {
    const previous = TransactionOrchestrator.getPreviousStep(flow, step)
    return previous.next.length
  }

  private canMoveForward(flow: TransactionFlow, previousStep: TransactionStep) {
    const siblings = TransactionOrchestrator.getPreviousStep(
      flow,
      previousStep
    ).next.map((sib) => flow.steps[sib])

    return (
      !!previousStep.definition.noWait ||
      siblings.every((sib) => canMoveForwardStates.has(sib.invoke.state))
    )
  }

  private canMoveBackward(flow: TransactionFlow, step: TransactionStep) {
    const siblings = step.next.map((sib) => flow.steps[sib])
    return (
      siblings.length === 0 ||
      siblings.every((sib) => canMoveBackwardStates.has(sib.compensate.state))
    )
  }

  private canContinue(flow: TransactionFlow, step: TransactionStep): boolean {
    if (flow.state == TransactionState.COMPENSATING) {
      return this.canMoveBackward(flow, step)
    } else {
      const previous = TransactionOrchestrator.getPreviousStep(flow, step)
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
      transaction?: DistributedTransactionType
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
    transaction: DistributedTransactionType,
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

      this.emit(DistributedTransactionEvent.TIMEOUT, { transaction })

      hasTimedOut = true
    }

    return hasTimedOut
  }

  private async checkStepTimeout(
    transaction: DistributedTransactionType,
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

      this.emit(DistributedTransactionEvent.TIMEOUT, { transaction })
    }
    return hasTimedOut
  }

  private async checkAllSteps(
    transaction: DistributedTransactionType
  ): Promise<{
    current: TransactionStep[]
    next: TransactionStep[]
    total: number
    remaining: number
    completed: number
  }> {
    const flow = transaction.getFlow()

    const result = await this.computeCurrentTransactionState(transaction)

    // Handle state transitions and emit events
    if (
      flow.state === TransactionState.WAITING_TO_COMPENSATE &&
      result.next.length === 0 &&
      !flow.hasWaitingSteps
    ) {
      flow.state = TransactionState.COMPENSATING
      this.flagStepsToRevert(flow)

      this.emit(DistributedTransactionEvent.COMPENSATE_BEGIN, { transaction })

      const result = await this.checkAllSteps(transaction)

      return result
    } else if (result.completed === result.total) {
      if (result.hasSkippedOnFailure) {
        flow.hasSkippedOnFailureSteps = true
      }
      if (result.hasSkipped) {
        flow.hasSkippedSteps = true
      }
      if (result.hasIgnoredFailure) {
        flow.hasFailedSteps = true
      }
      if (result.hasFailed) {
        flow.state = TransactionState.FAILED
      } else {
        flow.state = result.hasReverted
          ? TransactionState.REVERTED
          : TransactionState.DONE
      }
    }

    return {
      current: result.current,
      next: result.next,
      total: result.total,
      remaining: result.total - result.completed,
      completed: result.completed,
    }
  }

  private async computeCurrentTransactionState(
    transaction: DistributedTransactionType
  ): Promise<{
    current: TransactionStep[]
    next: TransactionStep[]
    total: number
    completed: number
    hasSkipped: boolean
    hasSkippedOnFailure: boolean
    hasIgnoredFailure: boolean
    hasFailed: boolean
    hasWaiting: boolean
    hasReverted: boolean
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
        } else if (stepDef.retryRescheduledAt) {
          // The step is not configured for awaiting retry but is manually force to retry
          stepDef.retryRescheduledAt = null
          nextSteps.push(stepDef)
        }

        continue
      } else if (curState.status === TransactionStepStatus.TEMPORARY_FAILURE) {
        if (
          !stepDef.temporaryFailedAt &&
          stepDef.definition.autoRetry === false
        ) {
          stepDef.temporaryFailedAt = Date.now()
          continue
        }

        stepDef.temporaryFailedAt = null

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
        } else if (
          curState.state === TransactionStepState.FAILED ||
          curState.state === TransactionStepState.TIMEOUT
        ) {
          if (
            stepDef.definition.continueOnPermanentFailure ||
            stepDef.definition.skipOnPermanentFailure
          ) {
            hasIgnoredFailure = true
          } else {
            hasFailed = true
          }
        }
      }
    }

    flow.hasWaitingSteps = hasWaiting
    flow.hasRevertedSteps = hasReverted

    return {
      current: currentSteps,
      next: nextSteps,
      total: allSteps.length - 1,
      completed: completedSteps,
      hasSkipped,
      hasSkippedOnFailure,
      hasIgnoredFailure,
      hasFailed,
      hasWaiting,
      hasReverted,
    }
  }

  private flagStepsToRevert(flow: TransactionFlow): void {
    for (const step in flow.steps) {
      if (step === TransactionOrchestrator.ROOT_STEP) {
        continue
      }

      const stepDef = flow.steps[step]
      const curState = stepDef.getStates()

      if (stepDef._v) {
        flow._v = 0
        stepDef._v = 0
      }

      if (
        flagStepsToRevertStates.has(curState.state) ||
        curState.status === TransactionStepStatus.PERMANENT_FAILURE
      ) {
        stepDef.beginCompensation()
        stepDef.changeState(TransactionStepState.NOT_STARTED)
      }
    }
  }

  private static async setStepSuccess(
    transaction: DistributedTransactionType,
    step: TransactionStep,
    response: unknown
  ): Promise<{
    stopExecution: boolean
    transactionIsCancelling?: boolean
  }> {
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

    if (!hasStepTimedOut) {
      step.changeStatus(TransactionStepStatus.OK)
    }

    if (step.isCompensating()) {
      step.changeState(TransactionStepState.REVERTED)
    } else if (!hasStepTimedOut) {
      step.changeState(TransactionStepState.DONE)
    }

    let shouldEmit = true
    let transactionIsCancelling = false
    try {
      await transaction.saveCheckpoint({
        _v: step._v,
        parallelSteps: TransactionOrchestrator.countSiblings(
          transaction.getFlow(),
          step
        ),
        stepId: step.id,
      })
    } catch (error) {
      if (!TransactionOrchestrator.isExpectedError(error)) {
        throw error
      }

      transactionIsCancelling =
        SkipCancelledExecutionError.isSkipCancelledExecutionError(error)
      shouldEmit = !SkipExecutionError.isSkipExecutionError(error)
    }

    const cleaningUp: Promise<unknown>[] = []
    if (step.hasRetryScheduled()) {
      cleaningUp.push(transaction.clearRetry(step))
    }
    if (step.hasTimeout()) {
      cleaningUp.push(transaction.clearStepTimeout(step))
    }

    if (cleaningUp.length) {
      await promiseAll(cleaningUp)
    }

    if (shouldEmit) {
      const eventName = step.isCompensating()
        ? DistributedTransactionEvent.COMPENSATE_STEP_SUCCESS
        : DistributedTransactionEvent.STEP_SUCCESS
      transaction.emit(eventName, { step, transaction })
    }

    return {
      stopExecution: !shouldEmit,
      transactionIsCancelling,
    }
  }

  private static async retryStep(
    transaction: DistributedTransactionType,
    step: TransactionStep
  ): Promise<void> {
    if (!step.retryRescheduledAt) {
      step.hasScheduledRetry = true
      step.retryRescheduledAt = Date.now()
    }

    transaction.getFlow().hasWaitingSteps = true

    try {
      await transaction.saveCheckpoint({
        _v: step._v,
        parallelSteps: TransactionOrchestrator.countSiblings(
          transaction.getFlow(),
          step
        ),
        stepId: step.id,
      })
      await transaction.scheduleRetry(step, 0)
    } catch (error) {
      if (!TransactionOrchestrator.isExpectedError(error)) {
        throw error
      }
    }
  }

  private static async skipStep({
    transaction,
    step,
  }: {
    transaction: DistributedTransactionType
    step: TransactionStep
  }): Promise<{
    stopExecution: boolean
    transactionIsCancelling?: boolean
  }> {
    const hasStepTimedOut =
      step.getStates().state === TransactionStepState.TIMEOUT

    if (!hasStepTimedOut) {
      step.changeStatus(TransactionStepStatus.OK)
      step.changeState(TransactionStepState.SKIPPED)
    }

    let shouldEmit = true
    let transactionIsCancelling = false
    try {
      await transaction.saveCheckpoint({
        _v: step._v,
        parallelSteps: TransactionOrchestrator.countSiblings(
          transaction.getFlow(),
          step
        ),
        stepId: step.id,
      })
    } catch (error) {
      if (!TransactionOrchestrator.isExpectedError(error)) {
        throw error
      }

      transactionIsCancelling =
        SkipCancelledExecutionError.isSkipCancelledExecutionError(error)

      if (SkipExecutionError.isSkipExecutionError(error)) {
        shouldEmit = false
      }
    }

    const cleaningUp: Promise<unknown>[] = []
    if (step.hasRetryScheduled()) {
      cleaningUp.push(transaction.clearRetry(step))
    }
    if (step.hasTimeout()) {
      cleaningUp.push(transaction.clearStepTimeout(step))
    }

    if (cleaningUp.length) {
      await promiseAll(cleaningUp)
    }

    if (shouldEmit) {
      const eventName = DistributedTransactionEvent.STEP_SKIPPED
      transaction.emit(eventName, { step, transaction })
    }

    return {
      stopExecution: !shouldEmit,
      transactionIsCancelling,
    }
  }

  private static async setStepTimeout(
    transaction: DistributedTransactionType,
    step: TransactionStep,
    error: TransactionStepTimeoutError | TransactionTimeoutError
  ): Promise<void> {
    if (setStepTimeoutSkipStates.has(step.getStates().state)) {
      return
    }

    step.changeState(TransactionStepState.TIMEOUT)

    if (error?.stack) {
      const workflowId = transaction.modelId
      const stepAction = step.definition.action
      const sourcePath = transaction.getFlow().metadata?.sourcePath
      const sourceStack = sourcePath
        ? `\n⮑ \sat ${sourcePath}: [${workflowId} -> ${stepAction} (${TransactionHandlerType.INVOKE})]`
        : `\n⮑ \sat [${workflowId} -> ${stepAction} (${TransactionHandlerType.INVOKE})]`
      error.stack += sourceStack
    }

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
    transaction: DistributedTransactionType,
    step: TransactionStep,
    error: Error | any,
    maxRetries: number = TransactionOrchestrator.DEFAULT_RETRIES,
    isTimeout = false,
    timeoutError?: TransactionStepTimeoutError | TransactionTimeoutError
  ): Promise<{
    stopExecution: boolean
    transactionIsCancelling?: boolean
  }> {
    const result = {
      stopExecution: false,
      transactionIsCancelling: false,
    }

    if (SkipExecutionError.isSkipExecutionError(error)) {
      return result
    }

    step.failures++

    if (isErrorLike(error)) {
      error = serializeError(error)
    } else {
      try {
        const serialized = JSON.stringify(error)
        error = error?.message
          ? JSON.parse(serialized)
          : { message: serialized }
      } catch (e) {
        error = {
          message: "Unknown non-serializable error",
        }
      }
    }

    if (
      !isTimeout &&
      step.getStates().status !== TransactionStepStatus.PERMANENT_FAILURE
    ) {
      step.changeStatus(TransactionStepStatus.TEMPORARY_FAILURE)
    }

    const flow = transaction.getFlow()

    const cleaningUp: Promise<unknown>[] = []

    const hasTimedOut = step.getStates().state === TransactionStepState.TIMEOUT
    if (step.failures > maxRetries || hasTimedOut) {
      if (!hasTimedOut) {
        step.changeState(TransactionStepState.FAILED)
      }

      step.changeStatus(TransactionStepStatus.PERMANENT_FAILURE)

      if (!isTimeout) {
        const handlerType = step.isCompensating()
          ? TransactionHandlerType.COMPENSATE
          : TransactionHandlerType.INVOKE

        error.stack ??= ""

        const workflowId = transaction.modelId
        const stepAction = step.definition.action
        const sourcePath = transaction.getFlow().metadata?.sourcePath
        const sourceStack = sourcePath
          ? `\n⮑ \sat ${sourcePath}: [${workflowId} -> ${stepAction} (${TransactionHandlerType.INVOKE})]`
          : `\n⮑ \sat [${workflowId} -> ${stepAction} (${TransactionHandlerType.INVOKE})]`
        error.stack += sourceStack

        transaction.addError(step.definition.action!, handlerType, error)
      }

      if (!step.isCompensating()) {
        const isTransactionTimeout =
          TransactionTimeoutError.isTransactionTimeoutError(timeoutError!)

        const canContinueOnFailure =
          (step.definition.continueOnPermanentFailure ||
            step.definition.skipOnPermanentFailure) &&
          !isTransactionTimeout

        if (canContinueOnFailure) {
          if (step.definition.skipOnPermanentFailure) {
            const until = isString(step.definition.skipOnPermanentFailure)
              ? step.definition.skipOnPermanentFailure
              : undefined

            let stepsToSkip: string[] = [...step.next]
            while (stepsToSkip.length > 0) {
              const currentStep = flow.steps[stepsToSkip.shift()!]

              if (until && currentStep.definition.action === until) {
                break
              }
              currentStep.changeState(TransactionStepState.SKIPPED_FAILURE)

              if (currentStep.next?.length > 0) {
                stepsToSkip = stepsToSkip.concat(currentStep.next)
              }
            }
          }
        } else {
          flow.state = TransactionState.WAITING_TO_COMPENSATE
        }
      }

      if (step.hasTimeout()) {
        cleaningUp.push(transaction.clearStepTimeout(step))
      }
    } else {
      const isAsync = step.isCompensating()
        ? step.definition.compensateAsync
        : step.definition.async

      if (
        step.getStates().status === TransactionStepStatus.TEMPORARY_FAILURE &&
        step.definition.autoRetry === false &&
        isAsync
      ) {
        step.temporaryFailedAt = Date.now()
        result.stopExecution = true
      }
    }

    try {
      await transaction.saveCheckpoint({
        _v: step._v,
        parallelSteps: TransactionOrchestrator.countSiblings(
          transaction.getFlow(),
          step
        ),
        stepId: step.id,
      })
    } catch (error) {
      if (!TransactionOrchestrator.isExpectedError(error)) {
        throw error
      }

      result.transactionIsCancelling =
        SkipCancelledExecutionError.isSkipCancelledExecutionError(error)

      if (SkipExecutionError.isSkipExecutionError(error)) {
        result.stopExecution = true
      }
    }

    if (step.hasRetryScheduled()) {
      cleaningUp.push(transaction.clearRetry(step))
    }

    if (cleaningUp.length) {
      await promiseAll(cleaningUp)
    }

    if (!result.stopExecution) {
      const eventName = step.isCompensating()
        ? DistributedTransactionEvent.COMPENSATE_STEP_FAILURE
        : DistributedTransactionEvent.STEP_FAILURE
      transaction.emit(eventName, { step, transaction })
    }

    return {
      stopExecution: result.stopExecution,
      transactionIsCancelling: result.transactionIsCancelling,
    }
  }

  private async executeNext(
    transaction: DistributedTransactionType
  ): Promise<void> {
    let continueExecution = true

    while (continueExecution) {
      if (transaction.hasFinished()) {
        return
      }

      const flow = transaction.getFlow()

      let nextSteps = await this.checkAllSteps(transaction)

      const hasTimedOut = await this.checkTransactionTimeout(
        transaction,
        nextSteps.current
      )

      if (hasTimedOut) {
        continue
      }

      if (nextSteps.remaining === 0) {
        await this.finalizeTransaction(transaction)

        return
      }

      const stepsShouldContinueExecution = nextSteps.next.map((step) => {
        const { shouldContinueExecution } = this.prepareStepForExecution(
          step,
          flow
        )

        return shouldContinueExecution
      })

      let asyncStepCount = 0
      for (const s of nextSteps.next) {
        const stepIsAsync = s.isCompensating()
          ? s.definition.compensateAsync
          : s.definition.async
        if (stepIsAsync) asyncStepCount++
      }
      const hasMultipleAsyncSteps = asyncStepCount > 1
      const hasAsyncSteps = !!asyncStepCount

      // If there is any async step, we don't need to save the checkpoint here as it will be saved
      // later down there
      await transaction.saveCheckpoint().catch((error) => {
        if (TransactionOrchestrator.isExpectedError(error)) {
          continueExecution = false
          return
        }

        throw error
      })

      if (!continueExecution) {
        break
      }

      const execution: Promise<void | unknown>[] = []
      const executionAsync: (() => Promise<void | unknown>)[] = []

      let i = 0

      for (const step of nextSteps.next) {
        const stepIndex = i++
        if (!stepsShouldContinueExecution[stepIndex]) {
          continue
        }

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

        // Compute current transaction state
        await this.computeCurrentTransactionState(transaction)

        const promise = this.createStepExecutionPromise(transaction, step)

        const hasVersionControl =
          hasMultipleAsyncSteps || step.hasAwaitingRetry()

        if (hasVersionControl && !step._v) {
          transaction.getFlow()._v += 1
          step._v = transaction.getFlow()._v
        }

        if (!isAsync) {
          execution.push(
            this.executeSyncStep(promise, transaction, step, nextSteps)
          )
        } else {
          // Execute async step in background as part of the next event loop cycle and continue the execution of the transaction
          executionAsync.push(() =>
            this.executeAsyncStep(promise, transaction, step, nextSteps)
          )
        }
      }

      await promiseAll(execution)

      if (!nextSteps.next.length || (hasAsyncSteps && !execution.length)) {
        continueExecution = false
      }

      if (hasAsyncSteps) {
        await transaction.saveCheckpoint().catch((error) => {
          if (TransactionOrchestrator.isExpectedError(error)) {
            continueExecution = false
          }

          throw error
        })

        for (const exec of executionAsync) {
          void exec()
        }
      }
    }
  }

  /**
   * Finalize the transaction when all steps are complete
   */
  private async finalizeTransaction(
    transaction: DistributedTransactionType
  ): Promise<void> {
    if (transaction.hasTimeout()) {
      void transaction.clearTransactionTimeout()
    }

    await transaction.saveCheckpoint().catch((error) => {
      if (!TransactionOrchestrator.isExpectedError(error)) {
        throw error
      }
    })

    this.emit(DistributedTransactionEvent.FINISH, { transaction })
  }

  /**
   * Prepare a step for execution by setting state and incrementing attempts
   */
  private prepareStepForExecution(
    step: TransactionStep,
    flow: TransactionFlow
  ): { shouldContinueExecution: boolean } {
    const curState = step.getStates()

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
          return { shouldContinueExecution: false }
        }
      } else if (flow.state === TransactionState.INVOKING) {
        step.changeState(TransactionStepState.INVOKING)
      }
    }

    step.changeStatus(TransactionStepStatus.WAITING)

    return { shouldContinueExecution: true }
  }

  /**
   * Create the payload for a step execution
   */
  private createStepPayload(
    transaction: DistributedTransactionType,
    step: TransactionStep,
    flow: TransactionFlow,
    type: TransactionHandlerType
  ): TransactionPayload {
    return new TransactionPayload(
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
  }

  /**
   * Prepare handler arguments for step execution
   */
  private prepareHandlerArgs(
    transaction: DistributedTransactionType,
    step: TransactionStep,
    payload: TransactionPayload,
    type: TransactionHandlerType
  ): Parameters<TransactionStepHandler> {
    return [
      step.definition.action + "",
      type,
      payload,
      transaction,
      step,
      this,
    ] as Parameters<TransactionStepHandler>
  }

  /**
   * Create the step execution promise with optional tracing
   */
  private createStepExecutionPromise(
    transaction: DistributedTransactionType,
    step: TransactionStep
  ): () => Promise<any> {
    const type = step.isCompensating()
      ? TransactionHandlerType.COMPENSATE
      : TransactionHandlerType.INVOKE

    const flow = transaction.getFlow()
    const payload = this.createStepPayload(transaction, step, flow, type)
    const handlerArgs = this.prepareHandlerArgs(
      transaction,
      step,
      payload,
      type
    )

    const traceData = {
      action: step.definition.action + "",
      type,
      step_id: step.id,
      step_uuid: step.uuid + "",
      attempts: step.attempts,
      failures: step.failures,
      async: !!(type === "invoke"
        ? step.definition.async
        : step.definition.compensateAsync),
      idempotency_key: handlerArgs[2].metadata.idempotency_key,
    }

    const stepHandler = async () => {
      return await transaction.handler(...handlerArgs)
    }

    // Return the appropriate promise based on tracing configuration
    if (TransactionOrchestrator.traceStep) {
      return () => TransactionOrchestrator.traceStep!(stepHandler, traceData)
    } else {
      return stepHandler
    }
  }

  /**
   * Execute a synchronous step and handle its result
   */
  private executeSyncStep(
    promiseFn: () => Promise<any>,
    transaction: DistributedTransactionType,
    step: TransactionStep,
    nextSteps: { next: TransactionStep[] }
  ): Promise<void | unknown> {
    return promiseFn()
      .then(async (response: any) => {
        await this.handleStepExpiration(transaction, step, nextSteps)

        const output =
          response?.__type || response?.output?.__type
            ? response.output
            : response

        if (SkipStepResponse.isSkipStepResponse(output)) {
          await TransactionOrchestrator.skipStep({
            transaction,
            step,
          })
          return
        }

        await this.handleStepSuccess(transaction, step, response)
      })
      .catch(async (error) => {
        if (TransactionOrchestrator.isExpectedError(error)) {
          return
        }

        const response = error?.getStepResponse?.()
        await this.handleStepExpiration(transaction, step, nextSteps)

        if (PermanentStepFailureError.isPermanentStepFailureError(error)) {
          await this.handleStepFailure(transaction, step, error, true, response)
          return
        }

        await this.handleStepFailure(transaction, step, error, false, response)
      })
  }

  /**
   * Execute an asynchronous step and handle its result
   */
  private executeAsyncStep(
    promiseFn: () => Promise<any>,
    transaction: DistributedTransactionType,
    step: TransactionStep,
    nextSteps: { next: TransactionStep[] }
  ): Promise<void | unknown> {
    return promiseFn()
      .then(async (response: any) => {
        const output =
          response?.__type || response?.output?.__type
            ? response.output
            : response

        if (SkipStepResponse.isSkipStepResponse(output)) {
          await TransactionOrchestrator.skipStep({
            transaction,
            step,
          })
          // Schedule to continue the execution of async steps because they are not awaited on purpose and can be handled by another machine
          await transaction.scheduleRetry(step, 0)
          return
        } else {
          if (!step.definition.backgroundExecution || step.definition.nested) {
            const eventName = DistributedTransactionEvent.STEP_AWAITING
            transaction.emit(eventName, { step, transaction })
            return
          }

          await this.handleStepExpiration(transaction, step, nextSteps)
          await this.handleStepSuccess(transaction, step, response)
        }
      })
      .catch(async (error) => {
        if (TransactionOrchestrator.isExpectedError(error)) {
          return
        }

        const response = error?.getStepResponse?.()

        if (PermanentStepFailureError.isPermanentStepFailureError(error)) {
          await this.handleStepFailure(transaction, step, error, true, response)
          return
        }

        await this.handleStepFailure(transaction, step, error, false, response)
      })
  }

  /**
   * Check if step or transaction has expired and handle timeouts
   */
  private async handleStepExpiration(
    transaction: DistributedTransactionType,
    step: TransactionStep,
    nextSteps: { next: TransactionStep[] }
  ): Promise<void> {
    if (this.hasExpired({ transaction, step }, Date.now())) {
      await this.checkStepTimeout(transaction, step)
      await this.checkTransactionTimeout(
        transaction,
        nextSteps.next.includes(step) ? nextSteps.next : [step]
      )
    }
  }

  /**
   * Handle successful step completion
   */
  private async handleStepSuccess(
    transaction: DistributedTransactionType,
    step: TransactionStep,
    response: unknown
  ): Promise<void> {
    const isAsync = step.isCompensating()
      ? step.definition.compensateAsync
      : step.definition.async

    if (isDefined(response) && step.saveResponse && !isAsync) {
      transaction.addResponse(
        step.definition.action!,
        step.isCompensating()
          ? TransactionHandlerType.COMPENSATE
          : TransactionHandlerType.INVOKE,
        response
      )
    }

    const ret = await TransactionOrchestrator.setStepSuccess(
      transaction,
      step,
      response
    )

    if (ret.transactionIsCancelling) {
      await this.cancelTransaction(transaction, {
        preventExecuteNext: true,
      })
    }

    if (isAsync && !ret.stopExecution) {
      // Schedule to continue the execution of async steps because they are not awaited on purpose and can be handled by another machine
      await transaction.scheduleRetry(step, 0)
    }
  }

  /**
   * Handle step failure
   */
  private async handleStepFailure(
    transaction: DistributedTransactionType,
    step: TransactionStep,
    error: Error | any,
    isPermanent: boolean,
    response?: unknown
  ): Promise<void> {
    const isAsync = step.isCompensating()
      ? step.definition.compensateAsync
      : step.definition.async

    if (isDefined(response) && step.saveResponse) {
      transaction.addResponse(
        step.definition.action!,
        step.isCompensating()
          ? TransactionHandlerType.COMPENSATE
          : TransactionHandlerType.INVOKE,
        response
      )
    }

    const ret = await TransactionOrchestrator.setStepFailure(
      transaction,
      step,
      error,
      isPermanent ? 0 : step.definition.maxRetries
    )

    if (ret.transactionIsCancelling) {
      await this.cancelTransaction(transaction, {
        preventExecuteNext: true,
      })
    }

    if (isAsync && !ret.stopExecution) {
      // Schedule to continue the execution of async steps because they are not awaited on purpose and can be handled by another machine
      await transaction.scheduleRetry(step, 0)
    }
  }

  /**
   * Start a new transaction or resume a transaction that has been previously started
   * @param transaction - The transaction to resume
   */
  public async resume(transaction: DistributedTransactionType): Promise<void> {
    if (transaction.modelId !== this.id) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        `TransactionModel "${transaction.modelId}" cannot be orchestrated by "${this.id}" model.`
      )
    }

    if (transaction.hasFinished()) {
      return
    }

    const executeNext = async () => {
      const flow = transaction.getFlow()

      if (flow.state === TransactionState.NOT_STARTED) {
        flow.state = TransactionState.INVOKING
        flow.startedAt = Date.now()

        await transaction.saveCheckpoint({
          ttl: flow.hasAsyncSteps ? 0 : TransactionOrchestrator.DEFAULT_TTL,
        })

        if (transaction.hasTimeout()) {
          await transaction.scheduleTransactionTimeout(
            transaction.getTimeout()!
          )
        }

        this.emit(DistributedTransactionEvent.BEGIN, { transaction })
      } else {
        this.emit(DistributedTransactionEvent.RESUME, { transaction })
      }

      return await this.executeNext(transaction)
    }

    if (
      TransactionOrchestrator.traceTransaction &&
      !transaction.getFlow().hasAsyncSteps
    ) {
      await TransactionOrchestrator.traceTransaction(executeNext, {
        model_id: transaction.modelId,
        transaction_id: transaction.transactionId,
        flow_metadata: transaction.getFlow().metadata,
      })
      return
    }

    await executeNext()
  }

  /**
   * Cancel and revert a transaction compensating all its executed steps. It can be an ongoing transaction or a completed one
   * @param transaction - The transaction to be reverted
   */
  public async cancelTransaction(
    transaction: DistributedTransactionType,
    options?: { preventExecuteNext?: boolean }
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

    if (
      flow.state === TransactionState.COMPENSATING ||
      flow.state === TransactionState.WAITING_TO_COMPENSATE
    ) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        `Cannot revert a transaction that is already compensating.`
      )
    }

    flow.state = TransactionState.WAITING_TO_COMPENSATE
    flow.cancelledAt = Date.now()

    await transaction.saveCheckpoint()

    if (options?.preventExecuteNext) {
      return
    }

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

    if (
      hasStepTimeouts ||
      hasRetriesTimeout ||
      hasTransactionTimeout ||
      isIdempotent ||
      this.options.retentionTime ||
      hasAsyncSteps
    ) {
      this.options.store = true
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
    flowMetadata?: TransactionFlow["metadata"],
    context?: Context
  ): TransactionFlow {
    const [steps, features] = TransactionOrchestrator.buildSteps(
      this.definition
    )

    const flow: TransactionFlow = {
      modelId: this.id,
      options: this.options,
      transactionId: transactionId,
      runId: context?.runId ?? ulid(),
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
      _v: 0, // Initialize version to 0
    }

    return flow
  }

  private static async loadTransactionById(
    modelId: string,
    transactionId: string,
    options?: { isCancelling?: boolean }
  ): Promise<TransactionCheckpoint | null> {
    const transaction = await DistributedTransaction.loadTransaction(
      modelId,
      transactionId,
      options
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

  static buildSteps(
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
      hasNestedTransactions: false,
    }

    while (queue.length > 0) {
      const { obj, level } = queue.shift()

      if (obj.action) {
        if (actionNames.has(obj.action)) {
          throw new Error(`Step ${obj.action} is already defined in workflow.`)
        }

        actionNames.add(obj.action)
        level.push(obj.action)
        const id = level.join(".")
        const parent = level.slice(0, level.length - 1).join(".")

        if (!existingSteps || parent === TransactionOrchestrator.ROOT_STEP) {
          states[parent].next?.push(id)
        }

        const definitionCopy = { ...obj } as TransactionStepsDefinition
        delete definitionCopy.next

        const isAsync = !!definitionCopy.async
        const hasRetryInterval = !!(
          definitionCopy.retryInterval || definitionCopy.retryIntervalAwaiting
        )
        const hasTimeout = !!definitionCopy.timeout

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

        if (definitionCopy.nested) {
          features.hasNestedTransactions = true
        }

        /**
         * Force the checkpoint to save even for sync step when they have specific configurations.
         */
        definitionCopy.store = !!(
          definitionCopy.store ||
          isAsync ||
          hasRetryInterval ||
          hasTimeout
        )

        if (existingSteps?.[id]) {
          existingSteps[id].definition.store = definitionCopy.store
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
            _v: 0, // Initialize step version to 0
          }
        )
      }

      if (Array.isArray(obj.next)) {
        for (const next of obj.next) {
          queue.push({ obj: next, level: [...level] })
        }
      } else if (isObject(obj.next)) {
        queue.push({ obj: obj.next, level: [...level] })
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
  public async beginTransaction({
    transactionId,
    handler,
    payload,
    flowMetadata,
    context,
    onLoad,
  }: {
    transactionId: string
    handler: TransactionStepHandler
    payload?: unknown
    flowMetadata?: TransactionFlow["metadata"]
    context?: Context
    onLoad?: (transaction: DistributedTransactionType) => Promise<void> | void
  }): Promise<DistributedTransactionType> {
    const existingTransaction =
      await TransactionOrchestrator.loadTransactionById(this.id, transactionId)

    let newTransaction = false
    let modelFlow: TransactionFlow
    if (!existingTransaction) {
      modelFlow = this.createTransactionFlow(
        transactionId,
        flowMetadata,
        context
      )
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

    if (newTransaction && this.getOptions().store) {
      await transaction.saveCheckpoint({
        ttl: modelFlow.hasAsyncSteps ? 0 : TransactionOrchestrator.DEFAULT_TTL,
      })
    }

    if (onLoad) {
      await onLoad(transaction)
    }

    return transaction
  }

  /** Returns an existing transaction
   * @param transactionId - unique identifier of the transaction
   * @param handler - function to handle action of the transaction
   */
  public async retrieveExistingTransaction(
    transactionId: string,
    handler: TransactionStepHandler,
    options?: { isCancelling?: boolean }
  ): Promise<DistributedTransactionType> {
    const existingTransaction =
      await TransactionOrchestrator.loadTransactionById(
        this.id,
        transactionId,
        { isCancelling: options?.isCancelling }
      )

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
    transaction?: DistributedTransactionType
  ): Promise<[DistributedTransactionType, TransactionStep]> {
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
  public async skipStep({
    responseIdempotencyKey,
    handler,
    transaction,
  }: {
    responseIdempotencyKey: string
    handler?: TransactionStepHandler
    transaction?: DistributedTransactionType
  }): Promise<DistributedTransactionType> {
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

      await TransactionOrchestrator.skipStep({
        transaction: curTransaction,
        step,
      })

      await this.executeNext(curTransaction)
    } else {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        `Cannot skip a step when status is ${step.getStates().status}`
      )
    }

    return curTransaction
  }

  /**
   * Manually force a step to retry even if it is still in awaiting status
   * @param responseIdempotencyKey - The idempotency key for the step
   * @param handler - The handler function to execute the step
   * @param transaction - The current transaction. If not provided it will be loaded based on the responseIdempotencyKey
   */
  public async retryStep({
    responseIdempotencyKey,
    handler,
    transaction,
    onLoad,
  }: {
    responseIdempotencyKey: string
    handler?: TransactionStepHandler
    transaction?: DistributedTransactionType
    onLoad?: (transaction: DistributedTransactionType) => Promise<void> | void
  }): Promise<DistributedTransactionType> {
    const [curTransaction, step] =
      await TransactionOrchestrator.getTransactionAndStepFromIdempotencyKey(
        responseIdempotencyKey,
        handler,
        transaction
      )

    if (onLoad) {
      await onLoad(curTransaction)
    }

    if (step.getStates().status === TransactionStepStatus.WAITING) {
      this.emit(DistributedTransactionEvent.RESUME, {
        transaction: curTransaction,
      })

      await TransactionOrchestrator.retryStep(curTransaction, step)
    } else {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        `Cannot retry step when status is ${step.getStates().status}`
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
  public async registerStepSuccess({
    responseIdempotencyKey,
    handler,
    transaction,
    response,
    onLoad,
  }: {
    responseIdempotencyKey: string
    handler?: TransactionStepHandler
    transaction?: DistributedTransactionType
    response?: unknown
    onLoad?: (transaction: DistributedTransactionType) => Promise<void> | void
  }): Promise<DistributedTransactionType> {
    const [curTransaction, step] =
      await TransactionOrchestrator.getTransactionAndStepFromIdempotencyKey(
        responseIdempotencyKey,
        handler,
        transaction
      )

    if (onLoad) {
      await onLoad(curTransaction)
    }

    if (step.getStates().status === TransactionStepStatus.WAITING) {
      this.emit(DistributedTransactionEvent.RESUME, {
        transaction: curTransaction,
      })

      const ret = await TransactionOrchestrator.setStepSuccess(
        curTransaction,
        step,
        response
      )

      if (ret.transactionIsCancelling) {
        await this.cancelTransaction(curTransaction)
        return curTransaction
      }

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
  public async registerStepFailure({
    responseIdempotencyKey,
    error,
    handler,
    transaction,
    onLoad,
    forcePermanentFailure,
  }: {
    responseIdempotencyKey: string
    error?: Error | any
    handler?: TransactionStepHandler
    transaction?: DistributedTransactionType
    onLoad?: (transaction: DistributedTransactionType) => Promise<void> | void
    forcePermanentFailure?: boolean
  }): Promise<DistributedTransactionType> {
    const [curTransaction, step] =
      await TransactionOrchestrator.getTransactionAndStepFromIdempotencyKey(
        responseIdempotencyKey,
        handler,
        transaction
      )

    if (onLoad) {
      await onLoad(curTransaction)
    }

    if (step.getStates().status === TransactionStepStatus.WAITING) {
      this.emit(DistributedTransactionEvent.RESUME, {
        transaction: curTransaction,
      })

      const ret = await TransactionOrchestrator.setStepFailure(
        curTransaction,
        step,
        error,
        // On permanent failure, the step should not consider any retries
        forcePermanentFailure ? 0 : step.definition.maxRetries
      )

      if (ret.transactionIsCancelling) {
        await this.cancelTransaction(curTransaction)
        return curTransaction
      }

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
