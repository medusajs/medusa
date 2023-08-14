import { isDefined } from "@medusajs/utils"
import { TransactionFlow } from "./transaction-orchestrator"
import { TransactionStepHandler } from "./transaction-step"
import { TransactionHandlerType, TransactionState } from "./types"

/**
 * @typedef TransactionMetadata
 * @property model_id - The id of the model_id that created the transaction (modelId).
 * @property reply_to_topic - The topic to reply to for the transaction.
 * @property idempotency_key - The idempotency key of the transaction.
 * @property action - The action of the transaction.
 * @property action_type - The type of the transaction.
 * @property attempt - The number of attempts for the transaction.
 * @property timestamp - The timestamp of the transaction.
 */
export type TransactionMetadata = {
  model_id: string
  reply_to_topic: string
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

export class TransactionCheckpoint {
  constructor(
    public flow: TransactionFlow,
    public context: TransactionContext,
    public errors: TransactionStepError[] = []
  ) {}
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

export class DistributedTransaction {
  public modelId: string
  public transactionId: string

  private readonly errors: TransactionStepError[] = []

  private readonly context: TransactionContext = new TransactionContext()

  constructor(
    private flow: TransactionFlow,
    public handler: TransactionStepHandler,
    public payload?: any,
    errors?: TransactionStepError[],
    context?: TransactionContext
  ) {
    this.transactionId = flow.transactionId
    this.modelId = flow.modelId

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
  public async saveCheckpoint(): Promise<TransactionCheckpoint> {
    // TODO: Use Key/Value db to save transactions
    const key = DistributedTransaction.keyPrefix + this.transactionId
    const data = new TransactionCheckpoint(
      this.getFlow(),
      this.getContext(),
      this.getErrors()
    )
    DistributedTransaction.keyValueStore[key] = JSON.stringify(data)

    return data
  }

  public static async loadTransaction(
    transactionId: string
  ): Promise<TransactionCheckpoint | null> {
    // TODO: Use Key/Value db to load transactions
    const key = DistributedTransaction.keyPrefix + transactionId
    if (DistributedTransaction.keyValueStore[key]) {
      return JSON.parse(DistributedTransaction.keyValueStore[key])
    }

    return null
  }

  public async deleteCheckpoint(): Promise<void> {
    // TODO: Delete from Key/Value db
    const key = DistributedTransaction.keyPrefix + this.transactionId
    delete DistributedTransaction.keyValueStore[key]
  }
}
