import { z, ZodError } from "@medusajs/deps/zod"
import { isObject, MedusaError } from "@medusajs/utils"

/**
 * Zod v4 does not export public issue types, so we use internal types from z.core.
 * These are prefixed with $ to indicate they are internal.
 * While internal, they are stable for type-checking purposes.
 * Runtime behavior relies on the `code` property and duck-typing, not these types.
 *
 * IMPORTANT: All runtime code uses duck-typing guards to gracefully handle
 * potential changes in Zod's internal structure across versions.
 */
type ZodIssue = z.core.$ZodIssue
type ZodIssueInvalidValue = z.core.$ZodIssueInvalidValue

/**
 * Duck-typed issue types for runtime guards.
 * These match the expected shape without relying on Zod's internal types.
 */
type InvalidTypeIssue = {
  code: "invalid_type"
  expected: string
  path: PropertyKey[]
}

type InvalidUnionIssue = {
  code: "invalid_union"
  errors: unknown[]
  path: PropertyKey[]
  message: string
}

/**
 * Runtime guard for invalid_type issues.
 * Uses duck-typing to avoid relying on internal Zod types at runtime.
 */
function isInvalidTypeIssue(issue: unknown): issue is InvalidTypeIssue {
  return (
    isObject(issue) &&
    "code" in issue &&
    issue.code === "invalid_type" &&
    "expected" in issue &&
    "path" in issue &&
    Array.isArray(issue.path)
  )
}

/**
 * Runtime guard for invalid_union issues.
 * Uses duck-typing to avoid relying on internal Zod types at runtime.
 */
function isInvalidUnionIssue(issue: unknown): issue is InvalidUnionIssue {
  return (
    isObject(issue) &&
    "code" in issue &&
    issue.code === "invalid_union" &&
    "errors" in issue &&
    Array.isArray(issue.errors)
  )
}

/**
 * Runtime guard for invalid_value issues (enums, literals).
 * Uses duck-typing to avoid relying on internal Zod types at runtime.
 */
function isInvalidValueIssue(issue: unknown): issue is {
  code: "invalid_value"
  values?: unknown[]
  path: PropertyKey[]
  message: string
} {
  return (
    isObject(issue) &&
    "code" in issue &&
    issue.code === "invalid_value" &&
    "path" in issue &&
    Array.isArray(issue.path)
  )
}

function getReceivedValue(issue: ZodIssueInvalidValue, body: unknown): unknown {
  if ("input" in issue) {
    return issue.input
  } else if ("received" in issue) {
    return issue.received
  } else {
    return getValueFromBody(issue, body)
  }
}

const formatPath = (issue: { path: PropertyKey[] }) => {
  return issue.path.join(", ")
}

/**
 * Gets the actual value from body using issue path.
 * Used to distinguish between missing fields and wrong type values.
 * Safely traverses the body object using the issue path.
 */
function getValueFromBody(
  issue: { path: PropertyKey[] },
  body: unknown
): unknown {
  if (!isObject(body)) {
    return undefined
  }
  return issue.path.reduce<unknown>((acc, curr: PropertyKey) => {
    if (!isObject(acc)) {
      return undefined
    }
    return (acc as Record<PropertyKey, unknown>)[curr]
  }, body)
}

const formatInvalidType = (issues: ZodIssue[], body?: unknown) => {
  const validIssues: InvalidTypeIssue[] = []
  for (const issue of issues) {
    if (isInvalidTypeIssue(issue)) {
      validIssues.push(issue)
    }
  }

  const expected = validIssues
    .map((i) => {
      // In Zod v4, check if value exists in body to distinguish wrong type vs missing
      const receivedValue =
        body !== undefined ? getValueFromBody(i, body) : undefined
      if (receivedValue !== undefined) {
        return i.expected
      }
      return
    })
    .filter(Boolean)

  if (!expected.length) {
    return
  }

  const firstIssue = validIssues[0]
  if (!firstIssue) {
    return
  }

  const received =
    body !== undefined ? getValueFromBody(firstIssue, body) : "unknown"

  return `Expected type: '${expected.join(", ")}' for field '${formatPath(
    firstIssue
  )}', got: '${received}'`
}

