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
  FlowCancelOptions,
  FlowRunOptions,
  MedusaWorkflow,
  resolveValue,
  ReturnWorkflow,
} from "@zjedene-medusa/framework/workflows-sdk"
import Redis from "ioredis"
import { ulid } from "ulid"
import type { RedisDistributedTransactionStorage } from "../utils"

export type WorkflowOrchestratorRunOptions<T> = Omit<
  FlowRunOptions<T>,
  "container"
> & {
  transactionId?: string
  runId?: string
  container?: ContainerLike
}

export type WorkflowOrchestratorCancelOptions = Omit<
  FlowCancelOptions,
  "transaction" | "transactionId" | "container"
> & {
  transactionId: string
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
  isFlowAsync: boolean
  workflowId: string
  transactionId?: string
  step?: TransactionStep
  response?: unknown
  result?: unknown
  errors?: unknown[]
  state?: TransactionState
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
  private instanceId = ulid()
  protected redisPublisher: Redis
  protected redisSubscriber: Redis
  protected container_: MedusaContainer
  private static subscribers: Subscribers = new Map()

  readonly #logger: Logger

  protected redisDistributedTransactionStorage_: RedisDistributedTransactionStorage

  constructor({
    dataLoaderOnly,
    redisDistributedTransactionStorage,
    redisPublisher,
    redisSubscriber,
    sharedContainer,
  }: {
    dataLoaderOnly: boolean
    redisDistributedTransactionStorage: RedisDistributedTransactionStorage
    workflowOrchestratorService: WorkflowOrchestratorService
    redisPublisher: Redis
    redisSubscriber: Redis
    sharedContainer: MedusaContainer
  }) {
    this.container_ = sharedContainer
    this.redisPublisher = redisPublisher
    this.redisSubscriber = redisSubscriber

    this.#logger =
      this.container_.resolve("logger", { allowUnregistered: true }) ?? console

    redisDistributedTransactionStorage.setWorkflowOrchestratorService(this)

    if (!dataLoaderOnly) {
      DistributedTransaction.setStorage(redisDistributedTransactionStorage)
      WorkflowScheduler.setStorage(redisDistributedTransactionStorage)
    }

    this.redisDistributedTransactionStorage_ =
      redisDistributedTransactionStorage

    this.redisSubscriber.on("message", async (channel, message) => {
      const workflowId = channel.split(":")[1]
      if (!WorkflowOrchestratorService.subscribers.has(workflowId)) return

      try {
        const { instanceId, data } = JSON.parse(message)
        await this.notify(data, false, instanceId)
      } catch (error) {
        this.#logger.error(`Failed to process Redis message: ${error}`)
      }
    })
  }

  async onApplicationShutdown() {
    await this.redisDistributedTransactionStorage_.onApplicationShutdown()
  }

  async onApplicationPrepareShutdown() {
    // eslint-disable-next-line max-len
    await this.redisDistributedTransactionStorage_.onApplicationPrepareShutdown()
  }

  async onApplicationStart() {
    await this.redisDistributedTransactionStorage_.onApplicationStart()
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

    const exportedWorkflow = MedusaWorkflow.getWorkflow(workflowId)
    if (!exportedWorkflow) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Workflow with id "${workflowId}" not found.`
      )
    }

    const { onFinish, ...restEvents } = events
    const originalOnFinishHandler = events.onFinish!

    const ret = await exportedWorkflow.run({
      input,
      throwOnError: false,
      logOnError,
      resultFrom,
      context,
      events: restEvents,
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

    if (hasFinished) {
      const { result, errors } = ret

      await originalOnFinishHandler({
        transaction: ret.transaction,
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

    const exportedWorkflow = MedusaWorkflow.getWorkflow(workflowId)
    if (!exportedWorkflow) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Workflow with id "${workflowId}" not found.`
      )
    }

    const transaction = await this.getRunningTransaction(
      workflowId,
      transactionId,
      { ...options, isCancelling: true }
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

    const events: FlowRunOptions["events"] = this.buildWorkflowEvents({
      customEventHandlers: eventHandlers,
      workflowId,
      transactionId: transactionId,
    })

    const { onFinish, ...restEvents } = events
    const originalOnFinishHandler = events.onFinish!

    const ret = await exportedWorkflow.cancel({
      transaction,
      throwOnError: false,
      logOnError,
      context,
      events: restEvents,
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

      await originalOnFinishHandler({
        transaction: ret.transaction,
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

    const { onFinish, ...restEvents } = events
    const originalOnFinishHandler = events.onFinish!

    const ret = await exportedWorkflow.retryStep({
      idempotencyKey: idempotencyKey_,
      context,
      throwOnError: false,
      logOnError,
      events: restEvents,
      container: container ?? this.container_,
    })

    if (ret.transaction.hasFinished()) {
      const { result, errors } = ret

      await originalOnFinishHandler({
        transaction: ret.transaction,
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

    const { onFinish, ...restEvents } = events
    const originalOnFinishHandler = events.onFinish!

    const ret = await exportedWorkflow.registerStepSuccess({
      idempotencyKey: idempotencyKey_,
      context,
      resultFrom,
      throwOnError: false,
      logOnError,
      events: restEvents,
      response: stepResponse,
      container: container ?? this.container_,
    })

    if (ret.transaction.hasFinished()) {
      const { result, errors } = ret

      await originalOnFinishHandler({
        transaction: ret.transaction,
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
      forcePermanentFailure,
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

    const { onFinish, ...restEvents } = events
    const originalOnFinishHandler = events.onFinish!

    const ret = await exportedWorkflow.registerStepFailure({
      idempotencyKey: idempotencyKey_,
      context,
      resultFrom,
      throwOnError: false,
      logOnError,
      events: restEvents,
      response: stepResponse,
      container: container ?? this.container_,
      forcePermanentFailure,
    })

    if (ret.transaction.hasFinished()) {
      const { result, errors } = ret

      await originalOnFinishHandler({
        transaction: ret.transaction,
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

    // Subscribe instance to redis
    if (!WorkflowOrchestratorService.subscribers.has(workflowId)) {
      void this.redisSubscriber.subscribe(this.getChannelName(workflowId))
    }

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
    const subscribers = WorkflowOrchestratorService.subscribers.get(workflowId)
    if (!subscribers) {
      return
    }

    const filterSubscribers = (handlers: SubscriberHandler[]) => {
      return handlers.filter((handler) => {
        return handler._id
          ? handler._id !== (subscriberOrId as string)
          : handler !== (subscriberOrId as SubscriberHandler)
      })
    }

    if (transactionId) {
      const transactionSubscribers = subscribers.get(transactionId)
      if (transactionSubscribers) {
        const newTransactionSubscribers = filterSubscribers(
          transactionSubscribers
        )

        if (newTransactionSubscribers.length) {
          subscribers.set(transactionId, newTransactionSubscribers)
        } else {
          subscribers.delete(transactionId)
        }
      }
    } else {
      const workflowSubscribers = subscribers.get(AnySubscriber)
      if (workflowSubscribers) {
        const newWorkflowSubscribers = filterSubscribers(workflowSubscribers)

        if (newWorkflowSubscribers.length) {
          subscribers.set(AnySubscriber, newWorkflowSubscribers)
        } else {
          subscribers.delete(AnySubscriber)
        }
      }
    }

    if (subscribers.size === 0) {
      WorkflowOrchestratorService.subscribers.delete(workflowId)
      void this.redisSubscriber.unsubscribe(this.getChannelName(workflowId))
    }
  }

  private async notify(
    options: NotifyOptions,
    publish = true,
    instanceId = this.instanceId
  ) {
    if (!publish && instanceId === this.instanceId) {
      return
    }

    const { workflowId, isFlowAsync } = options

    // Non-blocking Redis publishing
    if (publish && isFlowAsync) {
      setImmediate(async () => {
        try {
          const channel = this.getChannelName(workflowId)
          const message = JSON.stringify({
            instanceId: this.instanceId,
            data: options,
          })
          await this.redisPublisher.publish(channel, message)
        } catch (error) {
          this.#logger.error(`Failed to publish to Redis: ${error}`)
        }
      })
    }

    // Process subscribers asynchronously
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

  private getChannelName(workflowId: string): string {
    return `orchestrator:${workflowId}`
  }

  private buildWorkflowEvents({
    customEventHandlers,
    workflowId,
    transactionId,
  }): DistributedTransactionEvents {
    const notify = async ({
      isFlowAsync,
      eventType,
      step,
      result,
      response,
      errors,
      state,
    }: {
      isFlowAsync: boolean
      eventType: keyof DistributedTransactionEvents
      step?: TransactionStep
      response?: unknown
      result?: unknown
      errors?: unknown[]
      state?: TransactionState
    }) => {
      await this.notify({
        isFlowAsync,
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
      onTimeout: async ({ transaction }) => {
        customEventHandlers?.onTimeout?.({ transaction })
        await notify({
          eventType: "onTimeout",
          isFlowAsync: transaction.getFlow().hasAsyncSteps,
        })
      },

      onBegin: async ({ transaction }) => {
        customEventHandlers?.onBegin?.({ transaction })
        await notify({
          eventType: "onBegin",
          isFlowAsync: transaction.getFlow().hasAsyncSteps,
        })
      },
      onResume: async ({ transaction }) => {
        customEventHandlers?.onResume?.({ transaction })
        await notify({
          eventType: "onResume",
          isFlowAsync: transaction.getFlow().hasAsyncSteps,
        })
      },
      onCompensateBegin: async ({ transaction }) => {
        customEventHandlers?.onCompensateBegin?.({ transaction })
        await notify({
          eventType: "onCompensateBegin",
          isFlowAsync: transaction.getFlow().hasAsyncSteps,
        })
      },
      onFinish: async ({ transaction, result, errors }) => {
        customEventHandlers?.onFinish?.({ transaction, result, errors })
        await notify({
          eventType: "onFinish",
          isFlowAsync: transaction.getFlow().hasAsyncSteps,
          result,
          errors,
          state: transaction.getFlow().state as TransactionState,
        })
      },

      onStepBegin: async ({ step, transaction }) => {
        customEventHandlers?.onStepBegin?.({ step, transaction })
        await notify({
          eventType: "onStepBegin",
          step,
          isFlowAsync: transaction.getFlow().hasAsyncSteps,
        })
      },
      onStepSuccess: async ({ step, transaction }) => {
        const stepName = step.definition.action!
        const response = await resolveValue(
          transaction.getContext().invoke[stepName],
          transaction
        )
        customEventHandlers?.onStepSuccess?.({ step, transaction, response })
        await notify({
          eventType: "onStepSuccess",
          step,
          response,
          isFlowAsync: transaction.getFlow().hasAsyncSteps,
        })
      },
      onStepFailure: async ({ step, transaction }) => {
        const stepName = step.definition.action!
        const errors = transaction
          .getErrors(TransactionHandlerType.INVOKE)
          .filter((err) => err.action === stepName)

        customEventHandlers?.onStepFailure?.({ step, transaction, errors })
        await notify({
          eventType: "onStepFailure",
          step,
          errors,
          isFlowAsync: transaction.getFlow().hasAsyncSteps,
        })
      },
      onStepAwaiting: async ({ step, transaction }) => {
        customEventHandlers?.onStepAwaiting?.({ step, transaction })

        await notify({
          eventType: "onStepAwaiting",
          step,
          isFlowAsync: transaction.getFlow().hasAsyncSteps,
        })
      },

      onCompensateStepSuccess: async ({ step, transaction }) => {
        const stepName = step.definition.action!
        const response = transaction.getContext().compensate[stepName]
        customEventHandlers?.onCompensateStepSuccess?.({
          step,
          transaction,
          response,
        })

        await notify({
          eventType: "onCompensateStepSuccess",
          step,
          response,
          isFlowAsync: transaction.getFlow().hasAsyncSteps,
        })
      },
      onCompensateStepFailure: async ({ step, transaction }) => {
        const stepName = step.definition.action!
        const errors = transaction
          .getErrors(TransactionHandlerType.COMPENSATE)
          .filter((err) => err.action === stepName)

        customEventHandlers?.onStepFailure?.({ step, transaction, errors })

        await notify({
          eventType: "onCompensateStepFailure",
          step,
          errors,
          isFlowAsync: transaction.getFlow().hasAsyncSteps,
        })
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
