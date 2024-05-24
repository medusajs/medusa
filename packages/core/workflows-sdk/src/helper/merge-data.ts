import { PipelineHandler, WorkflowArguments } from "./pipe"
import { isObject } from "@medusajs/utils"

/**
 * Pipe utils that merges data from an object into a new object.
 * The new object will have a target key with the merged data from the keys if specified.
 * @deprecated
 * @param keys
 * @param target
 */
export function mergeData<
  T extends Record<string, unknown> = Record<string, unknown>,
  TKeys extends keyof T = keyof T,
  Target extends "payload" | string = string
>(keys: TKeys[] = [], target?: Target): PipelineHandler {
  return async function ({ data }: WorkflowArguments<T>) {
    const workingKeys = (keys.length ? keys : Object.keys(data)) as TKeys[]
    const value = workingKeys.reduce((acc, key) => {
      let targetAcc = { ...(target ? acc[target as string] : acc) }
      targetAcc ??= {}

      if (Array.isArray(data[key as string])) {
        targetAcc[key as string] = data[key as string]
      } else if (isObject(data[key as string])) {
        targetAcc = {
          ...targetAcc,
          ...(data[key as string] as object),
        }
      } else {
        targetAcc[key as string] = data[key as string]
      }

      if (target) {
        acc[target as string] = {
          ...acc[target as string],
          ...targetAcc,
        }
      } else {
        acc = targetAcc
      }

      return acc
    }, {})

    return {
      alias: target,
      value: target ? value[target as string] : value,
    }
  }
}
