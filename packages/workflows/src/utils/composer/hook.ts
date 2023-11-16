import { resolveValue } from "./resolve-value"
import {
  SymbolMedusaWorkflowComposerContext,
  SymbolWorkflowHook,
} from "./symbol"
import { CreateWorkflowComposerContext } from "./type"

export function hook(name: string, ...values: any[]): unknown {
  const hookBinder = (
    global[SymbolMedusaWorkflowComposerContext] as CreateWorkflowComposerContext
  ).hookBinder

  return hookBinder(name, function (context) {
    return {
      __value: async function (transactionContext) {
        const allValues = await resolveValue(values, transactionContext)
        const stepValues = JSON.parse(JSON.stringify(allValues))

        let finalResult
        const functions = context.hooksCallback_[name]
        for (let i = 0; i < functions.length; i++) {
          const fn = functions[i]
          const args = i === 0 ? stepValues : [finalResult]
          finalResult = await fn.apply(fn, [transactionContext, ...args])
        }
        return finalResult
      },
      __type: SymbolWorkflowHook,
    }
  })
}
