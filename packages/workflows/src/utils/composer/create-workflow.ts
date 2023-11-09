import { WorkflowHandler, WorkflowManager } from "@medusajs/orchestration"
import { exportWorkflow } from "../../helper"
import { WorkflowContext } from "./index"
import { SymbolInputReferece } from "./symbol"

global.MedusaWorkflowComposerContext = null

export function createWorkflow(name: string, composer: Function) {
  const handlers: WorkflowHandler = new Map()

  if (WorkflowManager.getWorkflow(name)) {
    WorkflowManager.unregister(name)
  }

  WorkflowManager.register(name, undefined, handlers)

  const context: WorkflowContext = {
    workflowId: name,
    flow: WorkflowManager.getTransactionDefinition(name),
    handlers,
    step: (fn) => {
      return fn.bind(context)()
    },
    parallelize: (fn) => {
      return fn.bind(context)()
    },
  }

  const valueHolder = {
    value: {},
    __type: SymbolInputReferece,
  }

  global.MedusaWorkflowComposerContext = context

  composer.apply(context, [valueHolder])

  delete global?.MedusaWorkflowComposerContext

  WorkflowManager.update(name, context.flow, handlers)

  const workflow = exportWorkflow(name)

  return (...args) => {
    const workflow_ = workflow(...args)
    const originalRun = workflow_.run
    workflow_.run = (input) => {
      // Forwards the input to the ref object on composer.apply
      valueHolder.value = input as any
      return originalRun({
        input,
      })
    }
    return workflow_
  }
}
