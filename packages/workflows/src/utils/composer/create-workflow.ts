import {
  LocalWorkflow,
  WorkflowHandler,
  WorkflowManager,
} from "@medusajs/orchestration"
import { LoadedModule, MedusaContainer } from "@medusajs/types"
import { exportWorkflow, FlowRunOptions, WorkflowResult } from "../../helper"
import {
  CreateWorkflowComposerContext,
  StepReturn,
  StepReturnProperties,
} from "./type"
import {
  resolveValue,
  SymbolInputReference,
  SymbolMedusaWorkflowComposerContext,
  SymbolWorkflowStep,
} from "./helpers"

global[SymbolMedusaWorkflowComposerContext] = null

/**
 * The type of a created workflow. To execute the workflow, use the `run` command.
 *
 * @example
 * myWorkflow()
 *   .run({
 *     input: {
 *       name: "John"
 *     }
 *   })
 *   .then(({ result }) => {
 *     console.log(result)
 *   })
 */
type ReturnWorkflow<TData, TResult, THooks extends Record<string, Function>> = {
  <TDataOverride = undefined, TResultOverride = undefined>(
    container?: LoadedModule[] | MedusaContainer
  ): Omit<LocalWorkflow, "run"> & {
    run: (
      args?: FlowRunOptions<
        TDataOverride extends undefined ? TData : TDataOverride
      >
    ) => Promise<
      WorkflowResult<
        TResultOverride extends undefined ? TResult : TResultOverride
      >
    >
  }
} & THooks

/**
 * This function creates a new workflow with the provided name and a constructor function.
 * The constructor function builds the workflow from steps created by the {@link createStep} function.
 * The constructor function is only executed when the `run` method in {@link ReturnWorkflow} is used.
 *
 * @typeParam TData - The type of the input passed to the composer function.
 * @typeParam TResult - The type of the output returned by the composer function.
 * @typeParam THooks - The type of hooks defined in the workflow.
 *
 * @param name - The name of the workflow.
 * @param composer -
 * The constructor function that is executed when the `run` method in {@link ReturnWorkflow} is used.
 * The function can't be an arrow function or an asynchronus function. It also can't directly manipulate data.
 * You'll have to use the {@link transform} function if you need to directly manipulate data.
 *
 *
 * @returns The created workflow. You can later invoke the workflow using the `run` method.
 *
 * @example
 * import {
 *   createWorkflow,
 *   StepReturn
 * } from "@medusajs/workflows"
 * import {
 *   createProductStep,
 *   getProductStep,
 *   createPricesStep
 * } from "./steps"
 *
 * interface MyWorkflowData {
 *  title: string
 * }
 *
 * const myWorkflow = createWorkflow(
 *   "my-workflow",
 *   function (input: StepReturn<MyWorkflowData>) {
 *     // Everything here will be executed and resolved later during the execution. Including the data access.
 *
 *     const product = createProductStep(input)
 *     const prices = createPricesStep(product)
 *
 *     const id = product.id
 *     return getProductStep(id)
 *   }
 * )
 *
 * myWorkflow()
 *  .run({
 *    title: "Shirt"
 *  })
 * .then((product) => {
 *   console.log(product.id)
 * })
 */

export function createWorkflow<
  TData,
  TResult,
  THooks extends Record<string, Function>
>(
  name: string,
  composer: (input: StepReturn<TData>) =>
    | void
    | StepReturn<TResult>
    | {
        [K in keyof TResult]:
          | StepReturn<TResult[K]>
          | StepReturnProperties<TResult[K]>
      }
): ReturnWorkflow<TData, TResult, THooks> {
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
    container?: LoadedModule[] | MedusaContainer
  ) => {
    const workflow_ = workflow<TDataOverride, TResultOverride>(container)
    const originalRun = workflow_.run

    workflow_.run = (async (
      args?: FlowRunOptions<
        TDataOverride extends undefined ? TData : TDataOverride
      >
    ): Promise<
      WorkflowResult<
        TResultOverride extends undefined ? TResult : TResultOverride
      >
    > => {
      args ??= {}
      args.resultFrom ??=
        returnedStep?.__type === SymbolWorkflowStep
          ? returnedStep.__step__
          : undefined

      // Forwards the input to the ref object on composer.apply
      valueHolder.__value = args?.input as any
      const workflowResult = (await originalRun(
        args
      )) as unknown as WorkflowResult<
        TResultOverride extends undefined ? TResult : TResultOverride
      >

      workflowResult.result = await resolveValue(
        workflowResult.result || returnedStep,
        workflowResult.transaction.getContext()
      )

      return workflowResult
    }) as any

    return workflow_
  }

  let shouldRegisterHookHandler = true

  for (const hook of context.hooks_) {
    mainFlow[hook] = (fn) => {
      context.hooksCallback_[hook] ??= []

      if (!shouldRegisterHookHandler) {
        console.warn(
          `A hook handler has already been registered for the ${hook} hook. The current handler registration will be skipped.`
        )
        return
      }

      context.hooksCallback_[hook].push(fn)
      shouldRegisterHookHandler = false
    }
  }

  return mainFlow as ReturnWorkflow<TData, TResult, THooks>
}
