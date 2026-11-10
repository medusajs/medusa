import {
  TransactionState,
  TransactionStepState,
  TransactionStepStatus,
} from "@medusajs/framework/utils"
import type {
  RunStatus,
  StepRecord,
  StepStatus,
} from "@medusajs/workflow-engine"

const RUN_STATE: Record<RunStatus, TransactionState> = {
  pending: TransactionState.NOT_STARTED,
  running: TransactionState.INVOKING,
  waiting: TransactionState.INVOKING,
  compensating: TransactionState.COMPENSATING,
  succeeded: TransactionState.DONE,
  compensated: TransactionState.REVERTED,
  cancelled: TransactionState.REVERTED,
  failed: TransactionState.FAILED,
}

const RUN_STATUSES: Record<string, RunStatus[]> = {
  // Runs have no separate state before compensating.
  [TransactionState.WAITING_TO_COMPENSATE]: ["compensating"],
}
for (const [status, state] of Object.entries(RUN_STATE)) {
  RUN_STATUSES[state] = [...(RUN_STATUSES[state] ?? []), status as RunStatus]
}

export function toLegacyRunState(status: RunStatus): TransactionState {
  return RUN_STATE[status]
}

/**
 * Run statuses that a legacy state filter matches.
 */
export function fromLegacyRunState(state: string): RunStatus[] {
  return RUN_STATUSES[state] ?? []
}

type LegacyPair = { state: TransactionStepState; status: TransactionStepStatus }

const pair = (
  state: TransactionStepState,
  status: TransactionStepStatus
): LegacyPair => ({ state, status })

const DORMANT = pair(TransactionStepState.DORMANT, TransactionStepStatus.IDLE)

type CompensateStatus = "compensating" | "compensated" | "compensation_failed"

const INVOKE: Record<Exclude<StepStatus, CompensateStatus>, LegacyPair> = {
  pending: pair(TransactionStepState.NOT_STARTED, TransactionStepStatus.IDLE),
  running: pair(TransactionStepState.INVOKING, TransactionStepStatus.WAITING),
  waiting: pair(TransactionStepState.INVOKING, TransactionStepStatus.WAITING),
  retry_scheduled: pair(
    TransactionStepState.INVOKING,
    TransactionStepStatus.TEMPORARY_FAILURE
  ),
  succeeded: pair(TransactionStepState.DONE, TransactionStepStatus.OK),
  skipped: pair(TransactionStepState.SKIPPED, TransactionStepStatus.OK),
  failed: pair(
    TransactionStepState.FAILED,
    TransactionStepStatus.PERMANENT_FAILURE
  ),
  timed_out: pair(
    TransactionStepState.TIMEOUT,
    TransactionStepStatus.PERMANENT_FAILURE
  ),
}

const COMPENSATE: Record<CompensateStatus, LegacyPair> = {
  compensating: pair(
    TransactionStepState.COMPENSATING,
    TransactionStepStatus.WAITING
  ),
  compensated: pair(TransactionStepState.REVERTED, TransactionStepStatus.OK),
  compensation_failed: pair(
    TransactionStepState.FAILED,
    TransactionStepStatus.PERMANENT_FAILURE
  ),
}

function isCompensating(status: string): status is CompensateStatus {
  return status in COMPENSATE
}

/**
 * The legacy invoke and compensate state pairs of a step.
 */
export function toLegacyStepStates(step: StepRecord): {
  invoke: LegacyPair
  compensate: LegacyPair
} {
  if (isCompensating(step.status)) {
    return {
      invoke: step.error ? INVOKE.failed : INVOKE.succeeded,
      compensate: COMPENSATE[step.status],
    }
  }
  if (step.status === "skipped" && step.skipReason === "failure") {
    return {
      invoke: pair(
        TransactionStepState.SKIPPED_FAILURE,
        TransactionStepStatus.OK
      ),
      compensate: DORMANT,
    }
  }
  return { invoke: INVOKE[step.status], compensate: DORMANT }
}

/**
 * The legacy status named in "Cannot set step success when status is ...".
 */
export function toLegacyStepStatus(status: string): string {
  const legacy = isCompensating(status)
    ? COMPENSATE[status]
    : INVOKE[status as keyof typeof INVOKE]
  return legacy?.status ?? status
}
