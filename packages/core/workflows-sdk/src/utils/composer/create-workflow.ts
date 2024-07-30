import {
  TransactionModelOptions,
  WorkflowHandler,
  WorkflowManager,
} from "@medusajs/orchestration"
import { LoadedModule, MedusaContainer } from "@medusajs/types"
import { isString, OrchestrationUtils } from "@medusajs/utils"
import { exportWorkflow } from "../../helper"
import { createStep } from "./create-step"
import { StepResponse } from "./helpers"
import { proxify } from "./helpers/proxy"
import {
  CreateWorkflowComposerContext,
  ReturnWorkflow,
  StepFunction,
  WorkflowData,
  WorkflowDataProperties,
} from "./type"

global[OrchestrationUtils.SymbolMedusaWorkflowComposerContext] = null

/**
 * Workflow response class encapsulates the return value of a workflow
 */
export class WorkflowResponse<TData, THooks> {
  constructor(public $result: TData, public options: { hooks: THooks }) {}
  static unWrapResult(value: unknown) {
    return value && typeof value === "object" && "$result" in value
      ? value.$result
      : value
  }
}

/**
 * This function creates a workflow with the provided name and a constructor function.
 * The constructor function builds the workflow from steps created by the {@link createStep} function.
 * The returned workflow is an exported workflow of type {@link ReturnWorkflow}, meaning it's not executed right away. To execute it,
 * invoke the exported workflow, then run its `run` method.
 *
 * @typeParam TData - The type of the input passed to the composer function.
 * @typeParam TResult - The type of the output returned by the composer function.
 * @typeParam THooks - The type of hooks defined in the workflow.
 *
 * @returns The created workflow. You can later execute the workflow by invoking it, then using its `run` method.
 *
 * @example
 * import { createWorkflow } from "@medusajs/workflows-sdk"
 * import { MedusaRequest, MedusaResponse, Product } from "@medusajs/medusa"
 * import {
 *   createProductStep,
 *   getProductStep,
 *   createPricesStep
 * } from "./steps"
 *
 * interface WorkflowInput {
 *  title: string
 * }
 *
 * const myWorkflow = createWorkflow<
 *     WorkflowInput,
 *     Product
 *   >("my-workflow", (input) => {
 *    // Everything here will be executed and resolved later
 *    // during the execution. Including the data access.
 *
 *     const product = createProductStep(input)
 *     const prices = createPricesStep(product)
 *     return getProductStep(product.id)
 *   }
 * )
 *
 * export async function GET(
 *   req: MedusaRequest,
 *   res: MedusaResponse
 * ) {
 *   const { result: product } = await myWorkflow(req.scope)
 *     .run({
 *       input: {
 *         title: "Shirt"
 *       }
 *     })
 *
 *   res.json({
 *     product
 *   })
 * }
 */

export function createWorkflow<TData, TResult, THooks extends any[]>(
  /**
   * The name of the workflow or its configuration.
   */
  nameOrConfig: string | ({ name: string } & TransactionModelOptions),
  /**
   * The constructor function that is executed when the `run` method in {@link ReturnWorkflow} is used.
   * The function can't be an arrow function or an asynchronus function. It also can't directly manipulate data.
   * You'll have to use the {@link transform} function if you need to directly manipulate data.
   */
  composer: (input: WorkflowData<TData>) => WorkflowResponse<
    | void
    | WorkflowData<TResult>
    | {
        [K in keyof TResult]:
          | WorkflowData<TResult[K]>
          | WorkflowDataProperties<TResult[K]>
          | TResult[K]
      },
    THooks
  >
): ReturnWorkflow<TData, TResult, THooks> {
  const name = isString(nameOrConfig) ? nameOrConfig : nameOrConfig.name
  const options = isString(nameOrConfig) ? {} : nameOrConfig

  const handlers: WorkflowHandler = new Map()

  let newWorkflow = false
  if (!WorkflowManager.getWorkflow(name)) {
    newWorkflow = true
    WorkflowManager.register(name, undefined, handlers, options)
  }

  const context: CreateWorkflowComposerContext = {
    __type: OrchestrationUtils.SymbolMedusaWorkflowComposerContext,
    workflowId: name,
    flow: WorkflowManager.getEmptyTransactionDefinition(),
    handlers,
    hooks_: [],
    hooksCallback_: {},
    hookBinder: (name, fn) => {
      context.hooks_.push(name)
      context.hooksCallback_[name] = fn.bind(context)()
    },
    stepBinder: (fn) => {
      return fn.bind(context)()
    },
    parallelizeBinder: (fn) => {
      return fn.bind(context)()
    },
  }

  global[OrchestrationUtils.SymbolMedusaWorkflowComposerContext] = context

  const inputPlaceHolder = proxify<WorkflowData>({
    __type: OrchestrationUtils.SymbolInputReference,
    __step__: "",
    config: () => {
      // TODO: config default value?
      throw new Error("Config is not available for the input object.")
    },
  })

  const returnedStep = composer.apply(context, [inputPlaceHolder])

  delete global[OrchestrationUtils.SymbolMedusaWorkflowComposerContext]

  if (newWorkflow) {
    WorkflowManager.update(name, context.flow, handlers, options)
  } else {
    WorkflowManager.register(name, context.flow, handlers, options)
  }

  const workflow = exportWorkflow<TData, TResult>(
    name,
    returnedStep,
    undefined,
    {
      wrappedInput: true,
    }
  )

  const mainFlow = <TDataOverride = undefined, TResultOverride = undefined>(
    container?: LoadedModule[] | MedusaContainer
  ) => {
    const workflow_ = workflow<TDataOverride, TResultOverride>(container)
    const expandedFlow: any = workflow_
    expandedFlow.config = (config) => {
      workflow_.setOptions(config)
    }

    return expandedFlow
  }

  for (const hook of context.hooks_) {
    mainFlow["hooks"] ??= {}
    mainFlow["hooks"][hook] = context.hooksCallback_[hook].bind(context)
  }

  mainFlow.getName = () => name

  mainFlow.run = mainFlow().run

  mainFlow.runAsStep = ({
    input,
  }: {
    input: TData
  }): ReturnType<StepFunction<TData, TResult>> => {
    // TODO: Async sub workflow is not supported yet
    // Info: Once the export workflow can fire the execution through the engine if loaded, the async workflow can be executed,
    // the step would inherit the async configuration and subscribe to the onFinish event of the sub worklow and mark itself as success or failure
    return createStep(
      `${name}-as-step`,
      async (stepInput: TData, stepContext) => {
        const { container, ...sharedContext } = stepContext

        const transaction = await workflow.run({
          input: stepInput as any,
          container,
          context: sharedContext,
        })

        return new StepResponse(transaction.result, transaction)
      },
      async (transaction, { container }) => {
        if (!transaction) {
          return
        }

        await workflow(container).cancel(transaction)
      }
    )(input) as ReturnType<StepFunction<TData, TResult>>
  }

  return mainFlow as ReturnWorkflow<TData, TResult, THooks>
}
