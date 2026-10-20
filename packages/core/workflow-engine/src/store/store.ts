import {
  Durability,
  RunStatus,
  StepAction,
  StepError,
  StepStatus,
} from "../definition/types"

export interface RunError {
  stepId: string
  action: StepAction
  error: StepError
}

export interface RunFlags {
  hasFailedSteps?: boolean
  hasSkippedSteps?: boolean
  hasSkippedOnFailureSteps?: boolean
  timedOut?: boolean
}

export type TimerKind = "resume" | "retry" | "step_timeout" | "run_timeout"

/**
 * Durable work that is due at a time: continue a run, retry a step, or time
 * out a step or a run. Ids are deterministic, so writing the same timer twice
 * keeps one row.
 */
export interface TimerRecord {
  id: string
  kind: TimerKind
  runId: string
  stepId?: string | null
  attempt?: number | null
  workflowId: string
  definitionHash: string
  dueAt: Date
  /**
   * Increases every time the timer is written again, so a handler that read
   * an older version cannot delete the newer one.
   */
  generation?: number
}

export type NewTimer = Omit<TimerRecord, "generation">

export interface ScheduleSpec {
  workflowId: string
  cron?: string | null
  intervalMs?: number | null
  concurrency: "allow" | "forbid"
  numberOfExecutions?: number | null
  catchUp: boolean
  definitionHash: string
}

export interface ScheduleRecord extends ScheduleSpec {
  remaining: number | null
  nextFireAt: Date | null
  lastTransactionId: string | null
  lastSeenAt: Date
}

export interface ClaimedSchedule {
  schedule: ScheduleRecord
  /**
   * The database clock when the schedule was claimed.
   */
  now: Date
}

export interface OutboxRow {
  id: string
  groupId: string
  runId: string
  stepId?: string | null
  attempt?: number | null
  message: unknown
}

export interface OutboxFilter {
  groupId?: string
  runId?: string
  stepId?: string
  attempt?: number
  /**
   * Matches messages whose `name` is one of these.
   */
  names?: string[]
}

export interface OutboxFailure {
  id: string
  /**
   * Stored as the message's last error. Must be JSON serializable.
   */
  error: unknown
}

export interface OutboxRetryPolicy {
  /**
   * The delay after the first failed attempt. It doubles with every attempt.
   */
  baseDelayMs: number
  maxDelayMs: number
  /**
   * Failed attempts after which a message is dead.
   */
  maxAttempts: number
}

export const DEFAULT_DEAD_OUTBOX_RETENTION_MS = 30 * 24 * 60 * 60_000

/**
 * A message that failed to publish too many times. Dead messages are never
 * claimed again; they are kept for inspection until the retention sweep.
 */
export interface DeadOutboxRow extends OutboxRow {
  attempts: number
  lastError: unknown
}

/**
 * Messages staged by runs, published when their group is released. Ids sort
 * in insertion order.
 */
export interface OutboxStore {
  stageOutbox(rows: OutboxRow[]): Promise<void>
  deleteOutbox(filter: OutboxFilter): Promise<void>
  /**
   * Makes the group's staged messages claimable.
   */
  markOutboxReady(groupId: string): Promise<void>
  /**
   * Claims ready messages, oldest first, optionally of one group. Messages
   * whose claim or backoff is still running, and dead messages, are skipped.
   */
  claimOutbox(
    owner: string,
    limit: number,
    claimMs: number,
    groupId?: string
  ): Promise<OutboxRow[]>
  /**
   * Deletes published messages that are still claimed by the owner.
   */
  deleteOutboxIds(ids: string[], owner: string): Promise<void>
  /**
   * Keeps messages the owner claimed, but did not try to publish, claimed for
   * the delay, so they are retried later. Does not count as an attempt.
   */
  deferOutbox(ids: string[], owner: string, delayMs: number): Promise<void>
  /**
   * Records a failed publish of messages the owner still claims: increments
   * their attempts, stores the error and keeps them claimed for
   * `baseDelayMs * 2^(attempts - 1)`, capped at `maxDelayMs`. Messages that
   * reach `maxAttempts` become dead and are returned, only by the call that
   * made them dead.
   */
  failOutbox(
    failures: OutboxFailure[],
    owner: string,
    policy: OutboxRetryPolicy
  ): Promise<DeadOutboxRow[]>
}

export interface WorkerInfo {
  id: string
  mode: string
}

export interface StepRecord {
  stepId: string
  status: StepStatus
  attempt: number
  output?: unknown
  compensateInput?: unknown
  error?: StepError | null
  skipReason?: "condition" | "failure" | null
  /**
   * Set when a failure was reported from outside and the executor has not yet
   * applied the step's failure policy.
   */
  pendingFailure?: { permanent: boolean } | null
  startedAt?: Date | null
  finishedAt?: Date | null
  /**
   * The instance running the step's handler in the background, while the step
   * waits. Cleared once the handler returns.
   */
  owner?: string | null
}

