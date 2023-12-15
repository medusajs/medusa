import { DistributedTransaction } from "./distributed-transaction"
import { TransactionStep } from "./transaction-step"

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
  retryIntervalAwaiting?: number
  timeout?: number
  async?: boolean
  noWait?: boolean
  saveResponse?: boolean
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

export type TransactionModelOptions = {
  timeout?: number
  storeExecution?: boolean
  retentionTime?: number
  strictCheckpoints?: boolean
}

export type TransactionModel = {
  id: string
  flow: TransactionStepsDefinition
  hash: string
  options?: TransactionModelOptions
}

export type DistributedTransactionEvents = {
  onBegin?: (transaction: DistributedTransaction) => void
  onResume?: (transaction: DistributedTransaction) => void
  onCompensate?: (transaction: DistributedTransaction) => void
  onFinish?: (transaction: DistributedTransaction, result?: unknown) => void
  onTimeout?: (transaction: DistributedTransaction) => void

  onStepBegin?: (args: {
    step: TransactionStep
    transaction: DistributedTransaction
  }) => void

  onStepSuccess?: (args: {
    step: TransactionStep
    transaction: DistributedTransaction
  }) => void

  onStepFailure?: (args: {
    step: TransactionStep
    transaction: DistributedTransaction
  }) => void
}
