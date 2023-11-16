import { resolveValue } from "./resolve-value"
import {
  SymbolMedusaWorkflowComposerContext,
  SymbolWorkflowStep,
  SymbolWorkflowStepBind,
  SymbolWorkflowStepReturn,
} from "./symbol"
import { transform } from "./transform"
import {
  CreateWorkflowComposerContext,
  StepExecutionContext,
  StepFunction,
  StepFunctionResult,
  StepReturn,
} from "./type"

type InvokeFn<TInput extends unknown[], O> = TInput extends [
  StepExecutionContext,
  ...infer Args
]
  ? (...args: [context: StepExecutionContext, ...args: Args]) => Promise<O>
  : (...args: TInput) => Promise<O>

type CompensateFn<T> = (
  context: StepExecutionContext,
  arg: T
) => Promise<unknown>

interface ApplyStepOptions<
  TStepInputs extends StepReturn[],
  TInvokeInput extends unknown[],
  TOutput
> {
  stepName: string
  stepInputs: TStepInputs
  invokeFn: InvokeFn<TInvokeInput, TOutput>
  compensateFn?: CompensateFn<
    TOutput extends { compensateInput: infer CompensateInput }
      ? TOutput["compensateInput"]
      : TOutput
  >
}

/**
 * Internal function to create the invoke and compensate handler for a step.
 * This is where the inputs and context are passed to the underlying invoke and compensate function.
 *
 * @param stepName
 * @param stepInputs
 * @param invokeFn
 * @param compensateFn
 */
function applyStep<
  TStepInputs extends StepReturn[],
  TInvokeInput extends unknown[],
  TResult
>({
  stepName,
  stepInputs,
  invokeFn,
  compensateFn,
}: ApplyStepOptions<
  TStepInputs,
  TInvokeInput,
  TResult
>): StepFunctionResult<TResult> {
  return function (this: CreateWorkflowComposerContext) {
    if (!this.workflowId) {
      throw new Error(
        "createStep must be used inside a createWorkflow definition"
      )
    }

    const handler = {
      invoke: async (transactionContext) => {
        const executionContext: StepExecutionContext = {
          container: transactionContext.container,
          metadata: transactionContext.metadata,
          context: transactionContext.context,
        }

        const args = await resolveValue(stepInputs, transactionContext)

        const output = await invokeFn.apply(this, [executionContext, ...args])

        return {
          __type: SymbolWorkflowStepReturn,
          output,
        }
      },
      compensate: compensateFn
        ? async (transactionContext) => {
            const executionContext: StepExecutionContext = {
              container: transactionContext.container,
              metadata: transactionContext.metadata,
              context: transactionContext.context,
            }

            const invokeResult =
              transactionContext.invoke[stepName].output?.compensateInput

            const args = [executionContext, invokeResult]
            const output = await compensateFn.apply(this, args)
            return {
              output,
            }
          }
        : undefined,
    }

    this.flow.addAction(stepName, {
      noCompensation: !compensateFn,
    })
    this.handlers.set(stepName, handler)

    const ret = {
      __type: SymbolWorkflowStep,
      __step__: stepName,
      __returnProperties: [],
    }

    return new Proxy(ret, {
      get(target: any, prop: string | symbol): any {
        if (target[prop]) {
          return target[prop]
        }

        // @ts-ignore
        return transform(target[prop], (context) => {
          const { invoke } = context
          return invoke?.[ret.__step__]?.output?.[prop]
        })
      },
    })
  }
}

/**
 * Function which will create a StepFunction to be used inside a createWorkflow composer function.
 * This function will return a function which can be used to bind the step to a workflow.
 * The types of the input to be passed to the step function is defined by the generic of the invoke function provided.
 *
 * @param name
 * @param invokeFn
 * @param compensateFn
 *
 * @example
 * ```ts
 * interface CreateProductInput {
 *   title: string
 * }
 *
 * interface CreateProductOutput {
 *   product: { id: string; title: string }
 *   compensateInput: {
 *     product_id: string
 *   }
 * }
 *
 * export const createProductStep = createStep(
 *  "createProductStep",
 *  async function (context: StepExecutionContext, input: Step1Input): Promise<CreateProductOutput> {
 *    const productService = context.container.resolve("productService")
 *    const product = await productService.create(input)
 *    return {
 *      product,
 *      compensateInput: {
 *        product_id: product.id
 *      }
 *    }
 *  },
 *  async function (context: any, input) {
 *     const productService = context.container.resolve("productService")
 *     await productService.delete(input.product_id)
 *  })
 */
export function createStep<TInvokeInput extends unknown[], TInvokeResult>(
  name: string,
  invokeFn: InvokeFn<TInvokeInput, TInvokeResult>,
  compensateFn?: CompensateFn<
    TInvokeResult extends { compensateInput: infer CompensateInput }
      ? TInvokeResult["compensateInput"]
      : TInvokeResult
  >
): StepFunction<TInvokeInput, TInvokeResult> {
  const stepName = name ?? invokeFn.name

  const returnFn = function (
    ...stepInputs: [...StepReturn<TInvokeInput[number]>[]]
  ): StepReturn<TInvokeResult> {
    if (!global[SymbolMedusaWorkflowComposerContext]) {
      throw new Error(
        "createStep must be used inside a createWorkflow definition"
      )
    }

    const stepBinder = (
      global[
        SymbolMedusaWorkflowComposerContext
      ] as CreateWorkflowComposerContext
    ).stepBinder

    return stepBinder<TInvokeResult>(
      applyStep<
        [...StepReturn<TInvokeInput[number]>[]],
        TInvokeInput,
        TInvokeResult
      >({
        stepName,
        stepInputs,
        invokeFn,
        compensateFn,
      })
    )
  }

  returnFn.__type = SymbolWorkflowStepBind
  returnFn.__step__ = stepName

  return returnFn as unknown as StepFunction<TInvokeInput, TInvokeResult>
}
