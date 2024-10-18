import {
  Context,
  IEventBusModuleService,
  Logger,
  MedusaContainer,
} from "@medusajs/types"
import {
  DistributedTransactionEvents,
  DistributedTransactionType,
  LocalWorkflow,
  TransactionHandlerType,
  TransactionState,
} from "@medusajs/orchestration"
import {
  FlowCancelOptions,
  FlowRegisterStepFailureOptions,
  FlowRegisterStepSuccessOptions,
  FlowRunOptions,
  WorkflowResult,
} from "../helper"
import {
  ContainerRegistrationKeys,
  isPresent,
  MedusaContextType,
  Modules,
} from "@medusajs/utils"
import { ulid } from "ulid"
import { EOL } from "os"
import { resolveValue } from "../utils/composer"
import { container } from "@medusajs/framework"
import { MedusaModule } from "@medusajs/modules-sdk"

export type LocalWorkflowExecutionOptions = {
  defaultResult?: string | Symbol
  dataPreparation?: (data: any) => Promise<unknown>
  options?: {
    wrappedInput?: boolean
    sourcePath?: string
  }
}

export class WorkflowExporter<TData = unknown, TResult = unknown> {
  #localWorkflow: LocalWorkflow
  #localWorkflowExecutionOptions: LocalWorkflowExecutionOptions
  #executionWrapper: {
    run: LocalWorkflow["run"]
    registerStepSuccess: LocalWorkflow["registerStepSuccess"]
    registerStepFailure: LocalWorkflow["registerStepFailure"]
    cancel: LocalWorkflow["cancel"]
  }

  constructor({
    workflowId,
    options,
  }: {
    workflowId: string
    options: LocalWorkflowExecutionOptions
  }) {
    this.#localWorkflow = new LocalWorkflow(workflowId, container)
    this.#localWorkflowExecutionOptions = options
    this.#executionWrapper = {
      run: this.#localWorkflow.run.bind(this.#localWorkflow),
      registerStepSuccess: this.#localWorkflow.registerStepSuccess.bind(
        this.#localWorkflow
      ),
      registerStepFailure: this.#localWorkflow.registerStepFailure.bind(
        this.#localWorkflow
      ),
      cancel: this.#localWorkflow.cancel.bind(this.#localWorkflow),
    }
  }

  async #executeAction(
    method: Function,
    {
      throwOnError,
      logOnError = false,
      resultFrom,
      isCancel = false,
      container,
    },
    transactionOrIdOrIdempotencyKey: DistributedTransactionType | string,
    input: unknown,
    context: Context,
    events: DistributedTransactionEvents | undefined = {}
  ) {
    const flow = this.#localWorkflow

    if (!container) {
      const container_ = flow.container as MedusaContainer

      if (!container_ || !isPresent(container_?.registrations)) {
        container = MedusaModule.getLoadedModules().map(
          (mod) => Object.values(mod)[0]
        )
      }
    }

    if (container) {
      flow.container = container
    }

    const { eventGroupId, parentStepIdempotencyKey } = context

    this.#attachOnFinishReleaseEvents(events, flow, { logOnError })

    const flowMetadata = {
      eventGroupId,
      parentStepIdempotencyKey,
      sourcePath: this.#localWorkflowExecutionOptions.options?.sourcePath,
    }

    const args = [
      transactionOrIdOrIdempotencyKey,
      input,
      context,
      events,
      flowMetadata,
    ]
    const transaction = (await method.apply(
      method,
      args
    )) as DistributedTransactionType

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
    if (this.#localWorkflowExecutionOptions.options?.wrappedInput) {
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

  #attachOnFinishReleaseEvents(
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
        const TERMINAL_SIZE = process.stdout?.columns ?? 60
        const separator = new Array(TERMINAL_SIZE).join("-")

        const workflowName = transaction.getFlow().modelId
        const allWorkflowErrors = transaction
          .getErrors()
          .map(
            (err) =>
              `${workflowName}:${err?.action}:${err?.handlerType} - ${err?.error?.message}${EOL}${err?.error?.stack}`
          )
          .join(EOL + separator + EOL)

        if (allWorkflowErrors) {
          logger.error(allWorkflowErrors)
        }
      }

      await onFinish?.(args)

      const eventBusService = (
        flow.container as MedusaContainer
      ).resolve<IEventBusModuleService>(Modules.EVENT_BUS, {
        allowUnregistered: true,
      })

      if (!eventBusService || !flowEventGroupId) {
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

  async run<TDataOverride = undefined, TResultOverride = undefined>({
    input,
    context: outerContext,
    throwOnError,
    logOnError,
    resultFrom,
    events,
    container,
  }: FlowRunOptions<
    TDataOverride extends undefined ? TData : TDataOverride
  > = {}): Promise<
    WorkflowResult<
      TResultOverride extends undefined ? TResult : TResultOverride
    >
  > {
    const { defaultResult, dataPreparation } =
      this.#localWorkflowExecutionOptions

    resultFrom ??= defaultResult
    throwOnError ??= true
    logOnError ??= false

    const context = {
      ...outerContext,
      __type: MedusaContextType as Context["__type"],
    }

    context.transactionId ??= ulid()
    context.eventGroupId ??= ulid()

    if (typeof dataPreparation === "function") {
      try {
        const copyInput = input ? JSON.parse(JSON.stringify(input)) : input
        input = (await dataPreparation(copyInput)) as any
      } catch (err) {
        if (throwOnError) {
          throw new Error(
            `Data preparation failed: ${err.message}${EOL}${err.stack}`
          )
        }
        return {
          errors: [err],
        } as WorkflowResult<any>
      }
    }

    return await this.#executeAction(
      this.#executionWrapper.run,
      {
        throwOnError,
        resultFrom,
        logOnError,
        container,
      },
      context.transactionId,
      input,
      context,
      events
    )
  }

  async registerStepSuccess(
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
  ) {
    const { defaultResult } = this.#localWorkflowExecutionOptions

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

    return await this.#executeAction(
      this.#executionWrapper.registerStepSuccess,
      {
        throwOnError,
        resultFrom,
        logOnError,
        container,
      },
      idempotencyKey,
      response,
      context,
      events
    )
  }

  async registerStepFailure(
    {
      response,
      idempotencyKey,
      context: outerContext,
      throwOnError,
      logOnError,
      resultFrom,
      events,
      container,
    }: FlowRegisterStepFailureOptions = {
      idempotencyKey: "",
    }
  ) {
    const { defaultResult } = this.#localWorkflowExecutionOptions

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

    return await this.#executeAction(
      this.#executionWrapper.registerStepFailure,
      {
        throwOnError,
        resultFrom,
        logOnError,
        container,
      },
      idempotencyKey,
      response,
      context,
      events
    )
  }

  async cancel({
    transaction,
    transactionId,
    context: outerContext,
    throwOnError,
    logOnError,
    events,
    container,
  }: FlowCancelOptions = {}) {
    throwOnError ??= true
    logOnError ??= false

    const context = {
      ...outerContext,
      transactionId,
      __type: MedusaContextType as Context["__type"],
    }

    context.eventGroupId ??= ulid()

    return await this.#executeAction(
      this.#executionWrapper.cancel,
      {
        throwOnError,
        resultFrom: undefined,
        isCancel: true,
        logOnError,
        container,
      },
      transaction ?? transactionId!,
      undefined,
      context,
      events
    )
  }
}
