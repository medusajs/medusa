import { deepCopy, OrchestrationUtils, promiseAll } from "@medusajs/utils"

async function resolveProperty(property, transactionContext) {
  const { invoke: invokeRes } = transactionContext

  let res

  if (property?.__type === OrchestrationUtils.SymbolInputReference) {
    res = transactionContext.payload
  } else if (
    property?.__type === OrchestrationUtils.SymbolMedusaWorkflowResponse
  ) {
    res = await resolveValue(property.$result, transactionContext)
  } else if (
    property?.__type === OrchestrationUtils.SymbolWorkflowStepTransformer
  ) {
    res = await property.__resolver(transactionContext)
  } else if (property?.__type === OrchestrationUtils.SymbolWorkflowStep) {
    const output =
      invokeRes[property.__step__]?.output ?? invokeRes[property.__step__]
    if (output?.__type === OrchestrationUtils.SymbolWorkflowStepResponse) {
      res = output.output
    } else {
      res = output
    }
  } else if (
    property?.__type === OrchestrationUtils.SymbolWorkflowStepResponse
  ) {
    res = property.output
  } else {
    res = property
  }

  return res
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
      parentRef[key] = deepCopy(
        await resolveProperty(inputTOUnwrap[key], transactionContext)
      )

      if (typeof parentRef[key] === "object") {
        parentRef[key] = await unwrapInput(parentRef[key], parentRef[key])
      }
    }

    return parentRef
  }

  const copiedInput =
    input?.__type === OrchestrationUtils.SymbolWorkflowWorkflowData
      ? input.output
      : input

  const result = copiedInput?.__type
    ? await resolveProperty(copiedInput, transactionContext)
    : await unwrapInput(copiedInput, {})

  return result && JSON.parse(JSON.stringify(result))
}
