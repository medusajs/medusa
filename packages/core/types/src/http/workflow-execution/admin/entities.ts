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

export interface AdminWorkflowExecutionExecution {
  /**
   * The details of the workflow execution's steps.
   * The key is the step's ID, and the value is the step's details.
   */
  steps: Record<string, AdminWorkflowExecutionStep>
}

export type StepInvokeResult = {
  /**
   * The output details of the step.
   */
  output: {
    /**
     * The output of the step. This is the first parameter
     * passed to the returned `StepResponse` function.
     */
    output: unknown
    /**
     * The input of the step's compensation function.
     * This is the second parameter passed to the returned `StepResponse` function.
     */
    compensateInput: unknown
  }
}

export type StepError = {
  /**
   * The error details.
   */
  error: Record<string, unknown>
  /**
   * The ID of the action that failed.
   */
  action: string
  /**
   * The type of the handler that failed. It can be `invoke` or `compensate`.
   */
  handlerType: string
}

export interface WorkflowExecutionContext {
  /**
   * The data of the workflow execution.
   */
  data: {
    /**
     * The details of the invocation of the workflow execution's steps.
     * The key is the step's ID, and the value is the step's details.
     *
     * These details are only included for steps that have their `saveResponse` property set to `true`.
     */
    invoke: Record<string, StepInvokeResult>
    /**
     * The payload or input of the workflow execution.
     */
    payload?: unknown
  }
  /**
   * The output of the compensation function of the workflow execution.
   * The key is the step's ID, and the value is the compensation function's output.
   *
   * These details are only included for steps that have their `saveResponse` property set to `true`.
   */
  compensate: Record<string, unknown>
  /**
   * The errors of the workflow execution.
   */
  errors: StepError[]
}

export interface WorkflowExecutionDefinition {
  /**
   * If true, the step is executed asynchronously. This means that the workflow will not wait for the response of this step.
   * Async steps require to have their responses set using `setStepSuccess` or `setStepFailure`, unless it is combined with `backgroundExecution: true`.
   * If combined with a timeout, and any response is not set within that interval, the step will be marked as `TransactionStepStatus.TIMEOUT` and the workflow will be reverted immediately.
   */
  async?: boolean
  /**
   * If true, the compensation function for this step is executed asynchronously. Which means, the response has to be set using `setStepSuccess` or `setStepFailure`.
   */
  compensateAsync?: boolean
  /**
   * If true, no compensation action will be triggered for this step in case of a failure.
   */
  noCompensation?: boolean
  /**
   * Indicates whether the workflow should continue even if there is a permanent failure in this step.
   * In case it is set to true, the current step will be marked as TransactionStepState.PERMANENT_FAILURE and the next steps will be executed.
   */
  continueOnPermanentFailure?: boolean
  /**
   * Indicates whether the workflow should skip all subsequent steps in case of a permanent failure in this step.
   * In case it is set to true, the next steps of the workflow will not be executed and their status will be marked as TransactionStepState.SKIPPED_FAILURE.
   * In case it is a string, the next steps until the step name provided will be skipped and the workflow will be resumed from the step provided.
   */
  skipOnPermanentFailure?: boolean | string

  /**
   * The maximum number of times this step should be retried in case of temporary failures.
   * The default is 0 (no retries).
   */
  maxRetries?: number
  /**
   * If true, the step will be retried automatically in case of a temporary failure.
   * The default is true.
   */
  autoRetry?: boolean
  /**
   * If true, the workflow will not wait for their sibling steps to complete before moving to the next step.
   */
  noWait?: boolean
  /**
   * The interval (in seconds) between retry attempts after a temporary failure.
   * The default is to retry immediately.
   */
  retryInterval?: number
  /**
   * The interval (in seconds) to retry a step even if its status is `TransactionStepStatus.WAITING`.
   */
  retryIntervalAwaiting?: number
  /**
   * The maximum number of times to retry a step even if its status is `TransactionStepStatus.WAITING`.
   */
  maxAwaitingRetries?: number
  /**
   * If true, the response of this step will be stored.
   * Default is true.
   */
  saveResponse?: boolean
  /**
   * The maximum amount of time (in seconds) to wait for this step to complete.
   * This is NOT an execution timeout, the step will always be executed and wait for its response.
   * If the response is not received within the timeout set, it will be marked as `TransactionStepStatus.TIMEOUT` and the workflow will be reverted as soon as it receives the response.
   */
  timeout?: number
}

export interface WorkflowExecutionFn {
  /**
   * The state of the step.
   */
  state: TransactionStepState
  /**
   * The status of the step.
   */
  status: TransactionStepStatus
}

export interface AdminWorkflowExecutionStep {
  /**
   * The ID of the step.
   */
  id: string
  /**
   * The invoke function of the step.
   */
  invoke: WorkflowExecutionFn
  /**
   * The definition of the step.
   */
  definition: WorkflowExecutionDefinition
  /**
   * The compensate function of the step.
   */
  compensate: WorkflowExecutionFn
  /**
   * The depth of the step.
   */
  depth: number
  /**
   * The date the step was started.
   */
  startedAt: number
}

export interface AdminWorkflowExecution {
  /**
   * The ID of the workflow execution.
   */
  id: string
  /**
   * The ID of the workflow.
   */
  workflow_id: string
  /**
   * The ID of the transaction.
   */
  transaction_id: string
  /**
   * The execution details of the workflow.
   */
  execution: AdminWorkflowExecutionExecution
  /**
   * The context of the workflow execution.
   * This includes the data, errors and the output of the step and compensation functions of the workflow execution.
   */
  context: WorkflowExecutionContext
  /**
   * The state of the workflow execution.
   */
  state: TransactionState
  /**
   * The date the workflow execution was created.
   */
  created_at: Date
  /**
   * The date the workflow execution was updated.
   */
  updated_at: Date
  /**
   * The date the workflow execution was deleted.
   */
  deleted_at?: Date | null
}
