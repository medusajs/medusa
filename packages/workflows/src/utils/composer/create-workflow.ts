import { WorkflowHandler, WorkflowManager } from "@medusajs/orchestration"
import { exportWorkflow } from "../../helper"

export function createWorkflow(name: string, composer: Function) {
  const handlers: WorkflowHandler = new Map()

  if (!WorkflowManager.getWorkflow(name)) {
    WorkflowManager.register(name, undefined, handlers)
  }

  const context = {
    workflowId: name,
    flow: WorkflowManager.getTransactionDefinition(name),
    handlers,
  }
  // @ts-ignore
  //this.context = context
  const workflowReturn = composer.apply(context)

  WorkflowManager.update(name, context.flow, handlers)

  const workflow = exportWorkflow(name)
  return async (input) => {
    // @ts-ignore
    await workflow().run({
      input,
      resultFrom: workflowReturn?.__step__,
    })
  }
}
