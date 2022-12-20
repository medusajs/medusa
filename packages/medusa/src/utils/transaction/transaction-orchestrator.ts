import { EventEmitter } from "events"

export enum TransactionHandlerType {
  INVOKE = "invoke",
  COMPENSATE = "compensate",
}

export type TransactionStepsDefinition = {
  action?: string
  continueOnPermanentFailure?: boolean
  noCompensation?: boolean
  maxRetries?: number
  retryInterval?: number
  timeout?: number
  async?: boolean
  noWait?: boolean
  forwardResponse?: boolean
  next?: TransactionStepsDefinition | TransactionStepsDefinition[]
}

export enum TransactionStepStatus {
  IDLE = "idle",
  OK = "ok",
  WAITING = "waiting_response",
  TEMPORARY_FAILURE = "temp_failure",
  PERMANENT_FAILURE = "permanent_failure",
}

export enum TransactionState {
  NOT_STARTED = "not_started",
  INVOKING = "invoking",
  WAITING_TO_COMPENSATE = "waiting_to_compensate",
  COMPENSATING = "compensating",
  DONE = "done",
  REVERTED = "reverted",
  FAILED = "failed",
  DORMANT = "dormant",
  SKIPPED = "skipped",
}

export type TransactionModel = {
  id: string
  flow: TransactionStepsDefinition
  hash: string
}

export type TransactionFlow = {
  transaction_model_id: string
  definition: TransactionStepsDefinition
  idempotency_key: string
  hasFailedSteps: boolean
  hasSkippedSteps: boolean
  state: TransactionState
  steps: {
    [key: string]: TransactionStep
  }
}

export type TransactionMetadata = {
  producer: string
  reply_to_topic: string
  idempotency_key: string
  action: string
  action_type: TransactionHandlerType
  attempt: number
  timestamp: number
}
export class TransactionPayload {
  constructor(
    public metadata: TransactionMetadata,
    public data: Record<string, unknown> & { _response: unknown }
  ) {}
}

export class TransactionStep {
  private stepFailed = false
  id: string
  depth: number
  definition: TransactionStepsDefinition
  invoke: {
    state: TransactionState
    status: TransactionStepStatus
  }
  compensate: {
    state: TransactionState
    status: TransactionStepStatus
  }
  attempts: number
  failures: number
  last_attempt: number | null
  next: string[]
  response: unknown
  forwardResponse: boolean

  public getStates() {
    return this.isCompensating() ? this.compensate : this.invoke
  }

  public beginCompensation() {
    if (this.isCompensating()) {
      return
    }

    this.stepFailed = true
    this.attempts = 0
    this.failures = 0
    this.last_attempt = null
  }

  public isCompensating() {
    return this.stepFailed
  }

  public changeState(toState: TransactionState) {
    const allowed = {
      [TransactionState.DORMANT]: [TransactionState.NOT_STARTED],
      [TransactionState.NOT_STARTED]: [
        TransactionState.INVOKING,
        TransactionState.COMPENSATING,
        TransactionState.FAILED,
        TransactionState.SKIPPED,
      ],
      [TransactionState.INVOKING]: [
        TransactionState.FAILED,
        TransactionState.DONE,
      ],
      [TransactionState.COMPENSATING]: [
        TransactionState.REVERTED,
        TransactionState.FAILED,
      ],
      [TransactionState.DONE]: [TransactionState.COMPENSATING],
    }

    const curState = this.getStates()
    if (
      curState.state === toState ||
      allowed?.[curState.state]?.includes(toState)
    ) {
      curState.state = toState
      return
    }

    throw new Error(
      `Updating State from "${curState.state}" to "${toState}" is not allowed.`
    )
  }

