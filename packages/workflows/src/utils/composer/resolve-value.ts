import { isDefined, promiseAll } from "@medusajs/utils"
import {
  SymbolInputReference,
  SymbolWorkflowHook,
  SymbolWorkflowStep,
  SymbolWorkflowStepTransformer,
} from "./symbol"

export async function resolveValue(step, transactionContext) {
  const { invoke: invokeRes } = transactionContext
  const step_ = Array.isArray(step) ? step : [step]

  return await promiseAll(
    step_.map(async (st) => {
      if (st?.__type === SymbolInputReference) {
        return st.__value
      } else if (st?.__type === SymbolWorkflowStepTransformer) {
        if (isDefined(st.__value)) {
          return st.__value
        }
        return await st(transactionContext)
      } else if (st?.__type === SymbolWorkflowHook) {
        return await st.__value(transactionContext)
      } else if (st?.__type === SymbolWorkflowStep) {
        return invokeRes[st.__step__]?.output
      } else {
        return st
      }
    })
  )
}
