import { OrchestrationUtils } from "@medusajs/utils"

export function when(input, condition) {
  global[OrchestrationUtils.SymbolMedusaWorkflowComposerCondition] = {
    input,
    condition,
    steps: [],
  }

  let thenCalled = false
  process.nextTick(() => {
    if (!thenCalled) {
      throw new Error(`".then" is missing after "when" condition`)
    }
  })

  return {
    then: (fn) => {
      thenCalled = true
      const ret = fn()

      const applyCondition =
        global[OrchestrationUtils.SymbolMedusaWorkflowComposerCondition].steps

      for (const step of applyCondition) {
        step.if(input, condition)
      }

      delete global[OrchestrationUtils.SymbolMedusaWorkflowComposerCondition]
      return ret
    },
  }
}
