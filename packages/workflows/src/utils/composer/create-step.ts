import { isDefined, promiseAll } from "@medusajs/utils"
import {
  SymbolInputReference,
  SymbolMedusaWorkflowComposerContext,
  SymbolWorkflowStep,
  SymbolWorkflowStepBind,
  SymbolWorkflowStepReturn,
  SymbolWorkflowStepTransformer,
} from "./symbol"
import { transform } from "./transform"
import {
  CreateWorkflowComposerContext,
  StepExecutionContext,
  StepFunction,
  StepFunctionResult,
  StepReturn,
} from "./type"

type InvokeFn<TInput extends unknown[], O> = (
  context: StepExecutionContext,
  ...args: TInput
) => Promise<O>

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
        const { invoke: invokeRes } = transactionContext

        // Garb all previous invoke results by step name and or transformers
        let previousResultResults = await promiseAll(
          stepInputs.map(async (stepInput) => {
            if (stepInput?.__type === SymbolInputReference) {
              return stepInput.__value
            }

            const stepInputs_ = Array.isArray(stepInput)
              ? stepInput
              : [stepInput]

            return await promiseAll(
              stepInputs_.map(async (st) => {
                if (st?.__type === SymbolWorkflowStepTransformer) {
                  if (isDefined(st.__value)) {
                    return st.__value
                  }
                  return await st(transactionContext)
                }

                return st?.__type === SymbolWorkflowStep
                  ? invokeRes[st.__step__]?.output
                  : st
              })
            )
          })
        )
        previousResultResults = previousResultResults.flat()

        const executionContext: StepExecutionContext = {
          container: transactionContext.container,
          metadata: transactionContext.metadata,
          context: transactionContext.context,
        }

        const args = [transactionContext, ...previousResultResults]

        const output = await invokeFn.apply(this, args)

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
      get(target: any, prop: string | symbol, receiver: any): any {
        if (target[prop]) {
          return target[prop]
        }

        // @ts-ignore
        return transform(target[prop], (context) => {
          const { invoke } = context
          return invoke[ret.__step__]?.output?.[prop]
        })
      },
    })
  }
}

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
