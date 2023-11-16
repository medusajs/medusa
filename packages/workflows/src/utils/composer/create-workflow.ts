import { WorkflowHandler, WorkflowManager } from "@medusajs/orchestration"
import { FlowRunOptions, WorkflowResult, exportWorkflow } from "../../helper"
import { CreateWorkflowComposerContext, StepReturn } from "./index"
import {
  SymbolInputReference,
  SymbolMedusaWorkflowComposerContext,
  SymbolWorkflowStep,
} from "./symbol"

global[SymbolMedusaWorkflowComposerContext] = null

/**
 * Creates a new workflow with the given name and composer function.
 * The composer function will compose the workflow by using the step, parallelize and other util functions that
 * will allow to define the flow of event of a workflow.
 *
 * @param name
 * @param composer
 *
 * @example
 * ```ts
 * import { createWorkflow, StepReturn } from "@medusajs/workflows"
 * import { createProductStep, getProductStep, createPricesStep } from "./steps"
 *
 * interface MyWorkflowData {
 *  title: string
 * }
 *
 * const myWorkflow = createWorkflow("my-workflow", (input: StepReturn<MyWorkflowData>) => {
 *    // Everything here will be executed and resolved later during the execution. Including the data access.
 *
 *    const product = createProductStep(input)
 *    const prices = createPricesStep(product)
 *
 *    const id = product.id
 *    return getProductStep(product.id)
 * })
 * ```
 */
export function createWorkflow<TData, TResult>(
  name: string,
  composer: (input: StepReturn<TData>) => void | StepReturn<TResult>
) {
  const handlers: WorkflowHandler = new Map()

  if (WorkflowManager.getWorkflow(name)) {
    WorkflowManager.unregister(name)
  }

  WorkflowManager.register(name, undefined, handlers)

  const context: CreateWorkflowComposerContext = {
    workflowId: name,
    flow: WorkflowManager.getTransactionDefinition(name),
    handlers,
    hooks_: [],
    hooksCallback_: {},
    hookBinder: (name, fn) => {
      context.hooks_.push(name)
      return fn(context)
    },
    stepBinder: (fn) => {
      return fn.bind(context)()
    },
    parallelizeBinder: (fn) => {
      return fn.bind(context)()
    },
  }

  global[SymbolMedusaWorkflowComposerContext] = context

  const valueHolder: StepReturn = {
    __value: {},
    __type: SymbolInputReference,
    __step__: "",
  }

  const returnedStep = composer.apply(context, [valueHolder])

  delete global[SymbolMedusaWorkflowComposerContext]

  WorkflowManager.update(name, context.flow, handlers)

  const workflow = exportWorkflow<TData, TResult>(name)

  const mainFlow = <TDataOverride = undefined, TResultOverride = undefined>(
    ...args
  ) => {
    const workflow_ = workflow<TDataOverride, TResultOverride>(...args)
    const originalRun = workflow_.run

    workflow_.run = (async (
      args?: FlowRunOptions<
        TDataOverride extends undefined ? TData : TDataOverride
      >
    ): Promise<WorkflowResult<TResult>> => {
      args ??= {}
      args.resultFrom ??=
        returnedStep?.__type === SymbolWorkflowStep
          ? returnedStep.__step__
          : undefined

      // Forwards the input to the ref object on composer.apply
      valueHolder.__value = args?.input as any
      return (await originalRun(args)) as unknown as WorkflowResult<TResult>
    }) as any
    return workflow_
  }

  for (const hook of context.hooks_) {
    mainFlow[hook] = (fn) => {
      context.hooksCallback_[hook] ??= []

      context.hooksCallback_[hook].push(fn)
    }
  }

  return mainFlow
}
