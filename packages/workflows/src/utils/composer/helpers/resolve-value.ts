import { promiseAll } from "@medusajs/utils"
import {
  SymbolInputReference,
  SymbolWorkflowHook,
  SymbolWorkflowStep,
  SymbolWorkflowStepResponse,
  SymbolWorkflowStepTransformer,
} from "./symbol"

async function resolveProperty(property, transactionContext) {
  const { invoke: invokeRes } = transactionContext

  if (property?.__type === SymbolInputReference) {
    return transactionContext.payload
  } else if (property?.__type === SymbolWorkflowStepTransformer) {
    return await property.__resolver(transactionContext)
  } else if (property?.__type === SymbolWorkflowHook) {
    return await property.__value(transactionContext)
  } else if (property?.__type === SymbolWorkflowStep) {
    const output = invokeRes[property.__step__]?.output
    if (output?.__type === SymbolWorkflowStepResponse) {
      return output.output
    }

    return output
  } else if (property?.__type === SymbolWorkflowStepResponse) {
    return property.output
  } else {
    return property
  }
}

/**
 * @internal
 */
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

    for (const key of Object.keys(inputTOUnwrap)) {
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

  const result = input?.__type
    ? await resolveProperty(input, transactionContext)
    : await unwrapInput(input, {})

  return result && JSON.parse(JSON.stringify(result))
}
