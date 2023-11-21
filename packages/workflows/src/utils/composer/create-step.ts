import {
  resolveValue,
  StepResponse,
  SymbolMedusaWorkflowComposerContext,
  SymbolWorkflowStep,
  SymbolWorkflowStepBind,
  SymbolWorkflowStepResponse,
  SymbolWorkflowStepReturn,
} from "./helpers"
import { transform } from "./transform"
import {
  CreateWorkflowComposerContext,
  StepExecutionContext,
  StepFunction,
  StepFunctionResult,
  StepReturn,
  WorkflowTransactionContext,
} from "./type"

/**
 * The type of invocation function passed to a step.
 *
 * @typeParam TInput - The type of the input that the function expects.
 * @typeParam TOutput - The type of the output that the function returns.
 * @typeParam TCompensateInput - The type of the input that the compensation function expects.
 *
 * @param input - The input of the step.
 * @param context - The step's context.
 *
 * @returns The expected output based on the type parameter `TOutput`.
 */
type InvokeFn<TInput extends object, TOutput, TCompensateInput> = (
  input: {
    [Key in keyof TInput]: TInput[Key]
  },
  context: StepExecutionContext
) => Promise<StepResponse<TOutput, TCompensateInput>>

/**
 * The type of compensation function passed to a step.
 *
 * @typeParam T - The type of the argument passed to the compensation function. Typically, this would be the the output type of a step.
 *
 * @param arg - The argument passed to the compensation function.
 * @param context - The step's context.
 *
 * @returns There's no expected value to be returned by the compensation function.
 */
type CompensateFn<T> = (
  input: T,
  context: StepExecutionContext
) => Promise<unknown>

interface ApplyStepOptions<
  TStepInputs extends {
    [K in keyof TInvokeInput]: StepReturn<TInvokeInput[K]>
  },
  TInvokeInput extends object,
  TInvokeResultOutput,
  TInvokeResultCompensateInput
> {
  stepName: string
  input: TStepInputs
  invokeFn: InvokeFn<
    TInvokeInput,
    TInvokeResultOutput,
    TInvokeResultCompensateInput
  >
  compensateFn?: CompensateFn<TInvokeResultCompensateInput>
}

/**
 * @internal
 *
 * Internal function to create the invoke and compensate handler for a step.
 * This is where the inputs and context are passed to the underlying invoke and compensate function.
 *
 * @param stepName
 * @param input
 * @param invokeFn
 * @param compensateFn
 */
function applyStep<
  TInvokeInput extends object,
  TStepInput extends {
    [K in keyof TInvokeInput]: StepReturn<TInvokeInput[K]>
  },
  TInvokeResultOutput,
  TInvokeResultCompensateInput
>({
  stepName,
  input,
  invokeFn,
  compensateFn,
}: ApplyStepOptions<
  TStepInput,
  TInvokeInput,
  TInvokeResultOutput,
  TInvokeResultCompensateInput
>): StepFunctionResult<TInvokeResultOutput> {
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
        const stepResponse: StepResponse<any, any> = await invokeFn.apply(
          this,
          [argInput, executionContext]
        )

        const stepResponseJSON =
          stepResponse.__type === SymbolWorkflowStepResponse
            ? stepResponse.toJSON()
            : stepResponse

        return {
          __type: SymbolWorkflowStepReturn,
          output: stepResponseJSON,
        }
      },
      compensate: compensateFn
        ? async (transactionContext) => {
            const executionContext: StepExecutionContext = {
              container: transactionContext.container,
              metadata: transactionContext.metadata,
              context: transactionContext.context,
            }

            const stepOutput = transactionContext.invoke[stepName].output
            const invokeResult =
              stepOutput?.__type === SymbolWorkflowStepResponse
                ? stepOutput.compensateInput
                : undefined

            const args = [invokeResult, executionContext]
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
    }

    return new Proxy(ret, {
      get(target: any, prop: string | symbol): any {
        if (target[prop]) {
          return target[prop]
        }

        return transform(target[prop], (input, context) => {
          const { invoke } = context as WorkflowTransactionContext
          const output = invoke?.[ret.__step__]?.output
          return output?.__type === SymbolWorkflowStepResponse
            ? output.output?.[prop]
            : output?.[prop]
        })
      },
    })
  }
}

/**
 * This function creates a {@link StepFunction}. It can be used as a step in a workflow inside a {@link createWorkflow} function.
 *
 * @param name - The name of the step.
 * @param invokeFn -
 * An invocation function that will be executed when the step is used. The function must return an instance of {@link StepResponse}. The constructor of {@link StepResponse}
 * accepts the output of the step as a first argument, and optionally as a second argument the data to be passed to the compensation function as a parameter.
 * @param compensateFn -
 * A compensation function that's executed if an error occurs in the workflow. It's used to roll-back actions when errors occur.
 * It accepts as a parameter the second argument passed to the {@link StepResponse} instance returned by the invocation function.
 *
 * @typeParam TInvokeInput - The type of the expected input parameter to the invocation function.
 * @typeParam TInvokeResultOutput - The type of the expected output parameter of the invocation function.
 * @typeParam TInvokeResultCompensateInput - The type of the expected input parameter to the invocation function.
 *
 * @returns A step function to be used in a workflow.
 *
 * @example
 * import {
 *   createStep,
 *   StepResponse,
 *   StepExecutionContext
 * } from "@medusajs/workflows"
 *
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
 *  async function (
 *    input: Step1Input,
 *    context: StepExecutionContext
 *  ): Promise<CreateProductOutput> {
 *    const productService = context.container.resolve(
 *      "productService"
 *    )
 *    const product = await productService.create(input)
 *    return new StepResponse({
 *      product
 *    }, {
 *      product_id: product.id
 *    })
 *  },
 *  async function (
 *    input: { product_id: string },
 *    context: StepExecutionContext
 *  ) {
 *     const productService = context.container.resolve(
 *       "productService"
 *     )
 *     await productService.delete(input.product_id)
 *  })
 */
export function createStep<
  TInvokeInput extends object,
  TInvokeResultOutput,
  TInvokeResultCompensateInput
>(
  name: string,
  invokeFn: InvokeFn<
    TInvokeInput,
    TInvokeResultOutput,
    TInvokeResultCompensateInput
  >,
  compensateFn?: CompensateFn<TInvokeResultCompensateInput>
): StepFunction<TInvokeInput, TInvokeResultOutput> {
  const stepName = name ?? invokeFn.name

  const returnFn = function (input: {
    [K in keyof TInvokeInput]: StepReturn<TInvokeInput[K]>
  }): StepReturn<TInvokeResultOutput> {
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

    return stepBinder<TInvokeResultOutput>(
      applyStep<
        TInvokeInput,
        { [K in keyof TInvokeInput]: StepReturn<TInvokeInput[K]> },
        TInvokeResultOutput,
        TInvokeResultCompensateInput
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

  return returnFn as unknown as StepFunction<TInvokeInput, TInvokeResultOutput>
}
