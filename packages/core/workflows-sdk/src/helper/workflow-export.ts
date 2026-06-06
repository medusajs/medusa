import { MedusaModule } from "@zjedene-medusa/modules-sdk"
import {
  DistributedTransactionEvents,
  DistributedTransactionType,
  LocalWorkflow,
  TransactionState,
} from "@zjedene-medusa/orchestration"
import {
  Context,
  IEventBusModuleService,
  LoadedModule,
  Logger,
  MedusaContainer,
} from "@zjedene-medusa/types"
import {
  ContainerRegistrationKeys,
  isPresent,
  MedusaContextType,
  Modules,
  TransactionHandlerType,
} from "@zjedene-medusa/utils"
import { EOL } from "os"
import { ulid } from "ulid"
import { MedusaWorkflow } from "../medusa-workflow"
import { resolveValue } from "../utils/composer/helpers/resolve-value"
import {
  ExportedWorkflow,
  FlowCancelOptions,
  FlowRegisterStepFailureOptions,
  FlowRegisterStepSuccessOptions,
  FlowRetryStepOptions,
  FlowRunOptions,
  MainExportedWorkflow,
  WorkflowResult,
} from "./type"

// Cache for loaded modules to avoid repeated traversal
let cachedLoadedModules: LoadedModule[] | null = null

function getCachedLoadedModules(): LoadedModule[] {
  if (!cachedLoadedModules) {
    cachedLoadedModules = MedusaModule.getLoadedModules().map(
      (mod) => Object.values(mod)[0]
    )
  }
  return cachedLoadedModules
}

function createContextualWorkflowRunner<
  TData = unknown,
  TResult = unknown,
  TDataOverride = undefined,
  TResultOverride = undefined
>({
  workflowId,
  defaultResult,
  options,
  container,
}: {
  workflowId: string
  defaultResult?: string | Symbol
  options?: {
    wrappedInput?: boolean
    sourcePath?: string
  }
  container?: LoadedModule[] | MedusaContainer
}): Omit<
  LocalWorkflow,
  "run" | "registerStepSuccess" | "registerStepFailure" | "cancel" | "retryStep"