  public changeStatus(toStatus: TransactionStepStatus) {
    const allowed = {
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
    }

    const curState = this.getStates()
    if (
      curState.status === toStatus ||
      toStatus === TransactionStepStatus.WAITING ||
      allowed?.[curState.status]?.includes(toStatus)
    ) {
      curState.status = toStatus
      return
    }

    throw new Error(
      `Updating Status from "${curState.status}" to "${toStatus}" is not allowed.`
    )
  }

  public saveResponse(response) {
    this.response = response
  }

  public getResponse(): unknown {
    return this.response
  }
}

class DistributedTransaction {
  public modelId: string
  public idempotencyKey: string
  constructor(
    private flow: TransactionFlow,
    public handler: (
      actionId: string,
      functionHandlerType: TransactionHandlerType,
      payload: TransactionPayload
    ) => Promise<unknown>,
    public payload?: any
  ) {
    this.idempotencyKey = flow.idempotency_key
    this.modelId = flow.transaction_model_id
  }

  public getFlow() {
    return this.flow
  }

  public hasFinished(): boolean {
    return [
      TransactionState.DONE,
      TransactionState.REVERTED,
      TransactionState.FAILED,
    ].includes(this.getState())
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

  public static keyValueStore: any = {} // TODO: Use Key/Value db
  private static keyPrefix = "dtrans:"
  public async saveCheckpoint(): Promise<void> {
    // TODO: Use Key/Value db to save transactions
    const key = DistributedTransaction.keyPrefix + this.idempotencyKey
    DistributedTransaction.keyValueStore[key] = JSON.stringify(this.getFlow())
  }

  public static async loadTransactionFlow(
    idempotencyKey: string
  ): Promise<TransactionFlow | null> {
    // TODO: Use Key/Value db to load transactions
    const key = DistributedTransaction.keyPrefix + idempotencyKey
    if (DistributedTransaction.keyValueStore[key]) {
      return JSON.parse(DistributedTransaction.keyValueStore[key])
    }

    return null
  }

  public async deleteCheckpoint(): Promise<void> {
    // TODO: Delete from Key/Value db
    const key = DistributedTransaction.keyPrefix + this.idempotencyKey
    delete DistributedTransaction.keyValueStore[key]
  }
}

export class TransactionOrchestrator extends EventEmitter {
  private ROOT_STEP = "_root"
  private invokeSteps: string[] = []
  private compensateSteps: string[] = []

  public DEFAULT_RETRIES = 3
  constructor(
    public id: string,
    private definition: TransactionStepsDefinition
  ) {
    super()
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

  private getSteps(flow: TransactionFlow): string[] {
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
      if (previous.id === this.ROOT_STEP) {
        return true
      }

      return this.canMoveForward(flow, previous)
    }
  }