export interface RunRecord {
  id: string
  workflowId: string
  transactionId: string
  status: RunStatus
  durability: Durability
  definitionHash: string
  input: unknown
  context: Record<string, unknown>
  metadata: Record<string, unknown>
  result?: unknown
  errors: RunError[]
  flags: RunFlags
  parentRunId?: string | null
  parentStepId?: string | null
  idempotent: boolean
  retentionMs?: number | null
  cancelRequestedAt?: Date | null
  deadlineAt?: Date | null
  retainUntil?: Date | null
  createdAt: Date
  updatedAt: Date
  finishedAt?: Date | null
  steps?: StepRecord[]
}

export type NewRun = Omit<
  RunRecord,
  "createdAt" | "updatedAt" | "finishedAt" | "retainUntil" | "steps"
>

export interface IdPolicy {
  /**
   * When false, no uniqueness check is made on the transaction id.
   */
  unique: boolean
  /**
   * When true, a finished run with the same transaction id is returned instead
   * of starting a new one.
   */
  idempotent: boolean
}

export type CreateRunResult =
  | { kind: "created"; run: RunRecord; lease: Lease | null }
  | { kind: "running"; run: RunRecord }
  | { kind: "finished"; run: RunRecord }

export interface Lease {
  runId: string
  owner: string
  token: string
}

export type AcquireLeaseResult =
  | { ok: true; lease: Lease }
  | {
      ok: false
      /**
       * `missing` when the run does not exist, `held` when another lease on
       * it is still valid.
       */
      reason: "missing" | "held"
    }

export interface LeaseRequest {
  owner: string
  ttlMs: number
}

export interface RunChanges {
  status?: RunStatus
  result?: unknown
  errors?: RunError[]
  flags?: RunFlags
  context?: Record<string, unknown>
  cancelRequestedAt?: Date | null
  finished?: boolean
  steps?: StepRecord[]
  /**
   * Gives up the lease in the same write.
   */
  releaseLease?: boolean
  /**
   * Timers written with the change.
   */
  timers?: NewTimer[]
  /**
   * Timer ids deleted with the change.
   */
  deleteTimers?: string[]
  /**
   * Deletes every timer of the run with the change.
   */
  deleteRunTimers?: boolean
  /**
   * Outbox changes made with a run's final commit: publish a group, or drop
   * it.
   */
  outbox?: { readyGroup?: string; discardGroup?: string }
  /**
   * Deletes the run, its steps and its timers in the same write. Used for
   * finished runs that are not retained. Its outbox messages are kept: staged
   * ones may belong to a group a root run releases later, and are swept by
   * `deleteOrphans` once stale.
   */
  delete?: boolean
}

export interface CommitResult {
  cancelRequested: boolean
}

export type StepOutcome =
  | { kind: "output"; output: unknown; compensateInput: unknown }
  | { kind: "skip" }
  | {
      kind: "failure"
      error: StepError
      permanent: boolean
      timedOut?: boolean
    }

/**
 * Conditions a completion on the step's current attempt or owner.
 */
export interface CompletionExpectation {
  attempt?: number
  owner?: string
}

export interface StepRetryOptions {
  scheduledOnly?: boolean
  deleteTimers?: string[]
}

export interface CompletionResult {
  ok: boolean
  status?: StepStatus
  /**
   * The generation of the timer written with the completion.
   */
  timerGeneration?: number
}

export interface RunFilter {
  ids?: string[]
  workflowId?: string | string[]
  transactionId?: string | string[]
  status?: RunStatus[]
  statusNot?: RunStatus[]
  parentRunId?: string
  /**
   * Case-insensitive match on workflow id or transaction id.
   */
  q?: string
  createdAfter?: Date
  createdBefore?: Date
}

export type RunOrderField = "created_at" | "updated_at"

export interface Page {
  limit?: number
  offset?: number
  /**
   * The column runs are sorted by, then by id. Defaults to `created_at`.
   */
  orderBy?: RunOrderField
  /**
   * Defaults to `desc`.
   */
  order?: "asc" | "desc"
  withSteps?: boolean
}

