import {
  isObject,
  OrchestrationUtils,
  parseStringifyIfNecessary,
  promiseAll,
} from "@zjedene-medusa/utils"
import * as util from "node:util"

type InputPrimitive = string | Symbol
type InputObject = object & { __type?: string | Symbol; output?: any }

function resolveProperty(property: any, transactionContext: any) {
  const { invoke: invokeRes } = transactionContext

  let res: any

  if (property.__type === OrchestrationUtils.SymbolInputReference) {
    res = transactionContext.payload
  } else if (
    property.__type === OrchestrationUtils.SymbolMedusaWorkflowResponse
  ) {
    res = resolveValue(property.$result, transactionContext)
  } else if (
    property.__type === OrchestrationUtils.SymbolWorkflowStepTransformer
  ) {
    res = property.__resolver(transactionContext)
  } else if (property.__type === OrchestrationUtils.SymbolWorkflowStep) {
    const output =
      invokeRes[property.__step__]?.output ?? invokeRes[property.__step__]
    if (output?.__type === OrchestrationUtils.SymbolWorkflowStepResponse) {
      res = output.output
    } else {
      res = output
    }
  } else if (
    property.__type === OrchestrationUtils.SymbolWorkflowStepResponse
  ) {
    res = property.output
  } else {
    res = property
  }

  return res
}

function unwrapInput({
  inputTOUnwrap,
  parentRef,
  transactionContext,
}: {
  inputTOUnwrap: InputObject
  parentRef: any
  transactionContext: any
}): any {
  if (inputTOUnwrap == null) {
    return inputTOUnwrap
  }

  if (Array.isArray(inputTOUnwrap)) {
    const promises: { promise: Promise<any>; index: number }[] = []
    const resolvedItems: any[] = new Array(inputTOUnwrap.length)

    for (let i = 0; i < inputTOUnwrap.length; i++) {
      const item = inputTOUnwrap[i]
      if (item == null || typeof item !== "object") {
        resolvedItems[i] = item
      } else {
        const resolved = resolveValue(item, transactionContext)
        if (resolved instanceof Promise) {
          promises.push({ promise: resolved, index: i })
        } else {
          resolvedItems[i] = resolved
        }
      }
    }

    if (promises.length > 0) {
      return promiseAll(promises.map((p) => p.promise)).then(
        (resolvedPromises) => {
          for (let i = 0; i < promises.length; i++) {
            resolvedItems[promises[i].index] = resolvedPromises[i]
          }
          return resolvedItems
        }
      )
    }

    return resolvedItems
  }

  if (util.types.isProxy(inputTOUnwrap)) {
    const resolved = resolveProperty(inputTOUnwrap, transactionContext)
    if (resolved instanceof Promise) {
      return resolved.then((r) => {
        inputTOUnwrap = r
        if (!isObject(inputTOUnwrap)) {
          return inputTOUnwrap
        }
        return unwrapInput({
          inputTOUnwrap,
          parentRef: {},
          transactionContext,
        })
      })
    }
    inputTOUnwrap = resolved
  }

  if (!isObject(inputTOUnwrap)) {
    return inputTOUnwrap
  }

  const keys = Object.keys(inputTOUnwrap)
  const promises: { promise: Promise<any>; keyIndex: number }[] = []

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]

    if (inputTOUnwrap[key] == null || typeof inputTOUnwrap[key] !== "object") {
      parentRef[key] = inputTOUnwrap[key]
      continue
    }

    const result = resolveProperty(inputTOUnwrap[key], transactionContext)

    if (result instanceof Promise) {
      promises.push({ promise: result, keyIndex: i })
    } else {
      parentRef[key] = result

      if (result != null && typeof result === "object") {
        const unwrapped = unwrapInput({
          inputTOUnwrap: result,
          parentRef: {},
          transactionContext,
        })
        if (unwrapped instanceof Promise) {
          promises.push({
            promise: unwrapped.then((r) => ({ key, value: r })),
            keyIndex: i,
          })
        } else {
          parentRef[key] = unwrapped
        }
      }
    }
  }

  if (promises.length > 0) {
    return promiseAll(promises.map((p) => p.promise)).then(
      (resolvedPromises) => {
        for (let i = 0; i < promises.length; i++) {
          const resolved = resolvedPromises[i]
          if (resolved && typeof resolved === "object" && "key" in resolved) {
            parentRef[resolved.key] = resolved.value
          } else {
            const key = keys[promises[i].keyIndex]
            parentRef[key] = resolved

            if (resolved != null && typeof resolved === "object") {
              const unwrapped = unwrapInput({
                inputTOUnwrap: resolved,
                parentRef: {},
                transactionContext,
              })
              if (unwrapped instanceof Promise) {
                return unwrapped.then((r) => {
                  parentRef[key] = r
                  return parentRef
                })
              }
              parentRef[key] = unwrapped
            }
          }
        }
        return parentRef
      }
    )
  }

  return parentRef
}

export function resolveValue(
  input: InputPrimitive | InputObject | unknown | undefined,
  transactionContext: any
): Promise<any> | any {
  if (input == null || typeof input !== "object") {
    return input
  }

  const input_ =
    (input as InputObject)?.__type ===
    OrchestrationUtils.SymbolWorkflowWorkflowData
      ? (input as InputObject).output
      : input

  let result: any

  if (input_?.__type) {
    result = resolveProperty(input_, transactionContext)
    if (result instanceof Promise) {
      return result.then((r) => parseStringifyIfNecessary(r))
    }
    return parseStringifyIfNecessary(result)
  } else {
    result = unwrapInput({
      inputTOUnwrap: input_,
      parentRef: {},
      transactionContext,
    })
    if (result instanceof Promise) {
      return result.then((r) => parseStringifyIfNecessary(r))
    }
    return parseStringifyIfNecessary(result)
  }
}
