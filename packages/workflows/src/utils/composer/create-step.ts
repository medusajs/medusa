import {
  SymbolInputReference,
  SymbolMedusaWorkflowComposerContext,
  SymbolWorkflowStep,
  SymbolWorkflowStepBind,
  SymbolWorkflowStepReturn,
} from "./symbol"
import {
  CreateWorkflowComposerContext,
  StepFunction,
  StepFunctionResult,
  StepInput,
} from "./type"

interface ApplyStepOptions {
  stepName: string
  stepInputs: StepInput[]
  invokeFn: Function
  compensateFn?: Function
}

function applyStep({
  stepName,
  stepInputs,
  invokeFn,
  compensateFn,
}: ApplyStepOptions): StepFunctionResult {
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
        const previousResultResults = stepInputs
          .map((stepInput) => {
            if (stepInput?.__type === SymbolInputReference) {
              return stepInput.value
            }

            const stepInputs_ = Array.isArray(stepInput)
              ? stepInput
              : [stepInput]

            return stepInputs_.map((st) => {
              return st?.__type === SymbolWorkflowStep
                ? invokeRes[st.__step__]?.output
                : st
            })
          })
          .flat()

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

    return {
      __type: SymbolWorkflowStep,
      __step__: stepName,
    }
  }
}

export function createStep(
  name: string,
  invokeFn: Function,
  compensateFn?: Function
): StepFunction {
  const stepName = name ?? invokeFn.name

  const returnFn = function (...stepInputs: StepInput[]) {
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

    return stepBinder(
      applyStep({
        stepName,
        stepInputs,
        invokeFn,
        compensateFn,
      })
    )
  }

  returnFn.__type = SymbolWorkflowStepBind
  returnFn.__step__ = stepName

  return returnFn
}
