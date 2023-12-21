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
  compensateAsync?: boolean
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

export enum DistributedTransactionEvent {
  BEGIN = "begin",
  RESUME = "resume",
  COMPENSATE_BEGIN = "compensateBegin",
  FINISH = "finish",
  TIMEOUT = "timeout",
  STEP_BEGIN = "stepBegin",
  STEP_SUCCESS = "stepSuccess",
  STEP_FAILURE = "stepFailure",
  COMPENSATE_STEP_SUCCESS = "compensateStepSuccess",
  COMPENSATE_STEP_FAILURE = "compensateStepFailure",
}

export type DistributedTransactionEvents = {
  onBegin?: (args: { transaction: DistributedTransaction }) => void
  onResume?: (args: { transaction: DistributedTransaction }) => void
  onFinish?: (args: {
    transaction: DistributedTransaction
    result?: unknown
    errors?: unknown[]
  }) => void
  onTimeout?: (args: { transaction: DistributedTransaction }) => void

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

  onCompensateBegin?: (args: { transaction: DistributedTransaction }) => void

  onCompensateStepSuccess?: (args: {
    step: TransactionStep
    transaction: DistributedTransaction
  }) => void

  onCompensateStepFailure?: (args: {
    step: TransactionStep
    transaction: DistributedTransaction
  }) => void
}
