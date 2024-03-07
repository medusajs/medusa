import { isObject } from "./is-object"

type Operator = string
type ComplexOperator = {
  mapTo: string
  value: (value: string) => string
}

type OperatorMap = { [Key: string]: Operator | ComplexOperator }

const operatorMap: OperatorMap = {
  eq: "$eq",
  ne: "$ne",
  lt: "$lt",
  lte: "$lte",
  gt: "$gt",
  gte: "$gte",
  in: "$in",
  contains: {
    mapTo: "$like",
    value: (value: string) => `%${value}%`,
  },
  starts_with: {
    mapTo: "$like",
    value: (value: string) => `${value}%`,
  },
  ends_with: {
    mapTo: "$like",
    value: (value: string) => `%${value}`,
  },
}

function isComplexOperator(
  operator: Operator | ComplexOperator
): operator is ComplexOperator {
  return isObject(operator)
}

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
 * - contains
 * - starts_with
 * - ends_with
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
    if (isComplexOperator(remappedKey)) {
      output[remappedKey.mapTo] = remappedKey.value(input[key])
      continue
    }

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
