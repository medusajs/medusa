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

export type TransactionModel = {
  id: string
  flow: TransactionStepsDefinition
  hash: string
}

export * from "./transaction-orchestrator"
export * from "./transaction-step"
export * from "./distributed-transaction"
