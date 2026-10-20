import { InvalidTransitionError } from "../errors"
import { RunStatus, StepStatus } from "../definition/types"

const RUN_TRANSITIONS: Record<RunStatus, RunStatus[]> = {
  pending: ["running", "failed", "cancelled"],
  running: ["waiting", "compensating", "succeeded", "failed"],
  waiting: ["running", "compensating", "failed"],
  compensating: ["compensated", "cancelled", "failed"],
  // A retained, finished run can still be cancelled, which compensates it.
  succeeded: ["compensating"],
  compensated: [],
  cancelled: [],
  failed: [],
}

const STEP_TRANSITIONS: Record<StepStatus, StepStatus[]> = {
  pending: ["running", "waiting", "skipped", "failed"],
  running: [
    "pending",
    "waiting",
    "retry_scheduled",
    "succeeded",
    "skipped",
    "failed",
    "timed_out",
  ],
  waiting: [
    "pending",
    "running",
    "retry_scheduled",
    "succeeded",
    "skipped",
    "failed",
    "timed_out",
  ],
  retry_scheduled: ["pending", "running", "failed", "skipped"],
  succeeded: ["compensating", "compensated"],
  skipped: [],
  failed: ["compensating", "compensated"],
  timed_out: ["compensating", "compensated"],
  compensating: ["compensated", "compensation_failed"],
  compensated: [],
  compensation_failed: [],
}

export const FINAL_RUN_STATUSES: ReadonlySet<RunStatus> = new Set([
  "succeeded",
  "compensated",
  "cancelled",
  "failed",
])

export function canTransitionRun(from: RunStatus, to: RunStatus): boolean {
  return from === to || RUN_TRANSITIONS[from].includes(to)
}

export function canTransitionStep(from: StepStatus, to: StepStatus): boolean {
  return from === to || STEP_TRANSITIONS[from].includes(to)
}

export function assertRunTransition(from: RunStatus, to: RunStatus): void {
  if (!canTransitionRun(from, to)) {
    throw new InvalidTransitionError(
      `Run cannot move from "${from}" to "${to}"`
    )
  }
}

export function assertStepTransition(
  stepId: string,
  from: StepStatus,
  to: StepStatus
): void {
  if (!canTransitionStep(from, to)) {
    throw new InvalidTransitionError(
      `Step "${stepId}" cannot move from "${from}" to "${to}"`
    )
  }
}

export function isFinalRunStatus(status: RunStatus): boolean {
  return FINAL_RUN_STATUSES.has(status)
}
