import { resolveValue } from "./resolve-value"
import {
  SymbolMedusaWorkflowComposerContext,
  SymbolWorkflowHook,
} from "./symbol"
import {
  CreateWorkflowComposerContext,
  StepExecutionContext,
  StepReturn,
} from "./type"

/**
 * Creates a hook that can be used to modify the output of a step which will
 * be used to compose the input of another step.
 *
 * @param name
 * @param values
 */
export function hook<TOutput>(
  name: string,
  ...values: any[]
): StepReturn<TOutput> {
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
