import type { IdempotencyKeyParts } from "@medusajs/framework/types"
import { MedusaError } from "@medusajs/framework/utils"
import { parseStepKey, StepResponse } from "@medusajs/framework/workflows-sdk"

export function parseKey(
  key: string | IdempotencyKeyParts
): IdempotencyKeyParts {
  try {
    return parseStepKey(key) as IdempotencyKeyParts
  } catch (error) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      (error as Error).message
    )
  }
}

/**
 * Only waiting invoke steps can be completed from outside: compensations run
 * by the engine and are never async.
 */
export function parseInvokeKey(
  key: string | IdempotencyKeyParts
): IdempotencyKeyParts {
  const parts = parseKey(key)
  if (parts.action === "compensate") {
    throw new MedusaError(
      MedusaError.Types.NOT_ALLOWED,
      `Step ${parts.stepId} of transaction ${parts.transactionId} cannot be completed from outside while compensating: compensation steps are not async`
    )
  }
  return parts
}

/**
 * `setStepSuccess` accepts a `StepResponse`, whose output and compensation
 * input can differ, or a plain value used as both.
 */
export function fromStepResponse(response: unknown) {
  if (response instanceof StepResponse) {
    return {
      output: response.output,
      compensateInput: response.compensateInput,
    }
  }
  return { output: response, compensateInput: response }
}

/**
 * The error a `setStepFailure` response fails the step with.
 */
export function toStepError(response: unknown): unknown {
  if (response instanceof Error) {
    return response
  }
  if (response instanceof StepResponse) {
    return new Error(
      typeof response.output === "string" ? response.output : "Step failed"
    )
  }
  if (typeof response === "string") {
    return new Error(response)
  }
  return Object.assign(new Error("Step failed"), { response })
}
