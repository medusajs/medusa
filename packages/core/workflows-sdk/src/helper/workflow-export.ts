import { MedusaModule } from "@medusajs/modules-sdk"
import {
  DistributedTransactionType,
  DistributedTransactionEvents,
  LocalWorkflow,
  TransactionHandlerType,
  TransactionState,
} from "@medusajs/orchestration"
import { Context, LoadedModule, MedusaContainer } from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  MedusaContextType,
  ModuleRegistrationName,
  isPresent,
} from "@medusajs/utils"
import { EOL } from "os"
import { ulid } from "ulid"
import { MedusaWorkflow } from "../medusa-workflow"
import { resolveValue } from "../utils/composer"
import {
  ExportedWorkflow,
  FlowCancelOptions,
  FlowRegisterStepFailureOptions,
  FlowRegisterStepSuccessOptions,
  FlowRunOptions,
  MainExportedWorkflow,
  WorkflowResult,
} from "./type"

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
  const flow = new LocalWorkflow(workflowId, container!)

  const originalRun = flow.run.bind(flow)
  const originalRegisterStepSuccess = flow.registerStepSuccess.bind(flow)
  const originalRegisterStepFailure = flow.registerStepFailure.bind(flow)
  const originalCancel = flow.cancel.bind(flow)

  const originalExecution = async (
    method,
    {
      throwOnError,
      resultFrom,
      isCancel = false,
      container: executionContainer,
    },
    transactionOrIdOrIdempotencyKey: DistributedTransactionType | string,
    input: unknown,
    context: Context,
    events: DistributedTransactionEvents | undefined = {}
  ) => {
    if (!executionContainer) {
      const container_ = flow.container as MedusaContainer
      if (!container_ || !isPresent(container_?.registrations)) {
        executionContainer = MedusaModule.getLoadedModules().map(
          (mod) => Object.values(mod)[0]
        )
      }
    }

    if (executionContainer) {
      flow.container = executionContainer
    }

    const { eventGroupId } = context

    attachOnFinishReleaseEvents(events, eventGroupId!, flow)

    const flowMetadata = {
      eventGroupId,
    }

    const args = [
      transactionOrIdOrIdempotencyKey,
      input,
      context,
      events,
      flowMetadata,
    ]
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
      /*const errorMessage = errors
        ?.map((err) => `${err.error?.message}${EOL}${err.error?.stack}`)
        ?.join(`${EOL}`)*/
      const firstError = errors?.[0]?.error ?? new Error("Unknown error")
      throw firstError
    }

    let result
    if (options?.wrappedInput) {
      result = resolveValue(resultFrom, transaction.getContext())
      if (result instanceof Promise) {
        result = await result.catch((e) => {
          if (throwOnError) {
            throw e
          }

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
      container,
    }: FlowRunOptions = {
      throwOnError: true,
      resultFrom: defaultResult,
    }
  ) => {
    resultFrom ??= defaultResult
    throwOnError ??= true

    const context = {
      ...outerContext,
      __type: MedusaContextType as Context["__type"],
    }

    context.transactionId ??= ulid()
    context.eventGroupId ??= ulid()

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
      { throwOnError, resultFrom, container },
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
      container,
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
      __type: MedusaContextType as Context["__type"],
    }

    context.eventGroupId ??= ulid()

    return await originalExecution(
      originalRegisterStepSuccess,
      { throwOnError, resultFrom, container },
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
      container,
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
      __type: MedusaContextType as Context["__type"],
    }

    context.eventGroupId ??= ulid()

    return await originalExecution(
      originalRegisterStepFailure,
      { throwOnError, resultFrom, container },
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
      container,
    }: FlowCancelOptions = {
      throwOnError: true,
    }
  ) => {
    throwOnError ??= true

    const context = {
      ...outerContext,
      transactionId,
      __type: MedusaContextType as Context["__type"],
    }

    context.eventGroupId ??= ulid()

    return await originalExecution(
      originalCancel,
      {
        throwOnError,
        resultFrom: undefined,
        isCancel: true,
        container,
      },
      transaction ?? transactionId!,
      undefined,
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
    // TODO: rm when all usage have been migrated
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
    >
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
    >
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
    >
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
    args?: FlowCancelOptions
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
  return exportedWorkflow as MainExportedWorkflow<TData, TResult>
}

function attachOnFinishReleaseEvents(
  events: DistributedTransactionEvents = {},
  eventGroupId: string,
  flow: LocalWorkflow
) {
  const onFinish = events.onFinish

  const wrappedOnFinish = async (args: {
    transaction: DistributedTransactionType
    result?: unknown
    errors?: unknown[]
  }) => {
    await onFinish?.(args)

    const eventBusService = (flow.container as MedusaContainer).resolve(
      ModuleRegistrationName.EVENT_BUS,
      { allowUnregistered: true }
    )

    if (!eventBusService || !eventGroupId) {
      return
    }

    const logger =
      (flow.container as MedusaContainer).resolve(
        ContainerRegistrationKeys.LOGGER,
        { allowUnregistered: true }
      ) || console

    const { transaction } = args
    const failedStatus = [TransactionState.FAILED, TransactionState.REVERTED]

    if (failedStatus.includes(transaction.getState())) {
      return await eventBusService
        .clearGroupedEvents(eventGroupId)
        .catch(() => {
          logger.warn(
            `Failed to clear events for eventGroupId - ${eventGroupId}`
          )
        })
    }

    await eventBusService.releaseGroupedEvents(eventGroupId).catch((e) => {
      logger.error(
        `Failed to release grouped events for eventGroupId: ${eventGroupId}`,
        e
      )

      return flow.cancel(transaction)
    })
  }

  events.onFinish = wrappedOnFinish
}
