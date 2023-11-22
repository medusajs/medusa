import {
  resolveValue,
  StepResponse,
  SymbolMedusaWorkflowComposerContext,
  SymbolWorkflowStep,
  SymbolWorkflowStepBind,
  SymbolWorkflowStepResponse,
  SymbolWorkflowWorkflowData,
} from "./helpers"
import {
  CreateWorkflowComposerContext,
  StepExecutionContext,
  StepFunction,
  StepFunctionResult,
  WorkflowData,
} from "./type"
import { proxify } from "./helpers/proxy"

type InvokeFn<TInput extends object, TOutput, TCompensateInput> = (
  input: {
    [Key in keyof TInput]: TInput[Key]
  },
  context: StepExecutionContext
) =>
  | void
  | StepResponse<
      TOutput,
      TCompensateInput extends undefined ? TOutput : TCompensateInput
    >
  | Promise<void | StepResponse<
      TOutput,
      TCompensateInput extends undefined ? TOutput : TCompensateInput
    >>

type CompensateFn<T> = (
  input: T,
  context: StepExecutionContext
) => unknown | Promise<unknown>

interface ApplyStepOptions<
  TStepInputs extends {
    [K in keyof TInvokeInput]: WorkflowData<TInvokeInput[K]>
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
    [K in keyof TInvokeInput]: WorkflowData<TInvokeInput[K]>
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
          stepResponse?.__type === SymbolWorkflowStepResponse
            ? stepResponse.toJSON()
            : stepResponse

        return {
          __type: SymbolWorkflowWorkflowData,
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
                ? stepOutput.compensateInput &&
                  JSON.parse(JSON.stringify(stepOutput.compensateInput))
                : stepOutput && JSON.parse(JSON.stringify(stepOutput))

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

    return proxify(ret)
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
    [K in keyof TInvokeInput]: WorkflowData<TInvokeInput[K]>
  }): WorkflowData<TInvokeResultOutput> {
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
        { [K in keyof TInvokeInput]: WorkflowData<TInvokeInput[K]> },
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
