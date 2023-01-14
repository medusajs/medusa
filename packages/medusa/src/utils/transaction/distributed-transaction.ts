import { TransactionFlow, TransactionHandlerType, TransactionState } from "."

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
    public data: Record<string, unknown> & {
      _response: Record<string, unknown>
    }
  ) {}
}

export class DistributedTransaction {
  public modelId: string
  public transactionId: string
  public errors: {
    action: string
    handlerType: TransactionHandlerType
    error: Error | null
  }[] = []

  constructor(
    private flow: TransactionFlow,
    public handler: (
      actionId: string,
      handlerType: TransactionHandlerType,
      payload: TransactionPayload
    ) => Promise<unknown>,
    public payload?: any
  ) {
    this.transactionId = flow.transaction_id
    this.modelId = flow.transaction_model_id
  }

  public getFlow() {
    return this.flow
  }

  public addError(
    action: string,
    handlerType: TransactionHandlerType,
    error: Error | null
  ) {
    this.errors.push({
      action,
      handlerType,
      error,
    })
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
    const key = DistributedTransaction.keyPrefix + this.transactionId
    DistributedTransaction.keyValueStore[key] = JSON.stringify(this.getFlow())
  }

  public static async loadTransactionFlow(
    transactionId: string
  ): Promise<TransactionFlow | null> {
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
