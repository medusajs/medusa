import {
  DistributedTransaction,
  DistributedTransactionEvents,
  LocalWorkflow,
  TransactionHandlerType,
  TransactionState,
  TransactionStepError,
} from "@medusajs/orchestration"
import { Context, LoadedModule, MedusaContainer } from "@medusajs/types"

import { MedusaModule } from "@medusajs/modules-sdk"
import { MedusaContextType } from "@medusajs/utils"
import { EOL } from "os"
import { ulid } from "ulid"
import { MedusaWorkflow } from "../medusa-workflow"
import { resolveValue } from "../utils/composer"

export type FlowRunOptions<TData = unknown> = {
  input?: TData
  context?: Context
  resultFrom?: string | string[] | Symbol
  throwOnError?: boolean
  events?: DistributedTransactionEvents
}

export type FlowRegisterStepSuccessOptions<TData = unknown> = {
  idempotencyKey: string
  response?: TData
  context?: Context
  resultFrom?: string | string[] | Symbol
  throwOnError?: boolean
  events?: DistributedTransactionEvents
}

export type FlowRegisterStepFailureOptions<TData = unknown> = {
  idempotencyKey: string
  response?: TData
  context?: Context
  resultFrom?: string | string[] | Symbol
  throwOnError?: boolean
  events?: DistributedTransactionEvents
}

export type FlowCancelOptions = {
  transaction?: DistributedTransaction
  transactionId?: string
  context?: Context
  throwOnError?: boolean
  events?: DistributedTransactionEvents
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

  /**
   * You can also directly call run, registerStepSuccess, registerStepFailure and cancel on the exported workflow
   */

  run<TDataOverride = undefined, TResultOverride = undefined>(
    args?: FlowRunOptions<
      TDataOverride extends undefined ? TData : TDataOverride
    > & {
      container?: LoadedModule[] | MedusaContainer
    }
  ): Promise<
    WorkflowResult<
      TResultOverride extends undefined ? TResult : TResultOverride
    >
  >

  registerStepSuccess<TDataOverride = undefined, TResultOverride = undefined>(
    args?: FlowRegisterStepSuccessOptions<
      TDataOverride extends undefined ? TData : TDataOverride
    > & {
      container?: LoadedModule[] | MedusaContainer
    }
  ): Promise<
    WorkflowResult<
      TResultOverride extends undefined ? TResult : TResultOverride
    >
  >

  registerStepFailure<TDataOverride = undefined, TResultOverride = undefined>(
    args?: FlowRegisterStepFailureOptions<
      TDataOverride extends undefined ? TData : TDataOverride
    > & {
      container?: LoadedModule[] | MedusaContainer
    }
  ): Promise<
    WorkflowResult<
      TResultOverride extends undefined ? TResult : TResultOverride
    >
  >

  cancel(
    args?: FlowCancelOptions & {
      container?: LoadedModule[] | MedusaContainer
    }
  ): Promise<WorkflowResult>
}

function createContextualWorkflowRunner<
  TData = unknown,
  TResult = unknown,
  TDataOverride = undefined,
  TResultOverride = undefined
>({
  workflowId,
  defaultResult,
  dataPreparation,
  options,
  container,
}: {
  workflowId: string
  defaultResult?: string | Symbol
  dataPreparation?: (data: TData) => Promise<unknown>
  options?: {
    wrappedInput?: boolean
  }
  container?: LoadedModule[] | MedusaContainer
}): Omit<
  LocalWorkflow,
  "run" | "registerStepSuccess" | "registerStepFailure" | "cancel"
