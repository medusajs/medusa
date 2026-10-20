import { RunStatus, WorkflowOptions } from "../definition/types"
import { Clock } from "../runtime/clock"
import { EngineExtension } from "../runtime/middleware"
import { LiveRunError } from "../runtime/run-state"
import { Notifier } from "../signals/notifier"
import { RunRecord, Store } from "../store/store"

export type InstanceMode = "shared" | "worker" | "server"

export interface EngineLogger {
  error(message: string, error?: unknown): void
  warn(message: string): void
  info?(message: string): void
}

export interface RecoveryConfig {
  heartbeatIntervalMs?: number
  /**
   * How long a lease is held after it is granted, and how long its owner may
   * go without a heartbeat before it expires. Defaults to 30 seconds. Without
   * recovery, leases last 24 hours.
   */
  leaseTtlMs?: number
  reaperIntervalMs?: number
}

export interface EngineConfig {
  store?: Store
  /**
   * Identifies this process in leases, claims and heartbeats.
   */
  instanceId?: string
  /**
   * `server` instances run sync segments only and leave async steps,
   * continuations, timers and schedules to `worker` or `shared` instances.
   */
  mode?: InstanceMode
  clock?: Clock
  /**
   * Heartbeats, which keep the instance's leases held, and the reaper that
   * resumes runs held by dead instances. Off when false or not set.
   */
  recovery?: RecoveryConfig | false
  notifier?: Notifier
  extensions?: EngineExtension[]
  logger?: EngineLogger
  /**
   * How often an idle dispatcher checks for due work. Defaults to 1000 ms, or
   * 30000 ms once the notifier is subscribed.
   */
  pollIntervalMs?: number
  /**
   * Upper bound on runs this instance executes at once from timers and
   * schedules.
   */
  maxConcurrentRuns?: number
  timerClaimMs?: number
  /**
   * How long a timer for a changed workflow definition waits for an instance
   * that knows the old definition.
   */
  definitionGraceMs?: number
  /**
   * How long after a run's deadline its timeout takes the run over from a
   * lease holder that does not respond.
   */
  runTimeoutTakeoverMs?: number
  /**
   * Schedules no instance has registered for this long are removed.
   */
  staleScheduleMs?: number
  /**
   * How often expired runs are deleted.
   */
  retentionCleanupIntervalMs?: number
  /**
   * Start the dispatcher and recovery loops on first use. Defaults to true.
   */
  autoBoot?: boolean
}

export interface StartOptions {
  workflowId: string
  /**
   * Defaults to a new ulid.
   */
  transactionId?: string
  input?: unknown
  context?: Record<string, unknown>
  metadata?: Record<string, unknown>
  /**
   * Process-local values handed to every step of this run. Never stored.
   */
  locals?: Record<string, unknown>
  /**
   * Links the run to the step that started it. With `completeStep`, the parent
   * step must be waiting, and the child's outcome completes it.
   */
  parent?: { runId: string; stepId: string; completeStep?: boolean }
  /**
   * When false, the transaction id is not checked for an existing run.
   */
  unique?: boolean
  /**
   * Per-call overrides of the workflow options.
   */
  options?: Partial<WorkflowOptions>
}

export interface StepTarget {
  runId?: string
  workflowId?: string
  transactionId?: string
  stepId: string
}

export interface RunTarget {
  runId?: string
  workflowId?: string
  transactionId?: string
  /**
   * A run that was never stored (durability `none`) can only be cancelled
   * from the snapshot its handle returned.
   */
  snapshot?: RunRecord
  locals?: Record<string, unknown>
}

export interface RunHandle {
  runId: string
  workflowId: string
  transactionId: string
  status: RunStatus
  finished: boolean
  run: RunRecord
  result: unknown
  resultError?: unknown
  errors: LiveRunError[]
  /**
   * Set when `start` found a finished run for an idempotent workflow and
   * returned it without running.
   */
  existing?: boolean
  wait(): Promise<RunHandle>
}

/**
 * How an attempt to continue a run inline ended.
 */
export type ContinueResult =
  | { outcome: "continued" | "notified" | "done"; handle?: RunHandle }
  | { outcome: "busy" | "missing"; handle?: undefined }
