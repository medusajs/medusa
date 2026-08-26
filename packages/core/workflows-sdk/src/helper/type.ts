import {
  DistributedTransactionEvents,
  DistributedTransactionType,
  LocalWorkflow,
  TransactionStepError,
} from "@medusajs/orchestration"
import { Context, LoadedModule, MedusaContainer } from "@medusajs/types"

type BaseFlowRunOptions = {
  context?: Context
  resultFrom?: string | Symbol
  throwOnError?: boolean
  logOnError?: boolean
  events?: DistributedTransactionEvents
  container?: LoadedModule[] | MedusaContainer
}

export type FlowRunOptions<TData = unknown> = BaseFlowRunOptions & {
  input?: TData
  /**
   * When enabled, the workflow run is added to the workflow engine's queue and
   * executed by an instance running in worker mode, instead of being executed
   * in the current process. The call resolves immediately with an
   * acknowledgement and no result. The input must be JSON-serializable, and
   * `events` cannot be combined with this option.
   */
  queue?: boolean
}

/**
 * The acknowledgement returned when a workflow run is queued with `queue: true`.
 */
export type WorkflowRunQueuedAcknowledgement = {
  workflowId: string
  transactionId: string
  parentStepIdempotencyKey?: string
  hasFinished: boolean
  hasFailed: boolean
  queued?: boolean
}

export type FlowRegisterStepSuccessOptions<TData = unknown> =
  BaseFlowRunOptions & {
    idempotencyKey: string
    response?: TData
  }

export type FlowRetryStepOptions = Omit<BaseFlowRunOptions, "resultFrom"> & {
  idempotencyKey: string
}

export type FlowRegisterStepFailureOptions<TData = unknown> =
  BaseFlowRunOptions & {
    idempotencyKey: string
    response?: TData
    forcePermanentFailure?: boolean
  }

export type FlowCancelOptions = {
  transaction?: DistributedTransactionType
  transactionId?: string
  context?: Context
  throwOnError?: boolean
  logOnError?: boolean
  events?: DistributedTransactionEvents
  container?: LoadedModule[] | MedusaContainer
}

/**
 * The details of a workflow's execution.
 */
export type WorkflowResult<TResult = unknown> = {
  /**
   * Any errors that occurred in the workflow.
   */
  errors: TransactionStepError[]
  /**
   * The transaction details of the workflow's execution.
   */
  transaction: DistributedTransactionType
  /**
   * The result returned by the workflow.
   */
  result: TResult
  /**
   * The acknowledgement of a queued run. Only set when the workflow was run
   * with `queue: true`, in which case `result` and `transaction` are not
   * available.
   */
  acknowledgement?: WorkflowRunQueuedAcknowledgement
}

export type ExportedWorkflow<
  TData = unknown,
  TResult = unknown,
  TDataOverride = undefined,
  TResultOverride = undefined
> = {
  run: (
    args?: FlowRunOptions<
      TDataOverride extends undefined ? TData : TDataOverride
    >
  ) => Promise<
    WorkflowResult<
      TResultOverride extends undefined ? TResult : TResultOverride
    >
  >
  registerStepSuccess: (
    args?: FlowRegisterStepSuccessOptions<
      TDataOverride extends undefined ? TData : TDataOverride
    >
  ) => Promise<
    WorkflowResult<
      TResultOverride extends undefined ? TResult : TResultOverride
    >
  >
  registerStepFailure: (
    args?: FlowRegisterStepFailureOptions<
      TDataOverride extends undefined ? TData : TDataOverride
    >
  ) => Promise<
    WorkflowResult<
      TResultOverride extends undefined ? TResult : TResultOverride
    >
  >
  retryStep: (args?: FlowRetryStepOptions) => Promise<WorkflowResult>
  cancel: (args?: FlowCancelOptions) => Promise<WorkflowResult>
}

export type MainExportedWorkflow<TData = unknown, TResult = unknown> = {
  // Main function on the exported workflow
  <TDataOverride = undefined, TResultOverride = undefined>(
    container?: LoadedModule[] | MedusaContainer
  ): Omit<
    LocalWorkflow,
    "run" | "registerStepSuccess" | "registerStepFailure" | "cancel"
  > &
    ExportedWorkflow<TData, TResult, TDataOverride, TResultOverride>
} & {
  /**
   * You can also directly call run, registerStepSuccess, registerStepFailure and cancel on the exported workflow
   */

  run<TDataOverride = undefined, TResultOverride = undefined>(
    args?: FlowRunOptions<
      TDataOverride extends undefined ? TData : TDataOverride
    >
  ): Promise<
    WorkflowResult<
      TResultOverride extends undefined ? TResult : TResultOverride
    >
  >

  registerStepSuccess<TDataOverride = undefined, TResultOverride = undefined>(
    args?: FlowRegisterStepSuccessOptions<
      TDataOverride extends undefined ? TData : TDataOverride
    >
  ): Promise<
    WorkflowResult<
      TResultOverride extends undefined ? TResult : TResultOverride
    >
  >

  registerStepFailure<TDataOverride = undefined, TResultOverride = undefined>(
    args?: FlowRegisterStepFailureOptions<
      TDataOverride extends undefined ? TData : TDataOverride
    >
  ): Promise<
    WorkflowResult<
      TResultOverride extends undefined ? TResult : TResultOverride
    >
  >

  cancel(args?: FlowCancelOptions): Promise<WorkflowResult>
}
