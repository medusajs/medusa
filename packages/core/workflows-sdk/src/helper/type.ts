import { Context, LoadedModule, MedusaContainer } from "@medusajs/types"
import {
  DistributedTransaction,
  DistributedTransactionEvents,
  LocalWorkflow,
  TransactionStepError,
} from "@medusajs/orchestration"

export type FlowRunOptions<TData = unknown> = {
  input?: TData
  context?: Context
  resultFrom?: string | string[] | Symbol
  throwOnError?: boolean
  events?: DistributedTransactionEvents
  container?: LoadedModule[] | MedusaContainer
}

export type FlowRegisterStepSuccessOptions<TData = unknown> = {
  idempotencyKey: string
  response?: TData
  context?: Context
  resultFrom?: string | string[] | Symbol
  throwOnError?: boolean
  events?: DistributedTransactionEvents
  container?: LoadedModule[] | MedusaContainer
}

export type FlowRegisterStepFailureOptions<TData = unknown> = {
  idempotencyKey: string
  response?: TData
  context?: Context
  resultFrom?: string | string[] | Symbol
  throwOnError?: boolean
  events?: DistributedTransactionEvents
  container?: LoadedModule[] | MedusaContainer
}

export type FlowCancelOptions = {
  transaction?: DistributedTransaction
  transactionId?: string
  context?: Context
  throwOnError?: boolean
  events?: DistributedTransactionEvents
  container?: LoadedModule[] | MedusaContainer
}

export type WorkflowResult<TResult = unknown> = {
  errors: TransactionStepError[]
  transaction: DistributedTransaction
  result: TResult
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