> &
  ExportedWorkflow<TData, TResult, TDataOverride, TResultOverride> {
  if (!container) {
    container = MedusaModule.getLoadedModules().map(
      (mod) => Object.values(mod)[0]
    )
  }

  const flow = new LocalWorkflow(workflowId, container!)

  const originalRun = flow.run.bind(flow)
  const originalRegisterStepSuccess = flow.registerStepSuccess.bind(flow)
  const originalRegisterStepFailure = flow.registerStepFailure.bind(flow)
  const originalCancel = flow.cancel.bind(flow)

  const originalExecution = async (
    method,
    { throwOnError, resultFrom, isCancel = false },
    ...args
  ) => {
    const transaction = await method.apply(method, args)

    let errors = transaction.getErrors(TransactionHandlerType.INVOKE)

    const failedStatus = [TransactionState.FAILED, TransactionState.REVERTED]
    const isCancelled =
      isCancel && transaction.getState() === TransactionState.REVERTED

    if (
      !isCancelled &&
      failedStatus.includes(transaction.getState()) &&
      throwOnError
    ) {
      const errorMessage = errors
        ?.map((err) => `${err.error?.message}${EOL}${err.error?.stack}`)
        ?.join(`${EOL}`)
      throw new Error(errorMessage)
    }

    let result
    if (options?.wrappedInput) {
      result = resolveValue(resultFrom, transaction.getContext())
      if (result instanceof Promise) {
        result = await result.catch((e) => {
          errors ??= []
          errors.push(e)
        })
      }
    } else {
      result = transaction.getContext().invoke?.[resultFrom]
    }

    return {
      errors,
      transaction,
      result,
    }
  }

  const newRun = async (
    {
      input,
      context: outerContext,
      throwOnError,
      resultFrom,
      events,
    }: FlowRunOptions = {
      throwOnError: true,
      resultFrom: defaultResult,
    }
  ) => {
    resultFrom ??= defaultResult
    throwOnError ??= true

    const context = {
      ...outerContext,
      __type: MedusaContextType,
    }

    context.transactionId ??= ulid()

    if (typeof dataPreparation === "function") {
      try {
        const copyInput = input ? JSON.parse(JSON.stringify(input)) : input
        input = await dataPreparation(copyInput as TData)
      } catch (err) {
        if (throwOnError) {
          throw new Error(
            `Data preparation failed: ${err.message}${EOL}${err.stack}`
          )
        }
        return {
          errors: [err],
        }
      }
    }

    return await originalExecution(
      originalRun,
      { throwOnError, resultFrom },
      context.transactionId,
      input,
      context,
      events
    )
  }
  flow.run = newRun as any

  const newRegisterStepSuccess = async (
    {
      response,
      idempotencyKey,
      context: outerContext,
      throwOnError,
      resultFrom,
      events,
    }: FlowRegisterStepSuccessOptions = {
      idempotencyKey: "",
      throwOnError: true,
      resultFrom: defaultResult,
    }
  ) => {
    resultFrom ??= defaultResult
    throwOnError ??= true

    const [, transactionId] = idempotencyKey.split(":")
    const context = {
      ...outerContext,
      transactionId,
      __type: MedusaContextType,
    }

    return await originalExecution(
      originalRegisterStepSuccess,
      { throwOnError, resultFrom },
      idempotencyKey,
      response,
      context,
      events
    )
  }
  flow.registerStepSuccess = newRegisterStepSuccess as any

  const newRegisterStepFailure = async (
    {
      response,
      idempotencyKey,
      context: outerContext,
      throwOnError,
      resultFrom,
      events,
    }: FlowRegisterStepFailureOptions = {
      idempotencyKey: "",
      throwOnError: true,
      resultFrom: defaultResult,
    }
  ) => {
    resultFrom ??= defaultResult
    throwOnError ??= true

    const [, transactionId] = idempotencyKey.split(":")
    const context = {
      ...outerContext,
      transactionId,
      __type: MedusaContextType,
    }

    return await originalExecution(
      originalRegisterStepFailure,
      { throwOnError, resultFrom },
      idempotencyKey,
      response,
      context,
      events
    )
  }
  flow.registerStepFailure = newRegisterStepFailure as any

  const newCancel = async (
    {
      transaction,
      transactionId,
      context: outerContext,
      throwOnError,
      events,
    }: FlowCancelOptions = {
      throwOnError: true,
    }
  ) => {
    throwOnError ??= true

    const context = {
      ...outerContext,
      transactionId,
      __type: MedusaContextType,
    }

    return await originalExecution(
      originalCancel,
      {
        throwOnError,
        resultFrom: undefined,
        isCancel: true,
      },
      transaction ?? transactionId,
      context,
      events
    )
  }
  flow.cancel = newCancel as any

  return flow as unknown as LocalWorkflow &
    ExportedWorkflow<TData, TResult, TDataOverride, TResultOverride>
}

