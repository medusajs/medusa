const operatorMap = {
  eq: "$eq",
  ne: "$ne",
  lt: "$lt",
  lte: "$lte",
  gt: "$gt",
  gte: "$gte",
  in: "$in",
}

import { isObject } from "./is-object"

function isPrimitive(value: any) {
  return (
    value === null || (typeof value !== "object" && typeof value !== "function")
  )
}

/**
 * Remap the operator keys from the input object to the output object.
 * The list of operators that are remapped are:
 * - eq
 * - ne
 * - lt
 * - lte
 * - gt
 * - gte
 * - in
 *
 * @param input
 * @param entryPoint
 */
export function operatorMapReMapper(
  input: any,
  entryPoint = true
): Record<string, unknown> {
  const output: Record<string, unknown> = {}

  if (entryPoint && Array.isArray(input)) {
    return {
      $or: input.map((i) => operatorMapReMapper(i, false)),
    }
  }

  if (isPrimitive(input)) {
    return input
  }

  for (const key of Object.keys(input)) {
    const remappedKey = operatorMap[key] ?? key
    if (Array.isArray(input[key])) {
      output[remappedKey] = (input[key] as Array<any>).map((i) =>
        operatorMapReMapper(i, false)
      )
    } else if (isObject(input[key])) {
      output[remappedKey] = operatorMapReMapper(
        input[key] as Record<string, unknown>,
        false
      )
    } else {
      output[remappedKey] = input[key]
    }
  }

  return output
}
