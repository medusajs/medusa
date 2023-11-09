export function createStep(
  name: string,
  invokeFn: Function,
  compensateFn?: Function
) {
  const stepName = name ?? invokeFn.name

  const returnFn = function (this: any, ...otherStepInput) {
    const step = global.step
    if (!step) {
      throw new Error(
        "createStep must be used inside a createWorkflow definition"
      )
    }

    return step(function (this: any) {
      if (!this.workflowId) {
        throw new Error(
          "createStep must be used inside a createWorkflow definition"
        )
      }

      const handler = {
        invoke: async (transactionContext) => {
          const { invoke } = transactionContext

          const previousResultResults = otherStepInput.map((st) =>
            st?.__step__ ? invoke[st.__step__]?.output : st
          )

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
