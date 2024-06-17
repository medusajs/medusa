import { deepCopy, OrchestrationUtils, promiseAll } from "@medusajs/utils"

async function resolveProperty(property, transactionContext) {
  const { invoke: invokeRes } = transactionContext

  if (property?.__type === OrchestrationUtils.SymbolInputReference) {
    return transactionContext.payload
  } else if (
    property?.__type === OrchestrationUtils.SymbolWorkflowStepTransformer
  ) {
    return await property.__resolver(transactionContext)
  } else if (property?.__type === OrchestrationUtils.SymbolWorkflowHook) {
    return await property.__value(transactionContext)
  } else if (property?.__type === OrchestrationUtils.SymbolWorkflowStep) {
    const output =
      invokeRes[property.__step__]?.output ?? invokeRes[property.__step__]
    if (output?.__type === OrchestrationUtils.SymbolWorkflowStepResponse) {
      return output.output
    }

    return output
  } else if (
    property?.__type === OrchestrationUtils.SymbolWorkflowStepResponse
  ) {
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
        inputTOUnwrap.map((i) => resolveValue(i, transactionContext))
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
        parentRef[key] = await unwrapInput(parentRef[key], parentRef[key])
      }
    }

    return parentRef
  }

  const copiedInput =
    input?.__type === OrchestrationUtils.SymbolWorkflowWorkflowData
      ? deepCopy(input.output)
      : deepCopy(input)

  const result = copiedInput?.__type
    ? await resolveProperty(copiedInput, transactionContext)
    : await unwrapInput(copiedInput, {})

  return result && JSON.parse(JSON.stringify(result))
}