> &
  ExportedWorkflow<TData, TResult, TDataOverride, TResultOverride> {
  const flow = new LocalWorkflow(workflowId, container!)

  const originalRun = flow.run.bind(flow)
  const originalRegisterStepSuccess = flow.registerStepSuccess.bind(flow)
  const originalRegisterStepFailure = flow.registerStepFailure.bind(flow)
  const originalCancel = flow.cancel.bind(flow)
  const originalRetryStep = flow.retryStep.bind(flow)

  const originalExecution = async (
    method,
    {
      throwOnError,
      logOnError = false,
      resultFrom,
      isCancel = false,
      container: executionContainer,
      forcePermanentFailure,
    }: {
      throwOnError?: boolean
      logOnError?: boolean
      resultFrom?: string | Symbol
      isCancel?: boolean
      container?: LoadedModule[] | MedusaContainer
      forcePermanentFailure?: boolean
    },
    transactionOrIdOrIdempotencyKey: DistributedTransactionType | string,
    input: unknown,
    context: Context,
    events: DistributedTransactionEvents | undefined = {}
  ) => {
    if (!executionContainer) {
      const container_ = flow.container as MedusaContainer

      if (!container_ || !isPresent(container_?.registrations)) {
        executionContainer = getCachedLoadedModules()
      }
    }

    if (executionContainer) {
      flow.container = executionContainer
    }

    const {
      eventGroupId,
      parentStepIdempotencyKey,
      preventReleaseEvents,
      cancelingFromParentStep,
    } = context

    if (!preventReleaseEvents) {
      attachOnFinishReleaseEvents(events, flow, { logOnError })
    }

    const flowMetadata = {
      eventGroupId,
      parentStepIdempotencyKey,
      sourcePath: options?.sourcePath,
      preventReleaseEvents,
      cancelingFromParentStep,
    }

    context.isCancelling = isCancel

    const args = [transactionOrIdOrIdempotencyKey, input, context, events]

    if (method === originalRegisterStepFailure) {
      // Only available on registerStepFailure
      args.push(forcePermanentFailure)
    } else {
      args.push(flowMetadata)
    }

    const transaction = (await method.apply(
      method,
      args
    )) as DistributedTransactionType

    let errors = transaction.getErrors(TransactionHandlerType.INVOKE)

    const failedStatus = [TransactionState.FAILED, TransactionState.REVERTED]
    const isCancelled =
      isCancel && transaction.getState() === TransactionState.REVERTED

    const isRegisterStepFailure =
      method === originalRegisterStepFailure &&
      transaction.getState() === TransactionState.REVERTED

    let thrownError = null

    if (
      failedStatus.includes(transaction.getState()) &&
      !isCancelled &&
      !isRegisterStepFailure
    ) {
      const firstError = errors?.[0]?.error ?? new Error("Unknown error")

      thrownError = firstError

      if (throwOnError) {
        throw firstError
      }
    }

    let result
    if (options?.wrappedInput) {
      result = resolveValue(resultFrom, transaction.getContext())
      if (result instanceof Promise) {
        result = await result.catch((e) => {
          thrownError = e

          if (throwOnError) {
            throw e
          }

          errors ??= []
          errors.push(e)
        })
      }
    } else {
      result =
        resultFrom && transaction.getContext().invoke?.[resultFrom.toString()]
    }

    return {
      errors,
      transaction,
      result,
      thrownError,
    }
  }

  const newRun = async ({
    input,
    context: outerContext,
    throwOnError,
    logOnError,
    resultFrom,
    events,
    container,
  }: FlowRunOptions = {}) => {
    resultFrom ??= defaultResult
    throwOnError ??= true
    logOnError ??= false

    const context = {
      ...outerContext,
      __type: MedusaContextType as Context["__type"],
    }

    const uniqId = ulid()

    context.transactionId ??= "auto-" + uniqId
    context.eventGroupId ??= uniqId

    return await originalExecution(
      originalRun,
      {
        throwOnError,
        resultFrom,
        container,
        logOnError,
      },
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
      logOnError,
      resultFrom,
      events,
      container,
    }: FlowRegisterStepSuccessOptions = {
      idempotencyKey: "",
    }
  ) => {
    idempotencyKey ??= ""
    resultFrom ??= defaultResult
    throwOnError ??= true
    logOnError ??= false

    const [, transactionId] = idempotencyKey.split(":")
    const context = {
      ...outerContext,
      transactionId,
      __type: MedusaContextType as Context["__type"],
    }

    context.eventGroupId ??= ulid()

    return await originalExecution(
      originalRegisterStepSuccess,
      {
        throwOnError,
        resultFrom,
        container,
        logOnError,
      },
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
      logOnError,
      resultFrom,
      events,
      container,
      forcePermanentFailure,
    }: FlowRegisterStepFailureOptions = {
      idempotencyKey: "",
    }
  ) => {
    idempotencyKey ??= ""
    resultFrom ??= defaultResult
    throwOnError ??= true
    logOnError ??= false

    const [, transactionId] = idempotencyKey.split(":")
    const context = {
      ...outerContext,
      transactionId,
      __type: MedusaContextType as Context["__type"],
    }

    context.eventGroupId ??= ulid()

    return await originalExecution(
      originalRegisterStepFailure,
      {
        throwOnError,
        resultFrom,
        container,
        logOnError,
        forcePermanentFailure,
      },
      idempotencyKey,
      response,
      context,
      events
    )
  }
  flow.registerStepFailure = newRegisterStepFailure as any

  const newRetryStep = async (
    {
      idempotencyKey,
      context: outerContext,
      throwOnError,
      logOnError,
      events,
      container,
    }: FlowRetryStepOptions = {
      idempotencyKey: "",
    }
  ) => {
    idempotencyKey ??= ""
    throwOnError ??= true
    logOnError ??= false

    const [, transactionId] = idempotencyKey.split(":")
    const context = {
      ...outerContext,
      transactionId,
      __type: MedusaContextType as Context["__type"],
    }

    context.eventGroupId ??= ulid()

    return await originalExecution(
      originalRetryStep,
      {
        throwOnError,
        container,
        logOnError,
      },
      idempotencyKey,
      undefined,
      context,
      events
    )
  }
  flow.retryStep = newRetryStep as any

  const newCancel = async ({
    transaction,
    transactionId,
    context: outerContext,
    throwOnError,
    logOnError,
    events,
    container,
  }: FlowCancelOptions = {}) => {
    throwOnError ??= true
    logOnError ??= false

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
        logOnError,
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
  options?: {
    wrappedInput?: boolean
    sourcePath?: string
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
    | "run"
    | "registerStepSuccess"
    | "registerStepFailure"
    | "cancel"
    | "retryStep"
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
      options,
      container,
    })
  }

  const buildRunnerFn = <
    TAction extends
      | "run"
      | "registerStepSuccess"
      | "registerStepFailure"
      | "cancel"
      | "retryStep",
    TDataOverride,
    TResultOverride
  >(
    action:
      | "run"
      | "registerStepSuccess"
      | "registerStepFailure"
      | "cancel"
      | "retryStep",
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

    return await buildRunnerFn<"run", TDataOverride, TResultOverride>(
      "run",
      container
    )(args)
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

    return await buildRunnerFn<
      "registerStepSuccess",
      TDataOverride,
      TResultOverride
    >(
      "registerStepSuccess",
      container
    )(args)
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

    return await buildRunnerFn<
      "registerStepFailure",
      TDataOverride,
      TResultOverride
    >(
      "registerStepFailure",
      container
    )(args)
  }

  exportedWorkflow.retryStep = async <
    TDataOverride = undefined,
    TResultOverride = undefined
  >(
    args?: FlowRetryStepOptions
  ): Promise<WorkflowResult> => {
    const container = args?.container
    delete args?.container
    const inputArgs = { ...args } as FlowRetryStepOptions

    return await buildRunnerFn<"retryStep", TDataOverride, TResultOverride>(
      "retryStep",
      container
    )(inputArgs)
  }

  exportedWorkflow.cancel = async (
    args?: FlowCancelOptions
  ): Promise<WorkflowResult> => {
    const container = args?.container
    delete args?.container

    return await buildRunnerFn<"cancel", unknown, unknown>(
      "cancel",
      container
    )(args)
  }

  MedusaWorkflow.registerWorkflow(workflowId, exportedWorkflow)
  return exportedWorkflow as MainExportedWorkflow<TData, TResult>
}