  private checkAllSteps(transaction: DistributedTransaction): {
    next: TransactionStep[]
    total: number
    remaining: number
    completed: number
  } {
    let allSteps: string[]

    const flow = transaction.getFlow()
    if (flow.state == TransactionState.COMPENSATING) {
      allSteps = this.getCompensationSteps(flow)
    } else {
      allSteps = this.getSteps(flow)
    }

    let hasSkipped = false
    let hasIgnoredFailure = false
    let hasFailed = false
    let hasWaiting = false
    let hasReverted = false
    let completedSteps = 0
    const nextSteps: TransactionStep[] = []

    for (const step of allSteps) {
      if (step === this.ROOT_STEP) {
        continue
      }

      const stepDef = flow.steps[step]

      if (this.canContinue(flow, stepDef) === false) {
        continue
      }

      const curState = stepDef.getStates()

      if (curState.status === TransactionStepStatus.WAITING) {
        hasWaiting = true

        if (
          stepDef.last_attempt &&
          stepDef.definition.retryInterval &&
          Date.now() - stepDef.last_attempt >
            stepDef.definition.retryInterval * 1e3
        ) {
          nextSteps.push(stepDef)
          continue
        }
      }

      if (
        (!stepDef.isCompensating() &&
          curState.state === TransactionState.NOT_STARTED &&
          flow.state === TransactionState.INVOKING) ||
        curState.status === TransactionStepStatus.TEMPORARY_FAILURE ||
        (stepDef.isCompensating() &&
          curState.state === TransactionState.NOT_STARTED &&
          flow.state === TransactionState.COMPENSATING)
      ) {
        nextSteps.push(stepDef)
      } else {
        if (curState.status !== TransactionStepStatus.WAITING) {
          completedSteps++
        }

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
        continue
      }
    }

    const totalSteps = allSteps.length - 1
    if (
      flow.state === TransactionState.WAITING_TO_COMPENSATE &&
      nextSteps.length === 0 &&
      hasWaiting === false
    ) {
      flow.state = TransactionState.COMPENSATING
      this.flagStepsToRevert(flow)
      this.emit("compensate", transaction)

      return this.checkAllSteps(transaction)
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

      this.emit("finish", transaction)
      void transaction.deleteCheckpoint()
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
      if (step === this.ROOT_STEP) {
        continue
      }

      const stepDef = flow.steps[step]
      const curState = stepDef.getStates()
      if (
        (curState.state === TransactionState.DONE ||
          curState.status === TransactionStepStatus.PERMANENT_FAILURE) &&
        !stepDef.definition.noCompensation
      ) {
        stepDef.beginCompensation()
        stepDef.changeState(TransactionState.NOT_STARTED)
      }
    }
  }

  private async setStepSuccess(
    transaction: DistributedTransaction,
    step: TransactionStep,
    response: unknown
  ): Promise<void> {
    if (step.forwardResponse) {
      step.saveResponse(response)
    }

    step.changeStatus(TransactionStepStatus.OK)

    if (step.isCompensating()) {
      step.changeState(TransactionState.REVERTED)
    } else {
      step.changeState(TransactionState.DONE)
    }

    if (step.definition.async) {
      await transaction.saveCheckpoint()
    }
  }

  private async setStepFailure(
    transaction: DistributedTransaction,
    step: TransactionStep,
    maxRetries: number = this.DEFAULT_RETRIES
  ): Promise<void> {
    step.failures++

    step.changeStatus(TransactionStepStatus.TEMPORARY_FAILURE)

    if (step.failures > maxRetries) {
      step.changeState(TransactionState.FAILED)
      step.changeStatus(TransactionStepStatus.PERMANENT_FAILURE)

      if (!step.isCompensating()) {
        const flow = transaction.getFlow()
        if (step.definition.continueOnPermanentFailure) {
          for (const childStep of step.next) {
            const child = flow.steps[childStep]
            child.changeState(TransactionState.SKIPPED)
          }
        } else {
          flow.state = TransactionState.WAITING_TO_COMPENSATE
        }
      }
    }

    if (step.definition.async) {
      await transaction.saveCheckpoint()
    }
  }

