import { isDefined, promiseAll } from "@medusajs/utils"
import {
  SymbolInputReference,
  SymbolWorkflowHook,
  SymbolWorkflowStep,
  SymbolWorkflowStepTransformer,
} from "./symbol"

async function resolveProperty(property, transactionContext) {
  const { invoke: invokeRes } = transactionContext
  const step_ = Array.isArray(property) ? property : [property]

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

export async function resolveValue(input, transactionContext) {
  const unwrapInput = async (
    inputTOUnwrap: Record<string, unknown>,
    parentRef: any
  ) => {
    if (inputTOUnwrap == null) {
      return inputTOUnwrap
    }

    if (Array.isArray(inputTOUnwrap)) {
      return await promiseAll(
        inputTOUnwrap.map((i) => unwrapInput(i, transactionContext))
      )
    }

    if (typeof inputTOUnwrap !== "object") {
      return inputTOUnwrap
    }

    for (const key in inputTOUnwrap) {
      parentRef[key] = await resolveProperty(
        inputTOUnwrap[key],
        transactionContext
      )
      if (typeof parentRef[key] === "object") {
        await unwrapInput(parentRef[key], parentRef[key])
      }
    }

    return parentRef
  }

  const result =
    "__type" in input
      ? await resolveProperty(input, transactionContext)
      : await unwrapInput(input, {})

  return result
}