const formatRequiredField = (issues: ZodIssue[], body?: unknown) => {
  // Find the first issue that indicates a required field (value is undefined in body)
  const requiredIssue = issues
    .filter((i) => i != null)
    .find((i) => {
      if (isInvalidTypeIssue(i)) {
        // In Zod v4, check if value is undefined in body to detect missing fields
        const valueInBody =
          body !== undefined ? getValueFromBody(i, body) : undefined
        return valueInBody === undefined
      }
      // Also check invalid_value issues - if value is undefined in body
      if (isInvalidValueIssue(i)) {
        const valueInBody =
          body !== undefined ? getValueFromBody(i, body) : undefined
        return valueInBody === undefined
      }
      return false
    })

  if (!requiredIssue) {
    return
  }

  return `Field '${formatPath(requiredIssue)}' is required`
}

const formatUnionError = (
  issue: unknown,
  body?: unknown
): string | undefined => {
  // Use runtime guard to validate the issue structure
  if (!isInvalidUnionIssue(issue)) {
    return isObject(issue) && "message" in issue
      ? String(issue.message)
      : undefined
  }

  const parentPath = issue.path ?? []
  const issues = issue.errors
    .flatMap((e: unknown) => {
      // In Zod v4, errors is an array of arrays (each inner array contains issues for a union variant)
      if (Array.isArray(e)) {
        return e
      }
      // Fallback for object with issues property (for compatibility)
      if (isObject(e) && "issues" in e) {
        return (e as { issues: unknown[] }).issues
      }
      return []
    })
    .filter((i): i is ZodIssue => isObject(i) && "path" in i)
    .map((i) => ({
      ...i,
      path: [...parentPath, ...i.path],
    }))

  if (!issues.length) {
    return issue.message
  }

  return (
    formatInvalidType(issues, body) ||
    formatRequiredField(issues, body) ||
    issue.message
  )
}

const formatError = (err: ZodError, body: unknown) => {
  const issueMessages = err.issues.slice(0, 3).map((issue) => {
    switch (issue.code) {
      case "invalid_type":
        return (
          formatInvalidType([issue], body) ||
          formatRequiredField([issue], body) ||
          issue.message
        )
      case "invalid_value": {
        const invalidValueIssue = issue as ZodIssueInvalidValue
        const receivedValue = getReceivedValue(issue, body)

        const hasReceivedValue = receivedValue !== undefined

        if (invalidValueIssue.values) {
          if (!hasReceivedValue) {
            return `Field '${formatPath(issue)}' is required`
          }

          return `Expected: '${invalidValueIssue.values.join(
            ", "
          )}' for field '${formatPath(issue)}', but got: '${receivedValue}'`
        }

        if (!hasReceivedValue) {
          return `Field '${formatPath(issue)}' is required`
        }
        return issue.message
      }
      case "invalid_union":
        return formatUnionError(issue, body)
      case "unrecognized_keys":
        return `Unrecognized fields: '${issue.keys.join(", ")}'`
      case "too_small":
        return `Value for field '${formatPath(
          issue
        )}' too small, expected at least: '${issue.minimum}'`
      case "too_big":
        return `Value for field '${formatPath(
          issue
        )}' too big, expected at most: '${issue.maximum}'`
      case "not_multiple_of":
        return `Value for field '${formatPath(issue)}' not multiple of: '${
          issue.divisor
        }'`
      case "invalid_format":
      case "invalid_key":
      case "invalid_element":
      case "custom":
      default:
        return issue.message
    }
  })

  return issueMessages.join("; ")
}

function isZodError(err: unknown): err is ZodError {
  return (
    err instanceof ZodError ||
    (isObject(err) && "issues" in err && Array.isArray(err.issues))
  )
}

export async function zodValidator<T>(
  zodSchema: z.ZodObject<any, any> | z.ZodType<any, any, any>,
  body: T
): Promise<z.output<z.ZodObject<any, any> | z.ZodType<any, any, any>>> {
  let strictSchema = zodSchema
  if ("strict" in zodSchema) {
    strictSchema = zodSchema.strict()
  }

  try {
    return await strictSchema.parseAsync(body)
  } catch (err) {
    if (isZodError(err)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Invalid request: ${formatError(err, body)}`
      )
    }

    throw err
  }
}
