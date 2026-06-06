import {
  DistributedTransaction,
  DistributedTransactionEvents,
  DistributedTransactionType,
  TransactionHandlerType,
  TransactionStep,
  WorkflowScheduler,
} from "@zjedene-medusa/framework/orchestration"
import {
  ContainerLike,
  Context,
  Logger,
  MedusaContainer,
} from "@zjedene-medusa/framework/types"
import {
  isString,
  MedusaError,
  promiseAll,
  TransactionState,
} from "@zjedene-medusa/framework/utils"
import {
  type FlowRunOptions,
  MedusaWorkflow,
  resolveValue,
  ReturnWorkflow,
} from "@zjedene-medusa/framework/workflows-sdk"
import { WorkflowOrchestratorCancelOptions } from "@types"
import { ulid } from "ulid"
import { InMemoryDistributedTransactionStorage } from "../utils"

export type WorkflowOrchestratorRunOptions<T> = Omit<
  FlowRunOptions<T>,
  "container"
> & {
  transactionId?: string
  runId?: string
  container?: ContainerLike
}

type RegisterStepSuccessOptions<T> = Omit<
  WorkflowOrchestratorRunOptions<T>,
  "transactionId" | "input"
>

type RegisterStepFailureOptions<T> = Omit<
  WorkflowOrchestratorRunOptions<T>,
  "transactionId" | "input"
> & {
  forcePermanentFailure?: boolean
}

type RetryStepOptions<T> = Omit<
  WorkflowOrchestratorRunOptions<T>,
  "transactionId" | "input" | "resultFrom"
>

type IdempotencyKeyParts = {
  workflowId: string
  transactionId: string
  stepId: string
  action: "invoke" | "compensate"
}

type NotifyOptions = {
  eventType: keyof DistributedTransactionEvents
  workflowId: string
  transactionId?: string
  state?: TransactionState
  step?: TransactionStep
  response?: unknown
  result?: unknown
  errors?: unknown[]
}

type WorkflowId = string
type TransactionId = string

type SubscriberHandler = {
  (input: NotifyOptions): void
} & {
  _id?: string
}

type SubscribeOptions = {
  workflowId: string
  transactionId?: string
  subscriber: SubscriberHandler
  subscriberId?: string
}

type UnsubscribeOptions = {
  workflowId: string
  transactionId?: string
  subscriberOrId: string | SubscriberHandler
}

type TransactionSubscribers = Map<TransactionId, SubscriberHandler[]>
type Subscribers = Map<WorkflowId, TransactionSubscribers>

const AnySubscriber = "any"

export class WorkflowOrchestratorService {
  private static subscribers: Subscribers = new Map()
  private container_: MedusaContainer
  private inMemoryDistributedTransactionStorage_: InMemoryDistributedTransactionStorage
  readonly #logger: Logger

  constructor({
    inMemoryDistributedTransactionStorage,
    sharedContainer,
  }: {
    inMemoryDistributedTransactionStorage: InMemoryDistributedTransactionStorage
    sharedContainer: MedusaContainer
  }) {
    this.container_ = sharedContainer
    this.inMemoryDistributedTransactionStorage_ =
      inMemoryDistributedTransactionStorage

    this.#logger =
      this.container_.resolve("logger", { allowUnregistered: true }) ?? console

    inMemoryDistributedTransactionStorage.setWorkflowOrchestratorService(this)
    DistributedTransaction.setStorage(inMemoryDistributedTransactionStorage)
    WorkflowScheduler.setStorage(inMemoryDistributedTransactionStorage)
  }

  async onApplicationStart() {
    await this.inMemoryDistributedTransactionStorage_.onApplicationStart()
  }

  async onApplicationShutdown() {
    await this.inMemoryDistributedTransactionStorage_.onApplicationShutdown()
  }

