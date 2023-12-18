import { FlowRunOptions, MedusaWorkflow } from "@medusajs/workflows-sdk"
import {
  DistributedTransaction,
  DistributedTransactionEvents,
} from "@medusajs/orchestration"
import { ulid } from "ulid"
import { MedusaContainer } from "@medusajs/types"

type WorkflowOrchestratorRunOptions<T> = FlowRunOptions<T> & {
  transactionId?: string
  container?: { resolve<T = unknown>(key: string): T } // TODO: use ContainerLike once it is merged
}

type NotifyOptions = {
  eventType: keyof DistributedTransactionEvents
  workflowId: string
  transactionId?: string
  data: unknown
}

type WorkflowId = string
type TransactionId = string

type SubscriberHandler = (input: {
  eventType: keyof DistributedTransactionEvents
  result: unknown
}) => void

type SubscribeOptions = {
  workflowId: string
  transactionId?: string
  handler: SubscriberHandler
}

type TransactionSubscribers = Map<TransactionId, SubscriberHandler[]>
type Subscribers = Map<WorkflowId, TransactionSubscribers>

const AnySubscriber = "any"

class WorkflowOrchestrator {
  private static subscribers: Subscribers = new Map()

  constructor() {
    //
  }

  static async run<T = unknown>(
    workflowId: string,
    options?: WorkflowOrchestratorRunOptions<T>
  ) {
    let {
      input,
      context,
      transactionId,
      events: eventHandlers,
      container,
    } = options ?? {}

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

    const flow = MedusaWorkflow.getWorkflow(workflowId)(
      container as MedusaContainer
    )

    const ret = await flow.run({
      input,
      context,
      events,
    })

    /* if (ret.transaction.hasFinished()) {
      WorkflowOrchestrator.notify(ret.transaction.modelId, ret.result)
    }*/

    return ret
  }

  static setStepSuccess({ workflowId, idempotencyKey, stepResponse }) {
    //
  }

  static setStepFailure({ workflowId, idempotencyKey, stepResponse }) {
    //
  }

  static subscribe({ workflowId, transactionId, handler }: SubscribeOptions) {
    const subscribers = this.subscribers.get(workflowId) ?? new Map()

    const doesHandlerExists = (handlerToFind, handlers) => {
      return handlers.some((s) => s.toString() === handlerToFind.toString())
    }

    if (transactionId) {
      const transactionSubscribers = subscribers.get(transactionId) ?? []
      const subscriberAlreadyExists = doesHandlerExists(
        handler,
        transactionSubscribers
      )
      if (subscriberAlreadyExists) {
        return
      }

      transactionSubscribers.push(handler)
      subscribers.set(transactionId, transactionSubscribers)
      this.subscribers.set(workflowId, subscribers)
      return
    }

    const workflowSubscribers = subscribers.get(AnySubscriber) ?? []
    const doesSubscriberExists = doesHandlerExists(handler, workflowSubscribers)
    if (doesSubscriberExists) {
      return
    }

    workflowSubscribers.push(handler)
    subscribers.set(AnySubscriber, workflowSubscribers)
    this.subscribers.set(workflowId, subscribers)
  }

  static unsubscribe({ workflowId, transactionId, handler }: SubscribeOptions) {
    const subscribers = this.subscribers.get(workflowId) ?? new Map()

    if (transactionId) {
      const transactionSubscribers = subscribers.get(transactionId) ?? []
      const newTransactionSubscribers = transactionSubscribers.filter(
        (s) => s.toString() !== handler.toString()
      )
      subscribers.set(transactionId, newTransactionSubscribers)
      this.subscribers.set(workflowId, subscribers)
      return
    }

    const workflowSubscribers = subscribers.get(AnySubscriber) ?? []
    const newWorkflowSubscribers = workflowSubscribers.filter(
      (s) => s.toString() !== handler.toString()
    )
    subscribers.set(AnySubscriber, newWorkflowSubscribers)
    this.subscribers.set(workflowId, subscribers)
  }

  private static notify({
    workflowId,
    transactionId,
    eventType,
    data,
  }: NotifyOptions) {
    const subscribers: TransactionSubscribers =
      this.subscribers.get(workflowId) ?? new Map()

    const notifySubscribers = (handlers: SubscriberHandler[]) => {
      handlers.forEach((handler) => {
        handler({ eventType, result: data })
      })
    }

    if (transactionId) {
      const transactionSubscribers = subscribers.get(transactionId) ?? []
      notifySubscribers(transactionSubscribers)
      return
    }

    const workflowSubscribers = subscribers.get(AnySubscriber) ?? []
    notifySubscribers(workflowSubscribers)
  }

  private static buildWorkflowEvents({
    customEventHandlers,
    workflowId,
    transactionId,
  }): DistributedTransactionEvents {
    const notify = (
      eventType: keyof DistributedTransactionEvents,
      data?: unknown
    ) => {
      this.notify({
        workflowId,
        transactionId,
        eventType,
        data,
      })
    }

    return {
      onTimeout: (transaction) => {
        customEventHandlers?.onTimeout?.(transaction)
        notify("onTimeout")
      },

      onBegin: (transaction) => {
        customEventHandlers?.onBegin?.(transaction)
        notify("onBegin")
      },
      onResume: (transaction) => {
        customEventHandlers?.onResume?.(transaction)
        notify("onResume")
      },
      onCompensate: (transaction) => {
        customEventHandlers?.onCompensate?.(transaction)
        notify("onCompensate")
      },
      onFinish: (transaction: DistributedTransaction, result: unknown) => {
        customEventHandlers?.onFinish?.(transaction, result)
        notify("onFinish", result)
      },

      onStepBegin: ({ step, transaction }) => {
        customEventHandlers?.onStepBegin?.({ step, transaction })

        const data = { stepId: step.id }
        notify("onStepBegin", data)
      },
      onStepSuccess: ({ step, transaction, result }) => {
        customEventHandlers?.onStepSuccess?.({ step, transaction, result })

        const data_ = {
          stepId: step.id,
          result: result,
        }
        notify("onStepSuccess", data_)
      },
      onStepFailure: ({ step, transaction, errors }) => {
        customEventHandlers?.onStepFailure?.({ step, transaction, errors })

        const data = {
          stepId: step.id,
          errors: errors,
        }
        notify("onStepFailure", data)
      },
    }
  }
}

export default WorkflowOrchestrator