  private async executeNext(
    transaction: DistributedTransaction
  ): Promise<void> {
    if (transaction.hasFinished()) {
      return
    }

    const flow = transaction.getFlow()

    const nextSteps = this.checkAllSteps(transaction)

    const execution: Promise<void>[] = []
    for (const step of nextSteps.next) {
      const fn = async (step) => {
        const curState = step.getStates()
        const type = step.isCompensating()
          ? TransactionHandlerType.COMPENSATE
          : TransactionHandlerType.INVOKE

        step.last_attempt = Date.now()
        step.attempts++

        if (curState.state === TransactionState.NOT_STARTED) {
          if (step.isCompensating()) {
            step.changeState(TransactionState.COMPENSATING)
          } else if (flow.state === TransactionState.INVOKING) {
            step.changeState(TransactionState.INVOKING)
          }
        }

        step.changeStatus(TransactionStepStatus.WAITING)

        const parent = this.getPreviousStep(flow, step)
        let payloadData: any = transaction.payload

        if (parent.forwardResponse) {
          if (!payloadData) {
            payloadData = {}
          }
          payloadData._response = parent.getResponse()
        }

        const payload = new TransactionPayload(
          {
            producer: flow.transaction_model_id,
            reply_to_topic: TransactionOrchestrator.getKeyName(
              "trans",
              flow.transaction_model_id
            ),
            idempotency_key: TransactionOrchestrator.getKeyName(
              flow.idempotency_key,
              step.definition.action,
              step.isCompensating()
                ? TransactionHandlerType.COMPENSATE
                : TransactionHandlerType.INVOKE
            ),
            action: step.definition.action + "",
            action_type: type,
            attempt: step.attempts,
            timestamp: Date.now(),
          },
          payloadData
        )

        if (!step.definition.async) {
          await transaction
            .handler(step.definition.action + "", type, payload)
            .then(async (response) => {
              await this.setStepSuccess(transaction, step, response)
              await this.executeNext(transaction)
            })
            .catch(async () => {
              await this.setStepFailure(
                transaction,
                step,
                step.definition.maxRetries
              )
              await this.executeNext(transaction)
            })
        } else {
          void transaction.saveCheckpoint().then(() => {
            transaction
              .handler(step.definition.action + "", type, payload)
              .then(() => void 0)
              .catch(() => void 0)
          })
        }
      }

      execution.push(fn(step))
    }

    await Promise.all(execution)

    if (nextSteps.next.length > 0) {
      await this.executeNext(transaction)
    }
  }

  public async resume(transaction: DistributedTransaction): Promise<void> {
    if (transaction.modelId !== this.id) {
      throw new Error(
        `TransactionModel "${transaction.modelId}" cannot be orchestrated by "${this.id}" model.`
      )
    }

    if (transaction.hasFinished()) {
      return
    }

    const flow = transaction.getFlow()

    if (flow.state === TransactionState.NOT_STARTED) {
      flow.state = TransactionState.INVOKING
      this.emit("begin", transaction)
    } else {
      this.emit("resume", transaction)
    }

    await this.executeNext(transaction)
  }

  private async createTransactionFlow(
    idempotencyKey: string
  ): Promise<TransactionFlow> {
    const model: TransactionFlow = {
      transaction_model_id: this.id,
      idempotency_key: idempotencyKey,
      hasFailedSteps: false,
      hasSkippedSteps: false,
      state: TransactionState.NOT_STARTED,
      definition: this.definition,
      steps: this.buildSteps(this.definition),
    }
    return model
  }

  private async getTransactionFlowByIdempotencyKey(
    idempotencyKey: string
  ): Promise<TransactionFlow | null> {
    const flow = await DistributedTransaction.loadTransactionFlow(
      idempotencyKey
    )
    if (flow !== null) {
      flow.steps = this.buildSteps(flow.definition, flow.steps)
      return flow
    }

    return null
  }

  private buildSteps(
    flow: TransactionStepsDefinition,
    existingSteps?: { [key: string]: TransactionStep }
  ): {
    [key: string]: TransactionStep
  } {
    const states: { [key: string]: TransactionStep } = {
      [this.ROOT_STEP]: {
        id: this.ROOT_STEP,
        next: [] as string[],
      } as TransactionStep,
    }

    const getObject = (obj: any, level: string[] = [this.ROOT_STEP]) => {
      for (const key in obj) {
        // eslint-disable-next-line no-prototype-builtins
        if (!obj.hasOwnProperty(key)) {
          continue
        }

        if (typeof obj[key] === "object" && obj[key] !== null) {
          getObject(obj[key], [...level])
        } else if (key === "action") {
          level.push(obj.action)

          const id = level.join(".")

          const parent = level.slice(0, level.length - 1).join(".")
          states[parent].next.push(id)

          const definitionCopy = { ...obj }
          delete definitionCopy.next

          states[id] = Object.assign(
            new TransactionStep(),
            existingSteps?.[id] || {
              id,
              depth: level.length - 1,
              definition: definitionCopy,
              forwardResponse: definitionCopy.forwardResponse,
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
              last_attempt: null,
              next: [],
            }
          )
        }
      }
      return obj
    }
    getObject(flow)

    return states
  }