  private async triggerParentStep(transaction, result, errors) {
    const metadata = transaction.flow.metadata
    const { parentStepIdempotencyKey, cancelingFromParentStep } = metadata ?? {}

    if (cancelingFromParentStep) {
      /**
       * If the sub workflow is cancelling from a parent step, we don't want to trigger the parent
       * step.
       */
      return
    }

    if (parentStepIdempotencyKey) {
      const hasFailed = [
        TransactionState.REVERTED,
        TransactionState.FAILED,
      ].includes(transaction.flow.state)

      if (hasFailed) {
        await this.setStepFailure({
          idempotencyKey: parentStepIdempotencyKey,
          stepResponse: errors,
          options: {
            logOnError: true,
          },
        })
      } else {
        await this.setStepSuccess({
          idempotencyKey: parentStepIdempotencyKey,
          stepResponse: result,
          options: {
            logOnError: true,
          },
        })
      }
    }
  }

  async run<T = unknown>(
    workflowIdOrWorkflow: string | ReturnWorkflow<any, any, any>,
    options?: WorkflowOrchestratorRunOptions<T>
  ) {
    const {
      input,
      transactionId,
      resultFrom,
      logOnError,
      events: eventHandlers,
      container,
    } = options ?? {}

    let { throwOnError, context } = options ?? {}
    throwOnError ??= true
    context ??= {}
    context.transactionId = transactionId ?? "auto-" + ulid()

    const workflowId = isString(workflowIdOrWorkflow)
      ? workflowIdOrWorkflow
      : workflowIdOrWorkflow.getName()

    if (!workflowId) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Workflow ID is required`
      )
    }

    const events: FlowRunOptions["events"] = this.buildWorkflowEvents({
      customEventHandlers: eventHandlers,
      workflowId,
      transactionId: context.transactionId,
    })

    const exportedWorkflow: any = MedusaWorkflow.getWorkflow(workflowId)
    if (!exportedWorkflow) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Workflow with id "${workflowId}" not found.`
      )
    }

    const ret = await exportedWorkflow.run({
      input,
      throwOnError: false,
      logOnError,
      resultFrom,
      context,
      events,
      container: container ?? this.container_,
    })

    const hasFinished = ret.transaction.hasFinished()
    const metadata = ret.transaction.getFlow().metadata
    const { parentStepIdempotencyKey } = metadata ?? {}
    const hasFailed = [
      TransactionState.REVERTED,
      TransactionState.FAILED,
    ].includes(ret.transaction.getFlow().state)

    const acknowledgement = {
      transactionId: context.transactionId,
      workflowId: workflowId,
      parentStepIdempotencyKey,
      hasFinished,
      hasFailed,
    }

    if (ret.transaction.hasFinished()) {
      const { result, errors } = ret

      this.notify({
        eventType: "onFinish",
        workflowId,
        transactionId: context.transactionId,
        state: ret.transaction.getFlow().state as TransactionState,
        result,
        errors,
      })

      await this.triggerParentStep(ret.transaction, result, errors)
    }

    if (throwOnError && (ret.thrownError || ret.errors?.length)) {
      if (ret.thrownError) {
        throw ret.thrownError
      }

      throw ret.errors[0].error
    }

    return { acknowledgement, ...ret }
  }

  async cancel(
    workflowIdOrWorkflow: string | ReturnWorkflow<any, any, any>,
    options?: WorkflowOrchestratorCancelOptions
  ) {
    const {
      transactionId,
      logOnError,
      events: eventHandlers,
      container,
    } = options ?? {}

    let { throwOnError, context } = options ?? {}

    throwOnError ??= true
    context ??= {}

    const workflowId = isString(workflowIdOrWorkflow)
      ? workflowIdOrWorkflow
      : workflowIdOrWorkflow.getName()

    if (!workflowId) {
      throw new Error("Workflow ID is required")
    }

    if (!transactionId) {
      throw new Error("Transaction ID is required")
    }

    const events: FlowRunOptions["events"] = this.buildWorkflowEvents({
      customEventHandlers: eventHandlers,
      workflowId,
      transactionId: transactionId,
    })

    const exportedWorkflow = MedusaWorkflow.getWorkflow(workflowId)
    if (!exportedWorkflow) {
      throw new Error(`Workflow with id "${workflowId}" not found.`)
    }

    const transaction = await this.getRunningTransaction(
      workflowId,
      transactionId,
      {
        ...options,
        isCancelling: true,
      }
    )

    if (!transaction) {
      if (!throwOnError) {
        return {
          acknowledgement: {
            transactionId,
            workflowId,
            exists: false,
          },
        }
      }
      throw new Error("Transaction not found")
    }

    const ret = await exportedWorkflow.cancel({
      transaction,
      throwOnError: false,
      logOnError,
      context,
      events,
      container: container ?? this.container_,
    })

    const hasFinished = ret.transaction.hasFinished()
    const metadata = ret.transaction.getFlow().metadata
    const { parentStepIdempotencyKey } = metadata ?? {}

    const transactionState = ret.transaction.getFlow().state
    const hasFailed = [TransactionState.FAILED].includes(transactionState)

    const acknowledgement = {
      transactionId: transaction.transactionId,
      workflowId: workflowId,
      parentStepIdempotencyKey,
      hasFinished,
      hasFailed,
      exists: true,
    }

    if (hasFinished) {
      const { result, errors } = ret

      this.notify({
        eventType: "onFinish",
        workflowId,
        transactionId: transaction.transactionId,
        state: transactionState as TransactionState,
        result,
        errors,
      })

      await this.triggerParentStep(ret.transaction, result, errors)
    }

    if (throwOnError && (ret.thrownError || ret.errors?.length)) {
      if (ret.thrownError) {
        throw ret.thrownError
      }

      throw ret.errors[0].error
    }

    return { acknowledgement, ...ret }
  }

  async getRunningTransaction(
    workflowId: string,
    transactionId: string,
    context?: Context
  ): Promise<DistributedTransactionType> {
    if (!workflowId) {
      throw new Error("Workflow ID is required")
    }

    if (!transactionId) {
      throw new Error("TransactionId ID is required")
    }

    context ??= {}
    context.transactionId ??= transactionId

    const exportedWorkflow: any = MedusaWorkflow.getWorkflow(workflowId)
    if (!exportedWorkflow) {
      throw new Error(`Workflow with id "${workflowId}" not found.`)
    }

    const flow = exportedWorkflow()

    const transaction = await flow.getRunningTransaction(transactionId, context)

    return transaction
  }

  async retryStep<T = unknown>({
    idempotencyKey,
    options,
  }: {
    idempotencyKey: string | IdempotencyKeyParts
    options?: RetryStepOptions<T>
  }) {
    const {
      context,
      logOnError,
      container,
      events: eventHandlers,
    } = options ?? {}

    let { throwOnError } = options ?? {}
    throwOnError ??= true

    const [idempotencyKey_, { workflowId, transactionId }] =
      this.buildIdempotencyKeyAndParts(idempotencyKey)

    const exportedWorkflow: any = MedusaWorkflow.getWorkflow(workflowId)
    if (!exportedWorkflow) {
      throw new Error(`Workflow with id "${workflowId}" not found.`)
    }

    const events = this.buildWorkflowEvents({
      customEventHandlers: eventHandlers,
      transactionId,
      workflowId,
    })

    const ret = await exportedWorkflow.retryStep({
      idempotencyKey: idempotencyKey_,
      context,
      throwOnError: false,
      logOnError,
      events,
      container: container ?? this.container_,
    })

    if (ret.transaction.hasFinished()) {
      const { result, errors } = ret

      this.notify({
        eventType: "onFinish",
        workflowId,
        transactionId,
        state: ret.transaction.getFlow().state as TransactionState,
        result,
        errors,
      })

      await this.triggerParentStep(ret.transaction, result, errors)
    }

    if (throwOnError && (ret.thrownError || ret.errors?.length)) {
      if (ret.thrownError) {
        throw ret.thrownError
      }

      throw ret.errors[0].error
    }

    return ret
  }

  async setStepSuccess<T = unknown>({
    idempotencyKey,
    stepResponse,
    options,
  }: {
    idempotencyKey: string | IdempotencyKeyParts
    stepResponse: unknown
    options?: RegisterStepSuccessOptions<T>
  }) {
    const {
      context,
      logOnError,
      resultFrom,
      container,
      events: eventHandlers,
    } = options ?? {}

    let { throwOnError } = options ?? {}
    throwOnError ??= true

    const [idempotencyKey_, { workflowId, transactionId }] =
      this.buildIdempotencyKeyAndParts(idempotencyKey)

    const exportedWorkflow: any = MedusaWorkflow.getWorkflow(workflowId)
    if (!exportedWorkflow) {
      throw new Error(`Workflow with id "${workflowId}" not found.`)
    }

    const events = this.buildWorkflowEvents({
      customEventHandlers: eventHandlers,
      transactionId,
      workflowId,
    })

    const ret = await exportedWorkflow.registerStepSuccess({
      idempotencyKey: idempotencyKey_,
      context,
      resultFrom,
      throwOnError: false,
      logOnError,
      events,
      response: stepResponse,
      container: container ?? this.container_,
    })

    if (ret.transaction.hasFinished()) {
      const { result, errors } = ret

      this.notify({
        eventType: "onFinish",
        workflowId,
        transactionId,
        state: ret.transaction.getFlow().state as TransactionState,
        result,
        errors,
      })

      await this.triggerParentStep(ret.transaction, result, errors)
    }

    if (throwOnError && (ret.thrownError || ret.errors?.length)) {
      if (ret.thrownError) {
        throw ret.thrownError
      }

      throw ret.errors[0].error
    }

    return ret
  }

  async setStepFailure<T = unknown>({
    idempotencyKey,
    stepResponse,
    options,
  }: {
    idempotencyKey: string | IdempotencyKeyParts
    stepResponse: unknown
    options?: RegisterStepFailureOptions<T>
  }) {
    const {
      context,
      logOnError,
      resultFrom,
      container,
      events: eventHandlers,
      forcePermanentFailure = false,
    } = options ?? {}

    let { throwOnError } = options ?? {}
    throwOnError ??= true

    const [idempotencyKey_, { workflowId, transactionId }] =
      this.buildIdempotencyKeyAndParts(idempotencyKey)

    const exportedWorkflow: any = MedusaWorkflow.getWorkflow(workflowId)
    if (!exportedWorkflow) {
      throw new Error(`Workflow with id "${workflowId}" not found.`)
    }

    const events = this.buildWorkflowEvents({
      customEventHandlers: eventHandlers,
      transactionId,
      workflowId,
    })

    const ret = await exportedWorkflow.registerStepFailure({
      idempotencyKey: idempotencyKey_,
      context,
      resultFrom,
      throwOnError: false,
      logOnError,
      events,
      forcePermanentFailure,
      response: stepResponse,
      container: container ?? this.container_,
    })

    if (ret.transaction.hasFinished()) {
      const { result, errors } = ret

      this.notify({
        eventType: "onFinish",
        workflowId,
        transactionId,
        state: ret.transaction.getFlow().state as TransactionState,
        result,
        errors,
      })

      await this.triggerParentStep(ret.transaction, result, errors)
    }

    if (throwOnError && (ret.thrownError || ret.errors?.length)) {
      if (ret.thrownError) {
        throw ret.thrownError
      }

      throw ret.errors[0].error
    }

    return ret
  }

  subscribe({
    workflowId,
    transactionId,
    subscriber,
    subscriberId,
  }: SubscribeOptions) {
    subscriber._id = subscriberId
    const subscribers =
      WorkflowOrchestratorService.subscribers.get(workflowId) ?? new Map()

    const handlerIndex = (handlers) => {
      return handlers.findIndex(
        (s) => s === subscriber || s._id === subscriberId
      )
    }

    if (transactionId) {
      const transactionSubscribers = subscribers.get(transactionId) ?? []
      const subscriberIndex = handlerIndex(transactionSubscribers)
      if (subscriberIndex !== -1) {
        transactionSubscribers.splice(subscriberIndex, 1)
      }

      transactionSubscribers.push(subscriber)
      subscribers.set(transactionId, transactionSubscribers)
      WorkflowOrchestratorService.subscribers.set(workflowId, subscribers)
      return
    }

    const workflowSubscribers = subscribers.get(AnySubscriber) ?? []
    const subscriberIndex = handlerIndex(workflowSubscribers)
    if (subscriberIndex !== -1) {
      workflowSubscribers.splice(subscriberIndex, 1)
    }

    workflowSubscribers.push(subscriber)
    subscribers.set(AnySubscriber, workflowSubscribers)
    WorkflowOrchestratorService.subscribers.set(workflowId, subscribers)
  }

  unsubscribe({
    workflowId,
    transactionId,
    subscriberOrId,
  }: UnsubscribeOptions) {
    const subscribers =
      WorkflowOrchestratorService.subscribers.get(workflowId) ?? new Map()

    const filterSubscribers = (handlers: SubscriberHandler[]) => {
      return handlers.filter((handler) => {
        return handler._id
          ? handler._id !== (subscriberOrId as string)
          : handler !== (subscriberOrId as SubscriberHandler)
      })
    }

    if (transactionId) {
      const transactionSubscribers = subscribers.get(transactionId) ?? []
      const newTransactionSubscribers = filterSubscribers(
        transactionSubscribers
      )
      if (newTransactionSubscribers.length) {
        subscribers.set(transactionId, newTransactionSubscribers)
      } else {
        subscribers.delete(transactionId)
      }
      WorkflowOrchestratorService.subscribers.set(workflowId, subscribers)
      return
    }

    const workflowSubscribers = subscribers.get(AnySubscriber) ?? []
    const newWorkflowSubscribers = filterSubscribers(workflowSubscribers)
    if (newWorkflowSubscribers.length) {
      subscribers.set(AnySubscriber, newWorkflowSubscribers)
    } else {
      subscribers.delete(AnySubscriber)
    }
    WorkflowOrchestratorService.subscribers.set(workflowId, subscribers)
  }

  private notify(options: NotifyOptions) {
    // Process subscribers asynchronously to avoid blocking workflow execution
    setImmediate(() => this.processSubscriberNotifications(options))
  }

  private async processSubscriberNotifications(options: NotifyOptions) {
    const { workflowId, transactionId, eventType } = options
    const subscribers: TransactionSubscribers =
      WorkflowOrchestratorService.subscribers.get(workflowId) ?? new Map()

    const notifySubscribersAsync = async (handlers: SubscriberHandler[]) => {
      const promises = handlers.map(async (handler) => {
        try {
          const result = handler(options) as void | Promise<any>
          if (result && typeof result === "object" && "then" in result) {
            await (result as Promise<any>)
          }
        } catch (error) {
          this.#logger.error(`Subscriber error: ${error}`)
        }
      })

      await promiseAll(promises)
    }

    const tasks: Promise<void>[] = []

    if (transactionId) {
      const transactionSubscribers = subscribers.get(transactionId) ?? []
      if (transactionSubscribers.length > 0) {
        tasks.push(notifySubscribersAsync(transactionSubscribers))
      }

      if (eventType === "onFinish") {
        subscribers.delete(transactionId)
      }
    }

    const workflowSubscribers = subscribers.get(AnySubscriber) ?? []
    if (workflowSubscribers.length > 0) {
      tasks.push(notifySubscribersAsync(workflowSubscribers))
    }

    await promiseAll(tasks)
  }

  private buildWorkflowEvents({
    customEventHandlers,
    workflowId,
    transactionId,
  }): DistributedTransactionEvents {
    const notify = ({
      eventType,
      step,
      result,
      response,
      errors,
      state,
    }: {
      eventType: keyof DistributedTransactionEvents
      step?: TransactionStep
      response?: unknown
      result?: unknown
      errors?: unknown[]
      state?: TransactionState
    }) => {
      this.notify({
        workflowId,
        transactionId,
        eventType,
        response,
        step,
        result,
        errors,
        state,
      })
    }

    return {
      onTimeout: ({ transaction }) => {
        customEventHandlers?.onTimeout?.({ transaction })
        notify({ eventType: "onTimeout" })
      },

      onBegin: ({ transaction }) => {
        customEventHandlers?.onBegin?.({ transaction })
        notify({ eventType: "onBegin" })
      },
      onResume: ({ transaction }) => {
        customEventHandlers?.onResume?.({ transaction })
        notify({ eventType: "onResume" })
      },
      onCompensateBegin: ({ transaction }) => {
        customEventHandlers?.onCompensateBegin?.({ transaction })
        notify({ eventType: "onCompensateBegin" })
      },
      onFinish: ({ transaction, result, errors }) => {
        customEventHandlers?.onFinish?.({ transaction, result, errors })
      },

      onStepBegin: ({ step, transaction }) => {
        customEventHandlers?.onStepBegin?.({ step, transaction })

        notify({ eventType: "onStepBegin", step })
      },
      onStepSuccess: async ({ step, transaction }) => {
        const stepName = step.definition.action!
        const response = await resolveValue(
          transaction.getContext().invoke[stepName],
          transaction
        )
        customEventHandlers?.onStepSuccess?.({ step, transaction, response })

        notify({ eventType: "onStepSuccess", step, response })
      },
      onStepFailure: ({ step, transaction }) => {
        const stepName = step.definition.action!
        const errors = transaction
          .getErrors(TransactionHandlerType.INVOKE)
          .filter((err) => err.action === stepName)

        customEventHandlers?.onStepFailure?.({ step, transaction, errors })

        notify({ eventType: "onStepFailure", step, errors })
      },
      onStepAwaiting: ({ step, transaction }) => {
        customEventHandlers?.onStepAwaiting?.({ step, transaction })

        notify({ eventType: "onStepAwaiting", step })
      },

      onCompensateStepSuccess: ({ step, transaction }) => {
        const stepName = step.definition.action!
        const response = transaction.getContext().compensate[stepName]
        customEventHandlers?.onCompensateStepSuccess?.({
          step,
          transaction,
          response,
        })

        notify({ eventType: "onCompensateStepSuccess", step, response })
      },
      onCompensateStepFailure: ({ step, transaction }) => {
        const stepName = step.definition.action!
        const errors = transaction
          .getErrors(TransactionHandlerType.COMPENSATE)
          .filter((err) => err.action === stepName)

        customEventHandlers?.onStepFailure?.({ step, transaction, errors })

        notify({ eventType: "onCompensateStepFailure", step, errors })
      },
    }
  }

  private buildIdempotencyKeyAndParts(
    idempotencyKey: string | IdempotencyKeyParts
  ): [string, IdempotencyKeyParts] {
    const parts: IdempotencyKeyParts = {
      workflowId: "",
      transactionId: "",
      stepId: "",
      action: "invoke",
    }
    let idempotencyKey_ = idempotencyKey as string

    const setParts = (workflowId, transactionId, stepId, action) => {
      parts.workflowId = workflowId
      parts.transactionId = transactionId
      parts.stepId = stepId
      parts.action = action
    }

    if (!isString(idempotencyKey)) {
      const { workflowId, transactionId, stepId, action } =
        idempotencyKey as IdempotencyKeyParts
      idempotencyKey_ = [workflowId, transactionId, stepId, action].join(":")
      setParts(workflowId, transactionId, stepId, action)
    } else {
      const [workflowId, transactionId, stepId, action] =
        idempotencyKey_.split(":")
      setParts(workflowId, transactionId, stepId, action)
    }

    return [idempotencyKey_, parts]
  }
}
