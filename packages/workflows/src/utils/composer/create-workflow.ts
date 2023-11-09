import { WorkflowHandler, WorkflowManager } from "@medusajs/orchestration"
import { exportWorkflow } from "../../helper"

global.step = null

export function createWorkflow(name: string, composer: Function) {
  const handlers: WorkflowHandler = new Map()

  if (!WorkflowManager.getWorkflow(name)) {
    WorkflowManager.register(name, undefined, handlers)
  }

  const context = {
    workflowId: name,
    flow: WorkflowManager.getTransactionDefinition(name),
    handlers,
    step: (fn) => {
      return fn.bind(context)()
    },
  }

  global.step = context.step.bind(context)

  let ref = new Proxy(
    {},
    {
      get(target: {}, p: string | symbol, receiver: any): any {
        return Reflect.get(target, p, receiver)
      },
    }
  )

  composer.apply(context, [ref])

  WorkflowManager.update(name, context.flow, handlers)

  const workflow = exportWorkflow(name)
  return async (input) => {
    // Forwards the input to the ref object
    Object.assign(ref, input)

    await workflow().run({
      input,
    })
  }
}
