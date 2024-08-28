export type TransactionStepStatus =
  | "idle"
  | "ok"
  | "waiting_response"
  | "temp_failure"
  | "permanent_failure"

export type TransactionState =
  | "not_started"
  | "invoking"
  | "waiting_to_compensate"
  | "compensating"
  | "done"
  | "reverted"
  | "failed"

export type TransactionStepState =
  | "not_started"
  | "invoking"
  | "compensating"
  | "done"
  | "reverted"
  | "failed"
  | "dormant"
  | "skipped"
  | "skipped_failure"
  | "timeout"

interface AdminWorkflowExecutionExecution {
  steps: Record<string, AdminWorkflowExecutionStep>
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

export interface WorkflowExecutionContext {
  data: {
    invoke: Record<string, StepInvoke>
    payload?: unknown
  }
  compensate: Record<string, unknown>
  errors: StepError[]
}

export interface WorkflowExecutionDefinition {
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

export interface AdminWorkflowExecutionStep {
  id: string
  invoke: {
    state: TransactionStepState
    status: TransactionStepStatus
  }
  definition: WorkflowExecutionDefinition
  compensate: {
    state: TransactionStepState
    status: TransactionStepStatus
  }
  depth: number
  startedAt: number
}

export interface AdminWorkflowExecution {
  id: string
  workflow_id: string
  transaction_id: string
  execution: AdminWorkflowExecutionExecution
  context: WorkflowExecutionContext
  state: any
  steps: Record<string, AdminWorkflowExecutionStep>
  created_at: Date
  updated_at: Date
  deleted_at: Date
}
