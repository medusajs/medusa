import { isDefined, promiseAll } from "@medusajs/utils"
import {
  SymbolInputReference,
  SymbolMedusaWorkflowComposerContext,
  SymbolWorkflowStep,
  SymbolWorkflowStepBind,
  SymbolWorkflowStepReturn,
  SymbolWorkflowStepTransformer,
} from "./symbol"
import {
  CreateWorkflowComposerContext,
  StepFunction,
  StepFunctionResult,
  StepReturn,
} from "./type"

interface ApplyStepOptions<TStepInput extends StepReturn[]> {
  stepName: string
  stepInputs: TStepInput
  invokeFn: Function
  compensateFn?: Function
}

function applyStep<TStepInput extends StepReturn[], TResult extends unknown>({
  stepName,
  stepInputs,
  invokeFn,
  compensateFn,
}: ApplyStepOptions<TStepInput>): StepFunctionResult<TResult> {
  return function (this: CreateWorkflowComposerContext) {
    if (!this.workflowId) {
      throw new Error(
        "createStep must be used inside a createWorkflow definition"
      )
    }

    const handler = {
      invoke: async (transactionContext) => {
        const { invoke: invokeRes } = transactionContext

        // Garb all previous invoke results by step name
        let previousResultResults = await promiseAll(
          stepInputs.map(async (stepInput) => {
            if (stepInput?.__type === SymbolInputReference) {
              return stepInput.value
            }

            const stepInputs_ = Array.isArray(stepInput)
              ? stepInput
              : [stepInput]

            return await promiseAll(
              stepInputs_.map(async (st) => {
                if (st?.__type === SymbolWorkflowStepTransformer) {
                  if (isDefined(st.__result)) {
                    return st.__result
                  }
                  return await st(transactionContext)
                }

                const toReturn =
                  st?.__type === SymbolWorkflowStep
                    ? invokeRes[st.__step__]?.output
                    : st

                if (st.__returnProperties) {
                  return toReturn[st.__returnProperties]
                }
              })
            )
          })
        )
        previousResultResults = previousResultResults.flat()

        const args = [transactionContext, ...previousResultResults]

        const output = await invokeFn.apply(this, args)

        return {
          __type: SymbolWorkflowStepReturn,
          output,
        }
      },
      compensate: compensateFn
        ? async (transactionContext) => {
            const invokeResult = transactionContext.invoke[stepName].output
            const args = [transactionContext, invokeResult]
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
    /*
    const ret = {
      __type: SymbolWorkflowStep,
      __step__: stepName,
    } as StepBinderReturn

    const proxy = new Proxy(ret, {
      get: function (target, prop: string, receiver) {
        if (target[prop]) {
          return target[prop]
        }

        return transform(target[prop], (context) => {
          const { invoke } = context
          return invoke[ret.__step__]?.output?.[prop]
        })
      },
    })
     */

    return new Proxy(
      {
        __type: SymbolWorkflowStep,
        __step__: stepName,
        __returnProperties: [],
      },
      {
        get(target: any, p: string | symbol, receiver: any): any {
          if (p === "__type") {
            return target.__type
          }
          if (p === "__step__") {
            return target.__step__
          }
          target.__returnProperties = p
          return target
        },
      }
    )
  }
}

export function createStep<TInvokeInput extends unknown[], TInvokeResult>(
  name: string,
  invokeFn: (
    context: any,
    ...stepInputs: [...TInvokeInput]
  ) => Promise<TInvokeResult>,
  compensateFn?: Function
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
      applyStep<[...StepReturn<TInvokeInput[number]>[]], TInvokeResult>({
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
