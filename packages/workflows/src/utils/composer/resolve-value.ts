import { isDefined, promiseAll } from "@medusajs/utils"
import {
  SymbolInputReference,
  SymbolWorkflowHook,
  SymbolWorkflowStep,
  SymbolWorkflowStepTransformer,
} from "./symbol"

async function resolveProperty(property, transactionContext) {
  const { invoke: invokeRes } = transactionContext

  if (property?.__type === SymbolInputReference) {
    return property.__value
  } else if (property?.__type === SymbolWorkflowStepTransformer) {
    if (isDefined(property.__value)) {
      return property.__value
    }
    return await property(transactionContext)
  } else if (property?.__type === SymbolWorkflowHook) {
    return await property.__value(transactionContext)
  } else if (property?.__type === SymbolWorkflowStep) {
    return invokeRes[property.__step__]?.output
  } else {
    return property
  }
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
