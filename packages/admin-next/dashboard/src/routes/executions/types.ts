export type WorkflowExecutionStep = {
  id: string
  invoke: {
    state: TransactionStepState
    status: TransactionStepStatus
  }
  startedAt: number
}

/**
 * Re-implements WorkflowExecutionDTO as it is currently only exported from `@medusajs/workflows-sdk`.
 */
export interface WorkflowExecutionDTO {
  id: string
  workflow_id: string
  transaction_id: string
  execution:
    | (Record<string, unknown> & {
        steps: Record<string, WorkflowExecutionStep>
      })
    | null
  context: Record<string, unknown> | null
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
  TIMEOUT = "timeout",
}
