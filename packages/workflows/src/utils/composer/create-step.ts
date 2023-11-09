import { WorkflowContext } from "./type"

export function createStep(
  name: string,
  invokeFn: Function,
  compensateFn?: Function
) {
  const stepName = name ?? invokeFn.name

  const returnFn = function (this: WorkflowContext, ...otherStepInput) {
    const step = global.step
    if (!step) {
      throw new Error(
        "createStep must be used inside a createWorkflow definition"
      )
    }

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
              stepInput = Array.isArray(stepInput) ? stepInput : [stepInput]
              return stepInput.map((st) => {
                console.log(st.__step__, invokeRes[st.__step__])
                return st?.__step__ ? invokeRes[st.__step__]?.output : st
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
        __step__: stepName,
      }
    })
  }

  returnFn.__step__ = stepName

  return returnFn
}
