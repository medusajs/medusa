import { NewTimer, TimerKind } from "../store/store"

type RunRef = { id: string; workflowId: string; definitionHash: string }

export const timerId = {
  resume: (runId: string) => `resume:${runId}`,
  retry: (runId: string, stepId: string) => `retry:${runId}:${stepId}`,
  stepTimeout: (runId: string, stepId: string, attempt: number) =>
    `step_timeout:${runId}:${stepId}:${attempt}`,
  runTimeout: (runId: string) => `run_timeout:${runId}`,
}

function timer(
  kind: TimerKind,
  id: string,
  run: RunRef,
  dueAt: Date,
  step?: { stepId: string; attempt?: number }
): NewTimer {
  return {
    id,
    kind,
    runId: run.id,
    stepId: step?.stepId ?? null,
    attempt: step?.attempt ?? null,
    workflowId: run.workflowId,
    definitionHash: run.definitionHash,
    dueAt,
  }
}

export function resumeTimer(run: RunRef, dueAt: Date): NewTimer {
  return timer("resume", timerId.resume(run.id), run, dueAt)
}

export function retryTimer(run: RunRef, stepId: string, dueAt: Date): NewTimer {
  return timer("retry", timerId.retry(run.id, stepId), run, dueAt, { stepId })
}

export function stepTimeoutTimer(
  run: RunRef,
  stepId: string,
  attempt: number,
  dueAt: Date
): NewTimer {
  return timer(
    "step_timeout",
    timerId.stepTimeout(run.id, stepId, attempt),
    run,
    dueAt,
    { stepId, attempt }
  )
}

export function runTimeoutTimer(run: RunRef, dueAt: Date): NewTimer {
  return timer("run_timeout", timerId.runTimeout(run.id), run, dueAt)
}
