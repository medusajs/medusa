const DATE_TAG = "$wfDate"
const BIGINT_TAG = "$wfBigInt"

/**
 * JSON that keeps `Date` and `BigInt` values, and the message, name and stack
 * of errors. Anything with `toJSON` goes through it, as with
 * `JSON.stringify`.
 */
export function serialize(value: unknown): string {
  return JSON.stringify(value, function (this: any, key: string, current) {
    const original = this[key]
    if (original instanceof Error) {
      return serializeError(original)
    }
    if (original instanceof Date) {
      return { [DATE_TAG]: original.toISOString() }
    }
    if (typeof original === "bigint") {
      return { [BIGINT_TAG]: original.toString() }
    }
    return current
  })
}

export function deserialize<T = unknown>(text: string): T {
  return JSON.parse(text, (_key, value) => {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      if (DATE_TAG in value && Object.keys(value).length === 1) {
        return new Date(value[DATE_TAG])
      }
      if (BIGINT_TAG in value && Object.keys(value).length === 1) {
        return BigInt(value[BIGINT_TAG])
      }
    }
    return value
  })
}

export function cloneValue<T>(value: T): T {
  if (value === undefined) {
    return value
  }
  return deserialize<T>(serialize(value))
}

export function serializeError(error: unknown): {
  name?: string
  message: string
  stack?: string
  [key: string]: unknown
} {
  if (error instanceof Error) {
    const result: Record<string, unknown> = {}
    for (const key of Object.getOwnPropertyNames(error)) {
      const value = (error as any)[key]
      if (typeof value !== "function") {
        result[key] = value
      }
    }
    result.name ??= error.name
    result.message = error.message
    result.stack = error.stack
    return safeClone(result) as any
  }

  if (error && typeof error === "object") {
    const message = (error as any).message
    return {
      ...(safeClone(error) as object),
      message: typeof message === "string" ? message : String(message ?? error),
    }
  }

  return { message: String(error) }
}

function safeClone(value: unknown): unknown {
  try {
    return cloneValue(value)
  } catch {
    return { message: "Unknown non-serializable error" }
  }
}

export function deserializeError(error: {
  name?: string
  message: string
  stack?: string
  [key: string]: unknown
}): Error {
  const result = new Error(error.message)
  Object.assign(result, error)
  return result
}
