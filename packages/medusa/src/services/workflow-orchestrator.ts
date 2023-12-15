import { FlowRunOptions, MedusaWorkflow } from "@medusajs/workflows-sdk"
import {
  DistributedTransaction,
  DistributedTransactionEvents,
} from "@medusajs/orchestration"
import { ulid } from "ulid"

type WorkflowOrchestratorRunOptions<T> = FlowRunOptions<T> & {
  transactionId?: string
  container?: { resolve<T = unknown>(key: string): T } // TODO: use ContainerLike once it is merged
}

type SubscribeOptions = {
  workflowId: string
  transactionId?: string
  handler: (input: {
    eventType: keyof DistributedTransactionEvents
    result: unknown
  }) => void
}

type NotifyOptions = {
  workflowId: string
  transactionId?: string
  data: unknown
}

class WorkflowOrchestrator {
  private static subscribers: Record<string, Function[]> = {}

  constructor() {
    //
  }

  static async run<T = unknown>(
    workflowId: string,
    options?: WorkflowOrchestratorRunOptions<T>
  ) {
    let { input, context, transactionId, events: eventHandlers } = options ?? {}

    if (!workflowId) {
      throw new Error("Workflow ID is required")
    }

    context ??= {}
    context.transactionId ??= transactionId ?? ulid()

    const notify = (
      eventType: keyof DistributedTransactionEvents,
      data: unknown
    ) => {
      WorkflowOrchestrator.notify({ workflowId, transactionId, data })
    }

    const events: FlowRunOptions["events"] = {
      onBegin: (transaction) => {},
      onResume: (transaction) => {},
      onCompensate: (transaction) => {},
      onFinish: (transaction: DistributedTransaction, result: unknown) => {
        WorkflowOrchestrator.notify(transaction.modelId, result)
      },

      onStepBegin: ({ step, transaction }) => {
        //
      },
      onStepSuccess: ({ step, transaction, result }) => {
        //
      },
      onStepFailure: ({ step, transaction, error }) => {
        //
      },
    }

    const flow = MedusaWorkflow.getWorkflow(workflowId)(container)

    const ret = await flow.run({
      input,
      context,
      events,
    })

    if (ret.transaction.hasFinished()) {
      WorkflowOrchestrator.notify(ret.transaction.modelId, ret.result)
    }

    return ret
  }

  static setSuccess({ workflowId, idempotencyKey, stepResponse }) {
    //
  }

  static setFailure({ workflowId, idempotencyKey, stepResponse }) {
    //
  }

  static subscribe({ workflowId, transactionId, handler }: SubscribeOptions) {
    WorkflowOrchestrator.subscribers[workflowId] ??= []

    WorkflowOrchestrator.subscribers[workflowId].push(handler)
  }

  static unsubscribe({ workflowId, transactionId, handler }: SubscribeOptions) {
    if (!WorkflowOrchestrator.subscribers[workflowId]) {
      return
    }

    WorkflowOrchestrator.subscribers[workflowId] =
      WorkflowOrchestrator.subscribers[workflowId].filter((h) => h !== handler)
  }

  private static notify({ workflowId, transactionId, data }: NotifyOptions) {
    if (!WorkflowOrchestrator.subscribers[workflowId]) {
      return
    }

    WorkflowOrchestrator.subscribers[workflowId].forEach((handler) => {
      handler(data)
    })
  }
}

export default WorkflowOrchestrator
