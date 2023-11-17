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
  WorkflowTransactionContext,
} from "./type"

type InvokeFn<TInput extends object, O> = (
  input: {
    [Key in keyof TInput]: TInput[Key]
  },
  context: StepExecutionContext
) => Promise<O>

type CompensateFn<T> = (
  arg: T,
  context: StepExecutionContext
) => Promise<unknown>

interface ApplyStepOptions<
  TStepInputs extends {
    [K in keyof TInvokeInput]: StepReturn<TInvokeInput[K]>
  },
  TInvokeInput extends object,
  TOutput
> {
  stepName: string
  input: TStepInputs
  invokeFn: InvokeFn<TInvokeInput, TOutput>
  compensateFn?: CompensateFn<
    TOutput extends { compensateInput: infer CompensateInput }
      ? TOutput["compensateInput"]
      : TOutput
  >
}

/*type InvokeFn<TInput extends unknown[], O> = TInput extends [
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
}*/

/*function applyStep<
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
>): StepFunctionResult<TResult> {*/
/**
 * Internal function to create the invoke and compensate handler for a step.
 * This is where the inputs and context are passed to the underlying invoke and compensate function.
 *
 * @param stepName
 * @param input
 * @param invokeFn
 * @param compensateFn
 */
function applyStep<
  TInvokeInput extends object = object,
  TStepInput extends {
    [K in keyof TInvokeInput]: StepReturn<TInvokeInput[K]>
  } = { [K in keyof TInvokeInput]: StepReturn<TInvokeInput[K]> },
  TResult = unknown
>({
  stepName,
  input,
  invokeFn,
  compensateFn,
}: ApplyStepOptions<
  TStepInput,
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

        const argInput = await resolveValue(input, transactionContext)
        const output = await invokeFn.apply(this, [argInput, executionContext])

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

        return transform(target[prop], (input, context) => {
          const { invoke } = context as WorkflowTransactionContext
          return invoke?.[ret.__step__]?.output?.[prop]
        })
      },
    })
  }
}

/*export function createStep<TInvokeInput extends unknown[], TInvokeResult>(
  name: string,
  invokeFn: InvokeFn<TInvokeInput, TInvokeResult>,
  compensateFn?: CompensateFn<
    TInvokeResult extends { compensateInput: infer CompensateInput }
      ? TInvokeResult["compensateInput"]
      : TInvokeResult
  >
): StepFunction<TInvokeInput, TInvokeResult> {*/

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
 *  async function (input: Step1Input, context: StepExecutionContext): Promise<CreateProductOutput> {
 *    const productService = context.container.resolve("productService")
 *    const product = await productService.create(input)
 *    return {
 *      product,
 *      compensateInput: {
 *        product_id: product.id
 *      }
 *    }
 *  },
 *  async function (input: { product_id: string }, context: StepExecutionContext) {
 *     const productService = context.container.resolve("productService")
 *     await productService.delete(input.product_id)
 *  })
 */
export function createStep<TInvokeInput extends object, TInvokeResult>(
  name: string,
  invokeFn: InvokeFn<TInvokeInput, TInvokeResult>,
  compensateFn?: CompensateFn<
    TInvokeResult extends { compensateInput: infer CompensateInput }
      ? TInvokeResult["compensateInput"]
      : TInvokeResult
  >
): StepFunction<TInvokeInput, TInvokeResult> {
  const stepName = name ?? invokeFn.name

  /*const returnFn = function (
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
  }*/

  const returnFn = function (input: {
    [K in keyof TInvokeInput]: StepReturn<TInvokeInput[K]>
  }): StepReturn<TInvokeResult> {
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
        TInvokeInput,
        { [K in keyof TInvokeInput]: StepReturn<TInvokeInput[K]> },
        TInvokeResult
      >({
        stepName,
        input,
        invokeFn,
        compensateFn,
      })
    )
  }

  returnFn.__type = SymbolWorkflowStepBind
  returnFn.__step__ = stepName

  return returnFn as unknown as StepFunction<TInvokeInput, TInvokeResult>
}
