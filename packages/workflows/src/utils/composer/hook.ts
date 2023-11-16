import { resolveValue } from "./resolve-value"
import {
  SymbolMedusaWorkflowComposerContext,
  SymbolWorkflowHook,
} from "./symbol"
import { CreateWorkflowComposerContext, StepExecutionContext } from "./type"

export function hook(name: string, ...values: any[]): unknown {
  const hookBinder = (
    global[SymbolMedusaWorkflowComposerContext] as CreateWorkflowComposerContext
  ).hookBinder

  return hookBinder(name, function (context) {
    return {
      __value: async function (transactionContext) {
        const executionContext: StepExecutionContext = {
          container: transactionContext.container,
          metadata: transactionContext.metadata,
          context: transactionContext.context,
        }

        const allValues = await resolveValue(values, transactionContext)
        const stepValue = JSON.parse(JSON.stringify(allValues))

        let finalResult
        const functions = context.hooksCallback_[name]
        for (let i = 0; i < functions.length; i++) {
          const fn = functions[i]
          const arg = i === 0 ? stepValue : finalResult
          finalResult = await fn.apply(fn, [arg, executionContext])
        }
        return finalResult
      },
      __type: SymbolWorkflowHook,
    }
  })
}