  public async beginTransaction(
    idempotencyKey: string,
    handler: (
      actionId: string,
      functionHandlerType: TransactionHandlerType,
      payload: TransactionPayload
    ) => Promise<unknown>,
    payload?: unknown
  ): Promise<DistributedTransaction> {
    let modelFlow = await this.getTransactionFlowByIdempotencyKey(
      idempotencyKey
    )

    let newTransaction = false
    if (!modelFlow) {
      modelFlow = await this.createTransactionFlow(idempotencyKey)
      newTransaction = true
    }

    const transaction = new DistributedTransaction(modelFlow, handler, payload)
    if (newTransaction) {
      await transaction.saveCheckpoint()
    }

    return transaction
  }

  private getStepByAction(
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

  private async getTransactionAndStepFromIdempotencyKey(
    responseIdempotencyKey: string,
    handler?: (
      actionId: string,
      functionHandlerType: TransactionHandlerType,
      payload: TransactionPayload
    ) => Promise<unknown>,
    transaction?: DistributedTransaction,
    payload?: unknown
  ): Promise<[DistributedTransaction, TransactionStep]> {
    const [idempotencyKey, action, actionType] = responseIdempotencyKey.split(
      TransactionOrchestrator.SEPARATOR
    )

    if (!transaction && !handler) {
      throw new Error(
        "If a transaction is not provided, the handler is required"
      )
    }

    if (!transaction) {
      const existingTransaction = await this.getTransactionFlowByIdempotencyKey(
        idempotencyKey
      )

      if (existingTransaction === null) {
        throw new Error("Transaction could not be found.")
      }

      transaction = new DistributedTransaction(
        existingTransaction,
        handler!,
        payload
      )
    }

    const step = this.getStepByAction(transaction.getFlow(), action)

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

  public async registerStepSuccess(
    responseIdempotencyKey: string,
    handler?: (
      actionId: string,
      functionHandlerType: TransactionHandlerType,
      payload: TransactionPayload
    ) => Promise<unknown>,
    transaction?: DistributedTransaction,
    payload?: unknown
  ): Promise<DistributedTransaction> {
    const [curTransaction, step] =
      await this.getTransactionAndStepFromIdempotencyKey(
        responseIdempotencyKey,
        handler,
        transaction,
        payload
      )

    if (step.getStates().status === TransactionStepStatus.WAITING) {
      await this.setStepSuccess(curTransaction, step, payload)
      this.emit("resume", curTransaction)
      await this.executeNext(curTransaction)
    } else {
      throw new Error(
        `Cannot set step success when status is ${step.getStates().status}`
      )
    }

    return curTransaction
  }

  public async registerStepFailure(
    responseIdempotencyKey: string,
    handler?: (
      actionId: string,
      functionHandlerType: TransactionHandlerType,
      payload: TransactionPayload
    ) => Promise<unknown>,
    transaction?: DistributedTransaction,
    payload?: unknown
  ): Promise<DistributedTransaction> {
    const [curTransaction, step] =
      await this.getTransactionAndStepFromIdempotencyKey(
        responseIdempotencyKey,
        handler,
        transaction,
        payload
      )

    if (step.getStates().status === TransactionStepStatus.WAITING) {
      await this.setStepFailure(curTransaction, step, 0)
      this.emit("resume", curTransaction)
      await this.executeNext(curTransaction)
    } else {
      throw new Error(
        `Cannot set step failure when status is ${step.getStates().status}`
      )
    }

    return curTransaction
  }

  public cancelTransaction(idempotencyKey: string) {
    // TODO: stop a transaction while in progress
  }
}
