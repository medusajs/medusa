import {
  DistributedTransaction,
  DistributedTransactionEvents,
  TransactionHandlerType,
  TransactionStep,
} from "@medusajs/orchestration"
import { ContainerLike, Context, MedusaContainer } from "@medusajs/types"
import { InjectSharedContext, MedusaContext, isString } from "@medusajs/utils"
import {
  MedusaWorkflow,
  ReturnWorkflow,
  resolveValue,
  type FlowRunOptions,
} from "@medusajs/workflows-sdk"
import { ulid } from "ulid"
import { InMemoryDistributedTransactionStorage } from "../utils"

export type WorkflowOrchestratorRunOptions<T> = FlowRunOptions<T> & {
  transactionId?: string
  container?: ContainerLike
}

type RegisterStepSuccessOptions<T> = Omit<
  WorkflowOrchestratorRunOptions<T>,
  "transactionId" | "input"
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
  private subscribers: Subscribers = new Map()

  constructor({
    inMemoryDistributedTransactionStorage,
  }: {
    inMemoryDistributedTransactionStorage: InMemoryDistributedTransactionStorage
    workflowOrchestratorService: WorkflowOrchestratorService
  }) {
    inMemoryDistributedTransactionStorage.setWorkflowOrchestratorService(this)
    DistributedTransaction.setStorage(inMemoryDistributedTransactionStorage)
  }

  @InjectSharedContext()
  async run<T = unknown>(
    workflowIdOrWorkflow: string | ReturnWorkflow<any, any, any>,
    options?: WorkflowOrchestratorRunOptions<T>,
    @MedusaContext() sharedContext: Context = {}
  ) {
    let {
      input,
      context,
      transactionId,
      resultFrom,
      throwOnError,
      events: eventHandlers,
      container,
    } = options ?? {}

    const workflowId = isString(workflowIdOrWorkflow)
      ? workflowIdOrWorkflow
      : workflowIdOrWorkflow.getName()

    if (!workflowId) {
      throw new Error("Workflow ID is required")
    }

    context ??= {}
    context.transactionId ??= transactionId ?? ulid()

    const events: FlowRunOptions["events"] = this.buildWorkflowEvents({
      customEventHandlers: eventHandlers,
      workflowId,
      transactionId: context.transactionId,
    })

    const exportedWorkflow: any = MedusaWorkflow.getWorkflow(workflowId)
    if (!exportedWorkflow) {
      throw new Error(`Workflow with id "${workflowId}" not found.`)
    }

    const flow = exportedWorkflow(container as MedusaContainer)

    const ret = await flow.run({
      input,
      throwOnError,
      resultFrom,
      context,
      events,
    })

    // TODO: temporary
    const acknowledgement = {
      transactionId: context.transactionId,
      workflowId: workflowId,
    }

    if (ret.transaction.hasFinished()) {
      const { result, errors } = ret
      this.notify({
        eventType: "onFinish",
        workflowId,
        transactionId: context.transactionId,
        result,
        errors,
      })
    }

    return { acknowledgement, ...ret }
  }

  @InjectSharedContext()
  async getRunningTransaction(
    workflowId: string,
    transactionId: string,
    options?: WorkflowOrchestratorRunOptions<undefined>,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<DistributedTransaction> {
    let { context, container } = options ?? {}

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

    const flow = exportedWorkflow(container as MedusaContainer)

    const transaction = await flow.getRunningTransaction(transactionId, context)

    return transaction
  }

  @InjectSharedContext()
  async setStepSuccess<T = unknown>(
    {
      idempotencyKey,
      stepResponse,
      options,
    }: {
      idempotencyKey: string | IdempotencyKeyParts
      stepResponse: unknown
      options?: RegisterStepSuccessOptions<T>
    },
    @MedusaContext() sharedContext: Context = {}
  ) {
    const {
      context,
      throwOnError,
      resultFrom,
      container,
      events: eventHandlers,
    } = options ?? {}

    const [idempotencyKey_, { workflowId, transactionId }] =
      this.buildIdempotencyKeyAndParts(idempotencyKey)

    const exportedWorkflow: any = MedusaWorkflow.getWorkflow(workflowId)
    if (!exportedWorkflow) {
      throw new Error(`Workflow with id "${workflowId}" not found.`)
    }

    const flow = exportedWorkflow(container as MedusaContainer)

    const events = this.buildWorkflowEvents({
      customEventHandlers: eventHandlers,
      transactionId,
      workflowId,
    })

    const ret = await flow.registerStepSuccess({
      idempotencyKey: idempotencyKey_,
      context,
      resultFrom,
      throwOnError,
      events,
      response: stepResponse,
    })

    if (ret.transaction.hasFinished()) {
      const { result, errors } = ret
      this.notify({
        eventType: "onFinish",
        workflowId,
        transactionId,
        result,
        errors,
      })
    }

    return ret
  }

  @InjectSharedContext()
  async setStepFailure<T = unknown>(
    {
      idempotencyKey,
      stepResponse,
      options,
    }: {
      idempotencyKey: string | IdempotencyKeyParts
      stepResponse: unknown
      options?: RegisterStepSuccessOptions<T>
    },
    @MedusaContext() sharedContext: Context = {}
  ) {
    const {
      context,
      throwOnError,
      resultFrom,
      container,
      events: eventHandlers,
    } = options ?? {}

    const [idempotencyKey_, { workflowId, transactionId }] =
      this.buildIdempotencyKeyAndParts(idempotencyKey)

    const exportedWorkflow: any = MedusaWorkflow.getWorkflow(workflowId)
    if (!exportedWorkflow) {
      throw new Error(`Workflow with id "${workflowId}" not found.`)
    }

    const flow = exportedWorkflow(container as MedusaContainer)

    const events = this.buildWorkflowEvents({
      customEventHandlers: eventHandlers,
      transactionId,
      workflowId,
    })

    const ret = await flow.registerStepFailure({
      idempotencyKey: idempotencyKey_,
      context,
      resultFrom,
      throwOnError,
      events,
      response: stepResponse,
    })

    if (ret.transaction.hasFinished()) {
      const { result, errors } = ret
      this.notify({
        eventType: "onFinish",
        workflowId,
        transactionId,
        result,
        errors,
      })
    }

    return ret
  }

  @InjectSharedContext()
  subscribe(
    { workflowId, transactionId, subscriber, subscriberId }: SubscribeOptions,
    @MedusaContext() sharedContext: Context = {}
  ) {
    subscriber._id = subscriberId
    const subscribers = this.subscribers.get(workflowId) ?? new Map()

    const handlerIndex = (handlers) => {
      return handlers.indexOf((s) => s === subscriber || s._id === subscriberId)
    }

    if (transactionId) {
      const transactionSubscribers = subscribers.get(transactionId) ?? []
      const subscriberIndex = handlerIndex(transactionSubscribers)
      if (subscriberIndex !== -1) {
        transactionSubscribers.slice(subscriberIndex, 1)
      }

      transactionSubscribers.push(subscriber)
      subscribers.set(transactionId, transactionSubscribers)
      this.subscribers.set(workflowId, subscribers)
      return
    }

    const workflowSubscribers = subscribers.get(AnySubscriber) ?? []
    const subscriberIndex = handlerIndex(workflowSubscribers)
    if (subscriberIndex !== -1) {
      workflowSubscribers.slice(subscriberIndex, 1)
    }

    workflowSubscribers.push(subscriber)
    subscribers.set(AnySubscriber, workflowSubscribers)
    this.subscribers.set(workflowId, subscribers)
  }

  @InjectSharedContext()
  unsubscribe(
    { workflowId, transactionId, subscriberOrId }: UnsubscribeOptions,
    @MedusaContext() sharedContext: Context = {}
  ) {
    const subscribers = this.subscribers.get(workflowId) ?? new Map()

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
      subscribers.set(transactionId, newTransactionSubscribers)
      this.subscribers.set(workflowId, subscribers)
      return
    }

    const workflowSubscribers = subscribers.get(AnySubscriber) ?? []
    const newWorkflowSubscribers = filterSubscribers(workflowSubscribers)
    subscribers.set(AnySubscriber, newWorkflowSubscribers)
    this.subscribers.set(workflowId, subscribers)
  }

  private notify(options: NotifyOptions) {
    const {
      eventType,
      workflowId,
      transactionId,
      errors,
      result,
      step,
      response,
    } = options

    const subscribers: TransactionSubscribers =
      this.subscribers.get(workflowId) ?? new Map()

    const notifySubscribers = (handlers: SubscriberHandler[]) => {
      handlers.forEach((handler) => {
        handler({
          eventType,
          workflowId,
          transactionId,
          step,
          response,
          result,
          errors,
        })
      })
    }

    if (transactionId) {
      const transactionSubscribers = subscribers.get(transactionId) ?? []
      notifySubscribers(transactionSubscribers)
    }

    const workflowSubscribers = subscribers.get(AnySubscriber) ?? []
    notifySubscribers(workflowSubscribers)
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
    }: {
      eventType: keyof DistributedTransactionEvents
      step?: TransactionStep
      response?: unknown
      result?: unknown
      errors?: unknown[]
    }) => {
      this.notify({
        workflowId,
        transactionId,
        eventType,
        response,
        step,
        result,
        errors,
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
        // TODO: unsubscribe transaction handlers on finish
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
