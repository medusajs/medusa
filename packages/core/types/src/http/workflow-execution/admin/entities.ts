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

export type StepInvokeResult = {
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
    invoke: Record<string, StepInvokeResult>
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

export interface WorkflowExecutionFn {
  state: TransactionStepState
  status: TransactionStepStatus
}

export interface AdminWorkflowExecutionStep {
  id: string
  invoke: WorkflowExecutionFn
  definition: WorkflowExecutionDefinition
  compensate: WorkflowExecutionFn
  depth: number
  startedAt: number
}

export interface AdminWorkflowExecution {
  id: string
  workflow_id: string
  transaction_id: string
  execution: AdminWorkflowExecutionExecution
  context: WorkflowExecutionContext
  state: TransactionState
  created_at: Date
  updated_at: Date
  deleted_at?: Date | null
}
