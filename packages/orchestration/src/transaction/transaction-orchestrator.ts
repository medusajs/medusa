import {
  DistributedTransaction,
  TransactionCheckpoint,
  TransactionPayload,
} from "./distributed-transaction"
import { TransactionStep, TransactionStepHandler } from "./transaction-step"
import {
  DistributedTransactionEvent,
  TransactionHandlerType,
  TransactionModelOptions,
  TransactionState,
  TransactionStepsDefinition,
  TransactionStepStatus,
} from "./types"

import { MedusaError, promiseAll } from "@medusajs/utils"
import { EventEmitter } from "events"
import {
  PermanentStepFailureError,
  StepTimeoutError,
  TransactionTimeoutError,
} from "./errors"

export type TransactionFlow = {
  modelId: string
  options?: TransactionModelOptions
  definition: TransactionStepsDefinition
  transactionId: string
  hasAsyncSteps: boolean
  hasFailedSteps: boolean
  hasWaitingSteps: boolean
  hasSkippedSteps: boolean
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
  constructor(
    public id: string,
    private definition: TransactionStepsDefinition,
    private options?: TransactionModelOptions
  ) {
    super()
  }

  private static SEPARATOR = ":"
  public static getKeyName(...params: string[]): string {
    return params.join(this.SEPARATOR)
  }

  public getOptions(): TransactionModelOptions {
    return this.options ?? {}
  }

  private getPreviousStep(flow: TransactionFlow, step: TransactionStep) {
    const id = step.id.split(".")
    id.pop()
    const parentId = id.join(".")
    return flow.steps[parentId]
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
      TransactionState.DONE,
      TransactionState.FAILED,
      TransactionState.SKIPPED,
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
      TransactionState.DONE,
      TransactionState.REVERTED,
      TransactionState.FAILED,
      TransactionState.DORMANT,
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

  private async checkStepTimeout(transaction, step) {
    let hasTimedOut = false
    if (
      step.hasTimeout() &&
      !step.timedOutAt &&
      step.canCancel() &&
      step.startedAt! + step.getTimeoutInterval()! * 1e3 < Date.now()
    ) {
      step.timedOutAt = Date.now()
      await transaction.saveCheckpoint()
      this.emit(DistributedTransactionEvent.TIMEOUT, { transaction })
      await TransactionOrchestrator.setStepFailure(
        transaction,
        step,
        new StepTimeoutError(),
        0
      )
      hasTimedOut = true
    }
    return hasTimedOut
  }

  private async checkAllSteps(transaction: DistributedTransaction): Promise<{
    next: TransactionStep[]
    total: number
    remaining: number
    completed: number
  }> {
    let hasSkipped = false
    let hasIgnoredFailure = false
    let hasFailed = false
    let hasWaiting = false
    let hasReverted = false
    let completedSteps = 0

    const flow = transaction.getFlow()

    const nextSteps: TransactionStep[] = []
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

        if (curState.state === TransactionState.SKIPPED) {
          hasSkipped = true
        } else if (curState.state === TransactionState.REVERTED) {
          hasReverted = true
        } else if (curState.state === TransactionState.FAILED) {
          if (stepDef.definition.continueOnPermanentFailure) {
            hasIgnoredFailure = true
          } else {
            hasFailed = true
          }
        }
      }
    }

    flow.hasWaitingSteps = hasWaiting

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
        curState.state === TransactionState.DONE ||
        curState.status === TransactionStepStatus.PERMANENT_FAILURE
      ) {
        stepDef.beginCompensation()
        stepDef.changeState(TransactionState.NOT_STARTED)
      }
    }
  }

  private static async setStepSuccess(
    transaction: DistributedTransaction,
    step: TransactionStep,
    response: unknown
  ): Promise<void> {
    if (step.saveResponse) {
      transaction.addResponse(
        step.definition.action!,
        step.isCompensating()
          ? TransactionHandlerType.COMPENSATE
          : TransactionHandlerType.INVOKE,
        response
      )
    }

    step.changeStatus(TransactionStepStatus.OK)

    if (step.isCompensating()) {
      step.changeState(TransactionState.REVERTED)
    } else {
      step.changeState(TransactionState.DONE)
    }

    const flow = transaction.getFlow()
    if (step.definition.async || flow.options?.strictCheckpoints) {
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

  private static async setStepFailure(
    transaction: DistributedTransaction,
    step: TransactionStep,
    error: Error | any,
    maxRetries: number = TransactionOrchestrator.DEFAULT_RETRIES
  ): Promise<void> {
    step.failures++

    step.changeStatus(TransactionStepStatus.TEMPORARY_FAILURE)

    const flow = transaction.getFlow()
    const cleaningUp: Promise<unknown>[] = []
    if (step.failures > maxRetries) {
      step.changeState(TransactionState.FAILED)
      step.changeStatus(TransactionStepStatus.PERMANENT_FAILURE)

      transaction.addError(
        step.definition.action!,
        step.isCompensating()
          ? TransactionHandlerType.COMPENSATE
          : TransactionHandlerType.INVOKE,
        error
      )

      if (!step.isCompensating()) {
        if (step.definition.continueOnPermanentFailure) {
          for (const childStep of step.next) {
            const child = flow.steps[childStep]
            child.changeState(TransactionState.SKIPPED)
          }
        } else {
          flow.state = TransactionState.WAITING_TO_COMPENSATE
        }
      }

      if (step.hasTimeout()) {
        cleaningUp.push(transaction.clearStepTimeout(step))
      }
    }

    if (step.definition.async || flow.options?.strictCheckpoints) {
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

  private async checkTransactionTimeout(transaction, currentSteps) {
    let hasTimedOut = false
    const flow = transaction.getFlow()
    if (
      transaction.hasTimeout() &&
      !flow.timedOutAt &&
      flow.startedAt! + transaction.getTimeoutInterval()! * 1e3 < Date.now()
    ) {
      flow.timedOutAt = Date.now()
      this.emit(DistributedTransactionEvent.TIMEOUT, { transaction })

      for (const step of currentSteps) {
        await TransactionOrchestrator.setStepFailure(
          transaction,
          step,
          new TransactionTimeoutError(),
          0
        )
      }

      await transaction.saveCheckpoint()

      hasTimedOut = true
    }
    return hasTimedOut
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
      const nextSteps = await this.checkAllSteps(transaction)
      const execution: Promise<void | unknown>[] = []

      const hasTimedOut = await this.checkTransactionTimeout(
        transaction,
        nextSteps.next
      )
      if (hasTimedOut) {
        continue
      }

      if (nextSteps.remaining === 0) {
        if (transaction.hasTimeout()) {
          await transaction.clearTransactionTimeout()
        }

        if (flow.options?.retentionTime == undefined) {
          await transaction.deleteCheckpoint()
        } else {
          await transaction.saveCheckpoint()
        }

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

        if (curState.state === TransactionState.NOT_STARTED) {
          if (!step.startedAt) {
            step.startedAt = Date.now()
          }

          if (step.isCompensating()) {
            step.changeState(TransactionState.COMPENSATING)

            if (step.definition.noCompensation) {
              step.changeState(TransactionState.REVERTED)
              continue
            }
          } else if (flow.state === TransactionState.INVOKING) {
            step.changeState(TransactionState.INVOKING)
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

        const setStepFailure = async (
          error: Error | any,
          { endRetry }: { endRetry?: boolean } = {}
        ) => {
          return TransactionOrchestrator.setStepFailure(
            transaction,
            step,
            error,
            endRetry ? 0 : step.definition.maxRetries
          )
        }

        const isAsync = step.isCompensating()
          ? step.definition.compensateAsync
          : step.definition.async

        if (!isAsync) {
          hasSyncSteps = true
          execution.push(
            transaction
              .handler(step.definition.action + "", type, payload, transaction)
              .then(async (response: any) => {
                await TransactionOrchestrator.setStepSuccess(
                  transaction,
                  step,
                  response
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
          )
        } else {
          execution.push(
            transaction.saveCheckpoint().then(async () =>
              transaction
                .handler(
                  step.definition.action + "",
                  type,
                  payload,
                  transaction
                )
                .catch(async (error) => {
                  if (
                    PermanentStepFailureError.isPermanentStepFailureError(error)
                  ) {
                    await setStepFailure(error, { endRetry: true })
                    return
                  }

                  await setStepFailure(error)
                })
            )
          )
        }
      }

      if (hasSyncSteps && flow.options?.strictCheckpoints) {
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

      if (this.options?.storeExecution) {
        await transaction.saveCheckpoint(
          flow.hasAsyncSteps ? 0 : TransactionOrchestrator.DEFAULT_TTL
        )
      }

      if (transaction.hasTimeout()) {
        await transaction.scheduleTransactionTimeout(
          transaction.getTimeoutInterval()!
        )
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
        `Cannot revert a perment failed transaction.`
      )
    }

    flow.state = TransactionState.WAITING_TO_COMPENSATE

    await this.executeNext(transaction)
  }

  private createTransactionFlow(transactionId: string): TransactionFlow {
    const [steps, features] = TransactionOrchestrator.buildSteps(
      this.definition
    )

    const hasAsyncSteps = features.hasAsyncSteps
    const hasStepTimeouts = features.hasStepTimeouts
    const hasRetriesTimeout = features.hasRetriesTimeout

    this.options ??= {}
    if (hasAsyncSteps || hasStepTimeouts || hasRetriesTimeout) {
      this.options.storeExecution = true
    }

    const flow: TransactionFlow = {
      modelId: this.id,
      options: this.options,
      transactionId: transactionId,
      hasAsyncSteps,
      hasFailedSteps: false,
      hasSkippedSteps: false,
      hasWaitingSteps: false,
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
  ): [
    { [key: string]: TransactionStep },
    {
      hasAsyncSteps: boolean
      hasStepTimeouts: boolean
      hasRetriesTimeout: boolean
    }
  ] {
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

      for (const key in obj) {
        // eslint-disable-next-line no-prototype-builtins
        if (!obj.hasOwnProperty(key)) {
          continue
        }

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
              depth: level.length - 1,
              definition: definitionCopy,
              saveResponse: definitionCopy.saveResponse ?? true,
              invoke: {
                state: TransactionState.NOT_STARTED,
                status: TransactionStepStatus.IDLE,
              },
              compensate: {
                state: TransactionState.DORMANT,
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
   */
  public async beginTransaction(
    transactionId: string,
    handler: TransactionStepHandler,
    payload?: unknown
  ): Promise<DistributedTransaction> {
    const existingTransaction =
      await TransactionOrchestrator.loadTransactionById(this.id, transactionId)

    let newTransaction = false
    let modelFlow: TransactionFlow
    if (!existingTransaction) {
      modelFlow = this.createTransactionFlow(transactionId)
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
      this.options?.storeExecution &&
      this.options?.strictCheckpoints
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
