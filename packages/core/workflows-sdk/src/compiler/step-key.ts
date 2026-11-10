import type { IdempotencyKeyParts } from "@medusajs/types"

export type StepKeyParts = IdempotencyKeyParts

const escapePart = (part: string) =>
  part.replace(/\\/g, "\\\\").replace(/:/g, "\\:")

/**
 * Formats `workflowId:transactionId:stepId:action`. A `:` inside a part is
 * escaped, so ids that contain one can still be parsed back.
 */
export function formatStepKey(parts: StepKeyParts): string {
  return [parts.workflowId, parts.transactionId, parts.stepId, parts.action]
    .map(escapePart)
    .join(":")
}

/**
 * Parses a key made by `formatStepKey`, or a legacy unescaped key with exactly
 * four parts.
 */
export function parseStepKey(key: string | StepKeyParts): StepKeyParts {
  if (typeof key !== "string") {
    return key
  }

  const parts: string[] = []
  let current = ""
  for (let i = 0; i < key.length; i++) {
    const char = key[i]
    if (char === "\\" && i + 1 < key.length) {
      current += key[++i]
    } else if (char === ":") {
      parts.push(current)
      current = ""
    } else {
      current += char
    }
  }
  parts.push(current)

  if (
    parts.length !== 4 ||
    (parts[3] !== "invoke" && parts[3] !== "compensate")
  ) {
    throw new Error(`Invalid step idempotency key: ${key}`)
  }

  return {
    workflowId: parts[0],
    transactionId: parts[1],
    stepId: parts[2],
    action: parts[3],
  }
}
