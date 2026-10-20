import {
  Context,
  FlowRunOptions as EngineFlowRunOptions,
  LegacyTransaction,
  LoadedModule,
  MedusaContainer,
  WorkflowRunEvents,
  WorkflowRunResult,
} from "@medusajs/types"

type BaseFlowRunOptions = Omit<EngineFlowRunOptions, "input" | "events"> & {
  events?: WorkflowRunEvents
  container?: LoadedModule[] | MedusaContainer
}

export type FlowRunOptions<TData = unknown> = BaseFlowRunOptions & {
  input?: TData
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
  transaction?: LegacyTransaction
  transactionId?: string
  context?: Context
  throwOnError?: boolean
  logOnError?: boolean
  events?: WorkflowRunEvents
  container?: LoadedModule[] | MedusaContainer
}

/**
 * The details of a workflow's execution.
 */
export type WorkflowResult<TResult = unknown> = WorkflowRunResult<TResult>

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
  ): ExportedWorkflow<TData, TResult, TDataOverride, TResultOverride>
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
