import {
  SymbolInputReferece,
  SymbolWorkflowStep,
  SymbolWorkflowStepBind,
} from "./symbol"
import { WorkflowContext } from "./type"

export function createStep(
  name: string,
  invokeFn: Function,
  compensateFn?: Function
) {
  const stepName = name ?? invokeFn.name

  const returnFn = function (this: WorkflowContext, ...otherStepInput) {
    if (!global.MedusaWorkflowComposerContext) {
      throw new Error(
        "createStep must be used inside a createWorkflow definition"
      )
    }

    const step = global.MedusaWorkflowComposerContext.step
    return step(function (this: WorkflowContext) {
      if (!this.workflowId) {
        throw new Error(
          "createStep must be used inside a createWorkflow definition"
        )
      }

      const handler = {
        invoke: async (transactionContext) => {
          const { invoke: invokeRes } = transactionContext

          // Garb all previous invoke results by step name
          const previousResultResults = otherStepInput
            .map((stepInput) => {
              let value = stepInput
              if (stepInput?.__type === SymbolInputReferece) {
                value = stepInput.value
              }

              stepInput = Array.isArray(value) ? value : [value]
              return stepInput.map((st) => {
                return st?.__type === SymbolWorkflowStep
                  ? invokeRes[st.__step__]?.output
                  : st
              })
            })
            .flat()

          const args = [transactionContext, ...previousResultResults]

          const output = await invokeFn.apply(this, args)

          return {
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
    })
  }

  returnFn.__type = SymbolWorkflowStepBind
  returnFn.__step__ = stepName

  return returnFn
}