export const exportWorkflow = <TData = unknown, TResult = unknown>(
  workflowId: string,
  defaultResult?: string | Symbol,
  dataPreparation?: (data: TData) => Promise<unknown>,
  options?: {
    wrappedInput?: boolean
  }
): MainExportedWorkflow<TData, TResult> => {
  function exportedWorkflow<
    TDataOverride = undefined,
    TResultOverride = undefined
  >(
    container?: LoadedModule[] | MedusaContainer
  ): Omit<
    LocalWorkflow,
    "run" | "registerStepSuccess" | "registerStepFailure" | "cancel"
  > &
    ExportedWorkflow<TData, TResult, TDataOverride, TResultOverride> {
    return createContextualWorkflowRunner<
      TData,
      TResult,
      TDataOverride,
      TResultOverride
    >({
      workflowId,
      defaultResult,
      dataPreparation,
      options,
      container,
    })
  }

  const buildRunnerFn = <
    TAction extends
      | "run"
      | "registerStepSuccess"
      | "registerStepFailure"
      | "cancel",
    TDataOverride,
    TResultOverride
  >(
    action: "run" | "registerStepSuccess" | "registerStepFailure" | "cancel",
    container?: LoadedModule[] | MedusaContainer
  ) => {
    const contextualRunner = createContextualWorkflowRunner<
      TData,
      TResult,
      TDataOverride,
      TResultOverride
    >({
      workflowId,
      defaultResult,
      dataPreparation,
      options,
      container,
    })

    return contextualRunner[action] as ExportedWorkflow<
      TData,
      TResult,
      TDataOverride,
      TResultOverride
    >[TAction]
  }

  exportedWorkflow.run = async <
    TDataOverride = undefined,
    TResultOverride = undefined
  >(
    args?: FlowRunOptions<
      TDataOverride extends undefined ? TData : TDataOverride
    > & {
      container?: LoadedModule[] | MedusaContainer
    }
  ): Promise<
    WorkflowResult<
      TResultOverride extends undefined ? TResult : TResultOverride
    >
  > => {
    const container = args?.container
    delete args?.container
    const inputArgs = { ...args } as FlowRunOptions<
      TDataOverride extends undefined ? TData : TDataOverride
    >

    return await buildRunnerFn<"run", TDataOverride, TResultOverride>(
      "run",
      container
    )(inputArgs)
  }

  exportedWorkflow.registerStepSuccess = async <
    TDataOverride = undefined,
    TResultOverride = undefined
  >(
    args?: FlowRegisterStepSuccessOptions<
      TDataOverride extends undefined ? TData : TDataOverride
    > & {
      container?: LoadedModule[] | MedusaContainer
    }
  ): Promise<
    WorkflowResult<
      TResultOverride extends undefined ? TResult : TResultOverride
    >
  > => {
    const container = args?.container
    delete args?.container
    const inputArgs = { ...args } as FlowRegisterStepSuccessOptions<
      TDataOverride extends undefined ? TData : TDataOverride
    >

    return await buildRunnerFn<
      "registerStepSuccess",
      TDataOverride,
      TResultOverride
    >(
      "registerStepSuccess",
      container
    )(inputArgs)
  }

  exportedWorkflow.registerStepFailure = async <
    TDataOverride = undefined,
    TResultOverride = undefined
  >(
    args?: FlowRegisterStepFailureOptions<
      TDataOverride extends undefined ? TData : TDataOverride
    > & {
      container?: LoadedModule[] | MedusaContainer
    }
  ): Promise<
    WorkflowResult<
      TResultOverride extends undefined ? TResult : TResultOverride
    >
  > => {
    const container = args?.container
    delete args?.container
    const inputArgs = { ...args } as FlowRegisterStepFailureOptions<
      TDataOverride extends undefined ? TData : TDataOverride
    >

    return await buildRunnerFn<
      "registerStepFailure",
      TDataOverride,
      TResultOverride
    >(
      "registerStepFailure",
      container
    )(inputArgs)
  }

  exportedWorkflow.cancel = async (
    args?: FlowCancelOptions & {
      container?: LoadedModule[] | MedusaContainer
    }
  ): Promise<WorkflowResult> => {
    const container = args?.container
    delete args?.container
    const inputArgs = { ...args } as FlowCancelOptions

    return await buildRunnerFn<"cancel", unknown, unknown>(
      "cancel",
      container
    )(inputArgs)
  }

  MedusaWorkflow.registerWorkflow(workflowId, exportedWorkflow)
  return exportedWorkflow
}