function attachOnFinishReleaseEvents(
  events: DistributedTransactionEvents = {},
  flow: LocalWorkflow,
  {
    logOnError,
  }: {
    logOnError?: boolean
  } = {}
) {
  const onFinish = events.onFinish

  const wrappedOnFinish = async (args: {
    transaction: DistributedTransactionType
    result?: unknown
    errors?: unknown[]
  }) => {
    const { transaction } = args
    const flowEventGroupId = transaction.getFlow().metadata?.eventGroupId

    const logger =
      (flow.container as MedusaContainer).resolve<Logger>(
        ContainerRegistrationKeys.LOGGER,
        { allowUnregistered: true }
      ) || console

    if (logOnError) {
      const workflowName = transaction.getFlow().modelId
      transaction.getErrors().forEach((err) => {
        const errMsg = err?.error?.message ? " - " + err?.error?.message : ""

        logger.error(
          `${workflowName}:${err?.action}:${err?.handlerType}${errMsg}${EOL}${err?.error?.stack}`
        )
      })
    }

    const eventBusService = (
      flow.container as MedusaContainer
    ).resolve<IEventBusModuleService>(Modules.EVENT_BUS, {
      allowUnregistered: true,
    })

    if (!eventBusService || !flowEventGroupId) {
      await onFinish?.(args)
      return
    }

    const failedStatus = [TransactionState.FAILED, TransactionState.REVERTED]

    if (failedStatus.includes(transaction.getState())) {
      return await eventBusService
        .clearGroupedEvents(flowEventGroupId)
        .catch(() => {
          logger.warn(
            `Failed to clear events for eventGroupId - ${flowEventGroupId}`
          )
        })
    }

    await eventBusService
      .releaseGroupedEvents(flowEventGroupId)
      .then(async () => {
        await onFinish?.(args)
      })
      .catch((e) => {
        logger.error(
          `Failed to release grouped events for eventGroupId: ${flowEventGroupId}`,
          e
        )

        return flow.cancel(transaction)
      })
  }

  events.onFinish = wrappedOnFinish
}
