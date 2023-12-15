import { Context, MedusaContainer } from "@medusajs/types"
import { MedusaWorkflow } from "@medusajs/workflows-sdk"
import { ulid } from "ulid"

class WorkflowOrchestrator {
  constructor() {
    //
  }
  private static subscribers: Record<string, Function[]> = {}

  static async run({
    workflowId,
    transactionId,
    input,
    context,
    container,
  }: {
    workflowId: string
    transactionId?: string
    input?: any
    context?: Context
    container?: MedusaContainer
  }) {
    if (!workflowId) {
      throw new Error("Workflow ID is required")
    }

    context ??= {}
    context.transactionId ??= transactionId ?? ulid()

    const events = {
      onStepBegin: ({ step, transaction }) => {
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

  static subscribe(workflowId, handler) {
    WorkflowOrchestrator.subscribers[workflowId] ??= []

    WorkflowOrchestrator.subscribers[workflowId].push(handler)
  }

  static unsubscribe(workflowId, handler) {
    if (!WorkflowOrchestrator.subscribers[workflowId]) {
      return
    }

    WorkflowOrchestrator.subscribers[workflowId] =
      WorkflowOrchestrator.subscribers[workflowId].filter((h) => h !== handler)
  }

  private static notify(workflowId, data) {
    if (!WorkflowOrchestrator.subscribers[workflowId]) {
      return
    }

    WorkflowOrchestrator.subscribers[workflowId].forEach((handler) => {
      handler(data)
    })
  }
}

export default WorkflowOrchestrator