export interface Store extends OutboxStore {
  createRun(
    run: NewRun,
    policy: IdPolicy,
    lease?: LeaseRequest,
    timers?: NewTimer[]
  ): Promise<CreateRunResult>
  loadRun(runId: string, opts?: { steps?: boolean }): Promise<RunRecord | null>
  /**
   * The newest run for the transaction id, preferring one that is not final.
   */
  findRun(
    workflowId: string,
    transactionId: string,
    opts?: { steps?: boolean }
  ): Promise<RunRecord | null>
  /**
   * Fails with `LeaseLostError` when the lease token no longer matches.
   */
  commit(lease: Lease, changes: RunChanges): Promise<CommitResult>
  /**
   * Conditional on the step being `waiting`. Needs no lease.
   */
  completeWaitingStep(
    runId: string,
    stepId: string,
    outcome: StepOutcome,
    timer?: NewTimer,
    expect?: CompletionExpectation
  ): Promise<CompletionResult>
  /**
   * Conditional on the step being `waiting` or `retry_scheduled`, or only
   * `retry_scheduled` with `scheduledOnly`. Moves it back to `pending` and
   * deletes `deleteTimers` in the same write. Needs no lease.
   */
  requestStepRetry(
    runId: string,
    stepId: string,
    timer?: NewTimer,
    opts?: StepRetryOptions
  ): Promise<CompletionResult>
  /**
   * Needs no lease.
   */
  requestCancel(runId: string, timer?: NewTimer): Promise<void>
  /**
   * A lease is held until its grant of `ttlMs` has passed and its owner has
   * not heartbeated for `ttlMs`, so leases are never renewed one by one. With
   * `force`, takes the lease even if another owner holds it.
   */
  acquireLease(
    runId: string,
    owner: string,
    ttlMs: number,
    opts?: { force?: boolean }
  ): Promise<AcquireLeaseResult>
  releaseLease(lease: Lease): Promise<void>
  /**
   * Releases every lease the owner holds. Returns the run ids.
   */
  releaseLeasesOf(owner: string): Promise<string[]>
  queryRuns(filter: RunFilter, page?: Page): Promise<[RunRecord[], number]>
  /**
   * Deletes finished runs whose retention passed by the store's clock, with
   * their steps and timers, in batches. Outbox messages are left to
   * `deleteOrphans`, as with a deleting commit. Returns the number of runs
   * deleted.
   */
  deleteExpired(opts?: { batchSize?: number }): Promise<number>
  /**
   * Deletes, up to the limit each: timers whose run no longer exists, staged
   * messages older than `outboxStaleMs` whose group has no message of an
   * existing run left, and dead messages that died more than
   * `deadOutboxRetentionMs` ago (30 days by default). Returns the number of
   * rows deleted.
   */
  deleteOrphans(opts: {
    limit: number
    outboxStaleMs: number
    deadOutboxRetentionMs?: number
  }): Promise<number>

  /**
   * The store's clock. All due times are compared against it.
   */
  now(): Promise<Date>
  /**
   * Writes timers. A timer that exists gets the earlier due time, a new
   * generation, and loses its claim. With `onlyEarlier`, a timer that exists
   * is left as it is unless the new due time is earlier.
   */
  scheduleTimers(
    timers: NewTimer[],
    opts?: { onlyEarlier?: boolean }
  ): Promise<void>
  /**
   * Claims due timers for a while. Only timers of workflows whose definition
   * the caller knows are claimed, unless the timer is older than
   * `mismatchGraceMs`.
   */
  claimDueTimers(
    owner: string,
    limit: number,
    known: Array<{ workflowId: string; hash: string }>,
    opts: { claimMs: number; mismatchGraceMs: number }
  ): Promise<TimerRecord[]>
  /**
   * Deletes the timer if it still has this generation.
   */
  completeTimer(id: string, generation: number): Promise<boolean>
  /**
   * Gives a claimed timer back, due again after the delay.
   */
  deferTimer(id: string, generation: number, delayMs: number): Promise<void>

  upsertSchedule(spec: ScheduleSpec, nextFireAt: Date | null): Promise<void>
  removeSchedule(workflowId: string): Promise<void>
  claimDueSchedules(
    owner: string,
    limit: number,
    workflowIds: string[],
    claimMs: number
  ): Promise<ClaimedSchedule[]>
  /**
   * Moves a claimed schedule to its next fire and releases the claim.
   */
  advanceSchedule(
    workflowId: string,
    owner: string,
    next: {
      nextFireAt: Date | null
      remaining: number | null
      lastTransactionId: string | null
    }
  ): Promise<boolean>
  touchSchedules(workflowIds: string[]): Promise<void>
  deleteStaleSchedules(olderThan: Date): Promise<number>

  /**
   * Records that the worker is alive. Returns the id of the live worker,
   * one that heartbeated within `liveMs` and is not a server, that reaps for
   * all of them: the one with the lowest id.
   */
  heartbeat(
    worker: WorkerInfo,
    opts: { liveMs: number }
  ): Promise<{ reaper: string | null }>
  removeWorker(workerId: string): Promise<void>
  /**
   * Deletes workers whose last heartbeat is before the cutoff.
   */
  deleteStaleWorkers(heartbeatCutoff: Date): Promise<number>
  /**
   * Gives up to `limit` runs that are running or compensating with an expired
   * or no lease, and no resume timer, a resume timer due now, longest expired
   * first. A lease has expired once its grant has passed and its owner has
   * not heartbeated for `liveMs`. Each run is claimed by one caller, so
   * concurrent reapers schedule different runs. Returns their ids.
   */
  scheduleExpiredLeaseResumes(limit: number, liveMs: number): Promise<string[]>
  /**
   * Moves waiting steps whose background handler ran on an instance that
   * stopped heartbeating back to pending. Returns their run ids.
   */
  recoverOrphanedSteps(heartbeatCutoff: Date): Promise<string[]>
  /**
   * Clears the owner of a waiting step whose handler returned without an
   * outcome, so recovery never re-runs it.
   */
  clearStepOwner(runId: string, stepId: string, attempt: number): Promise<void>
}
