export type WorkflowExecutionStep = {
  id: string
  invoke: {
    state: TransactionStepState
    status: TransactionStepStatus
  }
  definition: {
    async?: boolean
    compensateAsync?: boolean
    noCompensation?: boolean
    continueOnPermanentFailure?: boolean
    maxRetries?: number
    noWait?: boolean
    retryInterval?: number
    retryIntervalAwaiting?: number
    saveResponse?: boolean
    timeout?: number
  }
  compensate: {
    state: TransactionStepState
    status: TransactionStepStatus
  }
  depth: number
  startedAt: number
}

export type StepInvoke = {
  output: {
    output: unknown
    compensateInput: unknown
  }
}

export type StepError = {
  error: Record<string, unknown>
  action: string
  handlerType: string
}

export type WorkflowExecutionContext = {
  data: {
    invoke: Record<string, StepInvoke>
    payload?: unknown
  }
  compensate: Record<string, unknown>
  errors: StepError[]
}

type WorflowExecutionExecution = {
  steps: Record<string, WorkflowExecutionStep>
}

/**
 * Re-implements WorkflowExecutionDTO as it is currently only exported from `@medusajs/workflows-sdk`.
 * Also adds type definitions for fields that have vague types, such as `execution` and `context`.
 */
export interface WorkflowExecutionDTO {
  id: string
  workflow_id: string
  transaction_id: string
  execution: WorflowExecutionExecution | null
  context: WorkflowExecutionContext | null
  state: any
  created_at: Date
  updated_at: Date
  deleted_at: Date
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
}
export enum TransactionStepState {
  NOT_STARTED = "not_started",
  INVOKING = "invoking",
  COMPENSATING = "compensating",
  DONE = "done",
  REVERTED = "reverted",
  FAILED = "failed",
  DORMANT = "dormant",
  SKIPPED = "skipped",
  SKIPPED_FAILURE = "skipped_failure",
  TIMEOUT = "timeout",
}
