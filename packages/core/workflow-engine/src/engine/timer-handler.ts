import { WorkflowRegistry } from "../definition/registry"
import { StepTimeoutError } from "../errors"
import { Clock } from "../runtime/clock"
import type { Executor } from "../runtime/executor"
import { serializeError } from "../serialization/serializer"
import { CompletionResult, Store, TimerRecord } from "../store/store"
import { ContinueResult } from "./types"

const BUSY_RETRY_MS = 1000
// A run busy on this instance is released soon, usually when its executor
// parks, so its timers are tried again sooner than one held elsewhere.
const LOCAL_BUSY_RETRY_MS = 50

export interface TimerHandlerDeps {
  store: Store
  clock: Clock
  owner: string
  leaseTtlMs: number
  runTimeoutTakeoverMs: number
  registry: WorkflowRegistry
  activeExecutor(runId: string): Executor | undefined
  /**
   * Asks the dispatcher to look for due work at the given time.
   */
  wakeAt?(at: Date): void
  continueRun(
    runId: string,
    options?: { force?: boolean }
  ): Promise<ContinueResult>
}

/**
 * Acts on a claimed timer, then completes it, or defers it when another
 * holder of the run must act first.
 */
export async function handleTimer(deps: TimerHandlerDeps, timer: TimerRecord) {
  const generation = timer.generation ?? 0
  const result = await runTimer(deps, timer)

  if (result.outcome === "busy") {
    const delay = deps.activeExecutor(timer.runId)
      ? LOCAL_BUSY_RETRY_MS
      : BUSY_RETRY_MS
    await deps.store.deferTimer(timer.id, generation, delay)
    deps.wakeAt?.(new Date(deps.clock.now() + delay))
    return
  }
  await deps.store.completeTimer(timer.id, generation)
}

async function runTimer(
  deps: TimerHandlerDeps,
  timer: TimerRecord
): Promise<ContinueResult> {
  switch (timer.kind) {
    case "retry":
      return retry(deps, timer)
    case "step_timeout":
      return stepTimeout(deps, timer)
    case "run_timeout":
      return runTimeout(deps, timer)
    case "resume":
      return deps.continueRun(timer.runId)
    default: {
      const unknown: never = timer.kind
      throw new Error(`Unknown timer kind "${unknown}" of timer ${timer.id}`)
    }
  }
}

/**
 * A live holder of the run retries inline after its sleep. Moving the step
 * under it would run the attempt twice, so the step is only moved by whoever
 * can take the lease, and only while it is still `retry_scheduled`: a stale
 * timer must not relaunch an attempt that already started.
 */
async function retry(
  deps: TimerHandlerDeps,
  timer: TimerRecord
): Promise<ContinueResult> {
  const run = await deps.store.loadRun(timer.runId, { steps: true })
  if (!run) {
    return { outcome: "missing" }
  }
  const step = run.steps?.find((s) => s.stepId === timer.stepId)
  if (step?.status !== "retry_scheduled") {
    return { outcome: "done" }
  }
  if (deps.activeExecutor(timer.runId)) {
    return { outcome: "busy" }
  }
  const acquired = await deps.store.acquireLease(
    timer.runId,
    deps.owner,
    deps.leaseTtlMs
  )
  if (!acquired.ok) {
    return { outcome: acquired.reason === "missing" ? "missing" : "busy" }
  }
  let retried: CompletionResult
  try {
    retried = await deps.store.requestStepRetry(
      timer.runId,
      timer.stepId!,
      undefined,
      { scheduledOnly: true }
    )
  } finally {
    await deps.store.releaseLease(acquired.lease)
  }
  // The step already moved on, so whoever moved it drives the run.
  return retried.ok ? deps.continueRun(timer.runId) : { outcome: "done" }
}

async function stepTimeout(
  deps: TimerHandlerDeps,
  timer: TimerRecord
): Promise<ContinueResult> {
  const stepId = timer.stepId!
  const compiled = deps.registry.get(timer.workflowId)
  const node = compiled.steps[compiled.indexById.get(stepId)!]
  // Only the attempt the timer was set for times out.
  await deps.store.completeWaitingStep(
    timer.runId,
    stepId,
    {
      kind: "failure",
      error: serializeError(
        new StepTimeoutError(stepId, node?.options.timeoutMs ?? 0)
      ),
      permanent: true,
      timedOut: true,
    },
    undefined,
    { attempt: timer.attempt ?? undefined }
  )
  return deps.continueRun(timer.runId)
}

async function runTimeout(
  deps: TimerHandlerDeps,
  timer: TimerRecord
): Promise<ContinueResult> {
  const active = deps.activeExecutor(timer.runId)
  // A parking executor no longer reacts to its deadline. Once it detached,
  // the deferred timer continues the run, which then times out.
  if (active?.parking) {
    return { outcome: "busy" }
  }
  if (active) {
    active.requestTimeout()
    return { outcome: "notified" }
  }
  const result = await deps.continueRun(timer.runId)
  if (result.outcome !== "busy") {
    return result
  }
  // A holder that does not react to its deadline is taken over.
  const run = await deps.store.loadRun(timer.runId)
  const takeoverAt =
    new Date(run?.deadlineAt ?? 0).getTime() + deps.runTimeoutTakeoverMs
  if (deps.clock.now() >= takeoverAt) {
    return deps.continueRun(timer.runId, { force: true })
  }
  return result
}
