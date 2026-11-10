import {
  StepAction,
  StepContext,
  StepOptions,
  StepResult,
} from "../definition/types"
import { NonRetryableError, RunTimeoutError, StepTimeoutError } from "../errors"
import { serializeError } from "../serialization/serializer"
import { StepOutcome } from "../store/store"
import { Clock } from "./clock"

export type InvokeOutcome =
  | StepResult
  | {
      kind: "failure"
      error: unknown
      permanent: boolean
      timedOut?: boolean
      partial?: { output: unknown; compensateInput: unknown }
    }

export interface InvokeRequest {
  ctx: StepContext
  timeoutMs?: number
  clock: Clock
  call: (fn: () => Promise<StepResult>) => Promise<StepResult>
  handler: (ctx: StepContext) => Promise<StepResult>
  controller: AbortController
  /**
   * Set when the run itself timed out while this step was running.
   */
  runTimedOut: () => RunTimeoutError | undefined
}

/**
 * Calls an invoke handler once. A step timeout aborts the signal at the
 * deadline; a handler that ignores it still runs to completion, and its result
 * is then discarded.
 */
export async function invokeOnce(
  request: InvokeRequest
): Promise<InvokeOutcome> {
  const { ctx, timeoutMs, controller, clock } = request
  const startedAt = clock.now()
  let timer: unknown
  let stepTimedOut = false

  if (timeoutMs) {
    timer = clock.setTimeout(() => {
      stepTimedOut = true
      controller.abort()
    }, timeoutMs)
  }
  const timedOut = () =>
    !!timeoutMs && (stepTimedOut || clock.now() - startedAt > timeoutMs)

  try {
    const result = await request.call(() => request.handler(ctx))

    if (timedOut()) {
      return {
        kind: "failure",
        error: new StepTimeoutError(ctx.stepId, timeoutMs!),
        permanent: true,
        timedOut: true,
        partial:
          result?.kind === "output"
            ? { output: result.output, compensateInput: result.compensateInput }
            : undefined,
      }
    }

    return normalizeResult(result)
  } catch (error) {
    const runTimeout = request.runTimedOut()
    if (runTimeout) {
      return { kind: "failure", error: runTimeout, permanent: true }
    }

    // A handler that honours the aborted signal rejects; the step still timed
    // out.
    if (timedOut()) {
      return {
        kind: "failure",
        error: new StepTimeoutError(ctx.stepId, timeoutMs!),
        permanent: true,
        timedOut: true,
      }
    }

    if (isNonRetryable(error)) {
      const compensateInput = (error as NonRetryableError).compensateInput
      return {
        kind: "failure",
        error,
        permanent: true,
        partial:
          compensateInput !== undefined
            ? { output: undefined, compensateInput }
            : undefined,
      }
    }

    return { kind: "failure", error, permanent: false }
  } finally {
    if (timer !== undefined) {
      clock.clearTimeout(timer)
    }
  }
}

/**
 * Errors from other packages opt in with `nonRetryable: true` and an optional
 * `compensateInput`, without depending on this package.
 */
export function isNonRetryable(error: unknown): boolean {
  return (
    error instanceof NonRetryableError ||
    (!!error &&
      typeof error === "object" &&
      (error as any).nonRetryable === true)
  )
}

function normalizeResult(result: StepResult | undefined): StepResult {
  if (!result || typeof result !== "object" || !("kind" in result)) {
    return { kind: "output", output: result, compensateInput: result }
  }
  return result
}

export function idempotencyKey(ctx: {
  workflowId: string
  transactionId: string
  stepId: string
  action: StepAction
}) {
  return {
    workflowId: ctx.workflowId,
    transactionId: ctx.transactionId,
    stepId: ctx.stepId,
    action: ctx.action,
  }
}

/**
 * The completion an async handler's outcome stores, if any.
 */
export function backgroundOutcome(
  options: Pick<StepOptions, "nested">,
  outcome: InvokeOutcome
): StepOutcome | undefined {
  switch (outcome.kind) {
    case "wait":
      return undefined
    case "output":
      // A step that hosts a child run is completed by the child.
      return options.nested
        ? undefined
        : {
            kind: "output",
            output: outcome.output,
            compensateInput: outcome.compensateInput,
          }
    case "skip":
      // A false condition skips the step before any child run starts.
      return { kind: "skip" }
    case "failure":
      return {
        kind: "failure",
        error: serializeError(outcome.error),
        permanent: outcome.permanent,
        timedOut: outcome.timedOut,
      }
  }
}
