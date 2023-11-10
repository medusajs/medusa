import { WorkflowHandler, WorkflowManager } from "@medusajs/orchestration"
import { exportWorkflow, FlowRunOptions } from "../../helper"
import { CreateWorkflowComposerContext } from "./index"
import {
  SymbolInputReference,
  SymbolMedusaWorkflowComposerContext,
  SymbolWorkflowStep,
} from "./symbol"

global[SymbolMedusaWorkflowComposerContext] = null

export function createWorkflow(name: string, composer: Function) {
  const handlers: WorkflowHandler = new Map()

  if (WorkflowManager.getWorkflow(name)) {
    WorkflowManager.unregister(name)
  }

  WorkflowManager.register(name, undefined, handlers)

  const context: CreateWorkflowComposerContext = {
    workflowId: name,
    flow: WorkflowManager.getTransactionDefinition(name),
    handlers,
    stepBinder: (fn) => {
      return fn.bind(context)()
    },
    parallelizeBinder: (fn) => {
      return fn.bind(context)()
    },
  }

  global[SymbolMedusaWorkflowComposerContext] = context

  const valueHolder = {
    value: {},
    __type: SymbolInputReference,
  }

  const returnedStep = composer.apply(context, [valueHolder])

  delete global[SymbolMedusaWorkflowComposerContext]

  WorkflowManager.update(name, context.flow, handlers)

  const workflow = exportWorkflow(name)

  return (...args) => {
    const workflow_ = workflow(...args)
    const originalRun = workflow_.run

    workflow_.run = (async <
      TDataOverride = undefined,
      TResultOverride = undefined
    >(
      input: FlowRunOptions<
        TDataOverride extends undefined ? unknown : TDataOverride
      >
    ) => {
      input.resultFrom ??=
        returnedStep.__type === SymbolWorkflowStep
          ? returnedStep?.__step__
          : returnedStep.__type === SymbolInputReference
          ? input?.input
          : undefined

      // Forwards the input to the ref object on composer.apply
      valueHolder.value = input?.input as any
      return await originalRun(input)
    }) as any
    return workflow_
  }
}
