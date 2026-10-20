import { ulid } from "ulid"
import { LeaseLostError } from "../../errors"
import { Clock, systemClock } from "../../runtime/clock"
import { isFinalRunStatus } from "../../runtime/transitions"
import { cloneValue } from "../../serialization/serializer"
import {
  AcquireLeaseResult,
  ClaimedSchedule,
  CommitResult,
  CompletionExpectation,
  CompletionResult,
  CreateRunResult,
  DEFAULT_DEAD_OUTBOX_RETENTION_MS,
  DeadOutboxRow,
  IdPolicy,
  Lease,
  LeaseRequest,
  NewRun,
  NewTimer,
  OutboxFailure,
  OutboxFilter,
  OutboxRetryPolicy,
  OutboxRow,
  Page,
  RunChanges,
  RunFilter,
  RunRecord,
  ScheduleRecord,
  ScheduleSpec,
  StepOutcome,
  WorkerInfo,
  StepRecord,
  StepRetryOptions,
  Store,
  TimerRecord,
} from "../store"

interface StoredRun {
  run: RunRecord
  steps: Map<string, StepRecord>
  lease: { owner: string; token: string; expiresAt: number } | null
}

interface StoredTimer extends TimerRecord {
  generation: number
  createdAt: number
  claimedBy: string | null
  claimedUntil: number | null
}

interface StoredOutboxRow extends OutboxRow {
  status: "staged" | "ready" | "dead"
  claimedBy: string | null
  claimedUntil: number | null
  attempts: number
  lastError: unknown
  createdAt: number
  updatedAt: number
}

interface StoredSchedule extends ScheduleRecord {
  claimedBy: string | null
  claimedUntil: number | null
}

/**
 * Single-process store. Values are copied in and out, as a database would.
 * Nothing outlives the process, so there are no other instances to recover
 * from: worker, recovery and stale-schedule bookkeeping are no-ops.
 */
export class MemoryStore implements Store {
  #runs = new Map<string, StoredRun>()
  #heartbeats = new Map<string, { at: number; mode: string }>()
  #timers = new Map<string, StoredTimer>()
  #schedules = new Map<string, StoredSchedule>()
  #outbox = new Map<string, StoredOutboxRow>()
  #clock: Clock

  constructor(options: { clock?: Clock } = {}) {
    this.#clock = options.clock ?? systemClock
  }

  async now() {
    return new Date(this.#clock.now())
  }

  async createRun(
    newRun: NewRun,
    policy: IdPolicy,
    leaseRequest?: LeaseRequest,
    timers: NewTimer[] = []
  ): Promise<CreateRunResult> {
    // As in Postgres, at most one run of a workflow is active per transaction
    // id, whatever the policy.
    const existing = this.#latest(newRun.workflowId, newRun.transactionId)
    if (existing && !isFinalRunStatus(existing.run.status)) {
      return { kind: "running", run: this.#export(existing, true) }
    }
    if (existing && policy.unique && policy.idempotent) {
      return { kind: "finished", run: this.#export(existing, true) }
    }

    const now = new Date(this.#clock.now())
    const stored: StoredRun = {
      run: {
        ...cloneValue(newRun),
        createdAt: now,
        updatedAt: now,
        finishedAt: null,
        retainUntil: null,
      },
      steps: new Map(),
      lease: null,
    }

    let lease: Lease | null = null
    if (leaseRequest) {
      lease = { runId: newRun.id, owner: leaseRequest.owner, token: ulid() }
      stored.lease = {
        owner: lease.owner,
        token: lease.token,
        expiresAt: this.#clock.now() + leaseRequest.ttlMs,
      }
    }

    this.#runs.set(newRun.id, stored)
    this.#writeTimers(timers)
    return { kind: "created", run: this.#export(stored, false), lease }
  }

  async loadRun(runId: string, opts: { steps?: boolean } = {}) {
    const stored = this.#runs.get(runId)
    return stored ? this.#export(stored, !!opts.steps) : null
  }

  async findRun(
    workflowId: string,
    transactionId: string,
    opts: { steps?: boolean } = {}
  ) {
    const stored = this.#latest(workflowId, transactionId)
    return stored ? this.#export(stored, !!opts.steps) : null
  }

  async commit(lease: Lease, changes: RunChanges): Promise<CommitResult> {
    const stored = this.#runs.get(lease.runId)
    if (!stored || stored.lease?.token !== lease.token) {
      throw new LeaseLostError(lease.runId)
    }

    const { stage, readyGroup, discardGroup, claim } = changes.outbox ?? {}
    this.#stageRows((stage ?? []).filter((row) => row.groupId !== discardGroup))
    let claimedOutbox: OutboxRow[] = []
    if (readyGroup) {
      this.#readyGroup(readyGroup)
      if (claim) {
        claimedOutbox = this.#claimRows(
          claim.owner,
          Infinity,
          claim.claimMs,
          readyGroup
        )
      }
    }
    if (discardGroup) {
      this.#deleteRows({ groupId: discardGroup })
    }
    const result: CommitResult = {
      cancelRequested: !!stored.run.cancelRequestedAt,
      ...(claimedOutbox.length ? { claimedOutbox } : {}),
    }

    // A deleted run takes all its timers with it, and its other changes are
    // not applied.
    if (changes.delete) {
      this.#deleteRunTimers(lease.runId)
      this.#runs.delete(lease.runId)
      return result
    }

    if (changes.deleteRunTimers) {
      this.#deleteRunTimers(lease.runId)
    }
    for (const id of changes.deleteTimers ?? []) {
      this.#timers.delete(id)
    }
    this.#writeTimers(changes.timers ?? [])

    this.#applyChanges(stored, changes)
    if (changes.releaseLease) {
      stored.lease = null
    }
    return { ...result, cancelRequested: !!stored.run.cancelRequestedAt }
  }

  #deleteRunTimers(runId: string) {
    for (const [id, timer] of this.#timers) {
      if (timer.runId === runId) {
        this.#timers.delete(id)
      }
    }
  }

  async completeWaitingStep(
    runId: string,
    stepId: string,
    outcome: StepOutcome,
    timer?: NewTimer,
    expect: CompletionExpectation = {}
  ): Promise<CompletionResult> {
    const stored = this.#runs.get(runId)
    const step = stored?.steps.get(stepId)
    if (!stored || !step) {
      return { ok: false }
    }
    if (
      step.status !== "waiting" ||
      (expect.attempt !== undefined && step.attempt !== expect.attempt) ||
      (expect.owner !== undefined && step.owner !== expect.owner)
    ) {
      return { ok: false, status: step.status }
    }

    const now = new Date(this.#clock.now())
    if (outcome.kind === "output") {
      step.status = "succeeded"
      step.output = cloneValue(outcome.output)
      step.compensateInput = cloneValue(outcome.compensateInput)
      step.error = null
    } else if (outcome.kind === "skip") {
      step.status = "skipped"
      step.skipReason = "condition"
    } else {
      step.status = outcome.timedOut ? "timed_out" : "failed"
      step.error = cloneValue(outcome.error)
      step.pendingFailure = { permanent: outcome.permanent }
    }
    step.owner = null
    step.finishedAt = now
    stored.run.updatedAt = now

    return {
      ok: true,
      status: step.status,
      timerGeneration: timer ? this.#writeTimers([timer])[0] : undefined,
    }
  }

  async requestStepRetry(
    runId: string,
    stepId: string,
    timer?: NewTimer,
    opts: StepRetryOptions = {}
  ): Promise<CompletionResult> {
    const stored = this.#runs.get(runId)
    const step = stored?.steps.get(stepId)
    if (!stored || !step) {
      return { ok: false }
    }
    const retryable =
      step.status === "retry_scheduled" ||
      (!opts.scheduledOnly && step.status === "waiting")
    if (!retryable) {
      return { ok: false, status: step.status }
    }
    for (const id of opts.deleteTimers ?? []) {
      if (this.#timers.get(id)?.runId === runId) {
        this.#timers.delete(id)
      }
    }

    step.status = "pending"
    step.pendingFailure = null
    step.owner = null
    stored.run.updatedAt = new Date(this.#clock.now())
    return {
      ok: true,
      status: step.status,
      timerGeneration: timer ? this.#writeTimers([timer])[0] : undefined,
    }
  }

  async requestCancel(runId: string, timer?: NewTimer) {
    const stored = this.#runs.get(runId)
    if (!stored) {
      return
    }
    stored.run.cancelRequestedAt ??= new Date(this.#clock.now())
    if (timer) {
      this.#writeTimers([timer])
    }
  }

  async acquireLease(
    runId: string,
    owner: string,
    ttlMs: number,
    opts: { force?: boolean } = {}
  ): Promise<AcquireLeaseResult> {
    const stored = this.#runs.get(runId)
    if (!stored) {
      return { ok: false, reason: "missing" }
    }

    const now = this.#clock.now()
    if (
      !opts.force &&
      stored.lease &&
      (stored.lease.expiresAt > now ||
        (this.#heartbeats.get(stored.lease.owner)?.at ?? -Infinity) >
          now - ttlMs)
    ) {
      return { ok: false, reason: "held" }
    }

    const lease = { runId, owner, token: ulid() }
    stored.lease = { owner, token: lease.token, expiresAt: now + ttlMs }
    return { ok: true, lease }
  }

  async releaseLease(lease: Lease) {
    const stored = this.#runs.get(lease.runId)
    if (stored?.lease?.token === lease.token) {
      stored.lease = null
    }
  }

  async releaseLeasesOf(owner: string) {
    const released: string[] = []
    for (const stored of this.#runs.values()) {
      if (stored.lease?.owner === owner) {
        stored.lease = null
        released.push(stored.run.id)
      }
    }
    return released
  }

  async queryRuns(
    filter: RunFilter,
    page: Page = {}
  ): Promise<[RunRecord[], number]> {
    const toList = (value?: string | string[]) =>
      value === undefined ? undefined : Array.isArray(value) ? value : [value]
    const workflowIds = toList(filter.workflowId)
    const transactionIds = toList(filter.transactionId)
    const q = filter.q?.toLowerCase()

    const matches = [...this.#runs.values()].filter(({ run }) => {
      return (
        (!filter.ids || filter.ids.includes(run.id)) &&
        (!workflowIds || workflowIds.includes(run.workflowId)) &&
        (!transactionIds || transactionIds.includes(run.transactionId)) &&
        (!filter.status || filter.status.includes(run.status)) &&
        (!filter.statusNot || !filter.statusNot.includes(run.status)) &&
        (!filter.parentRunId || run.parentRunId === filter.parentRunId) &&
        (!q ||
          run.workflowId.toLowerCase().includes(q) ||
          run.transactionId.toLowerCase().includes(q)) &&
        (!filter.createdAfter || run.createdAt >= filter.createdAfter) &&
        (!filter.createdBefore || run.createdAt <= filter.createdBefore)
      )
    })

    const direction = page.order === "asc" ? 1 : -1
    const field = page.orderBy === "updated_at" ? "updatedAt" : "createdAt"
    matches.sort(
      (a, b) =>
        direction *
        (a.run[field].getTime() - b.run[field].getTime() ||
          (a.run.id < b.run.id ? -1 : a.run.id > b.run.id ? 1 : 0))
    )

    const offset = page.offset ?? 0
    const sliced =
      page.limit === undefined
        ? matches.slice(offset)
        : matches.slice(offset, offset + page.limit)

    return [
      sliced.map((stored) => this.#export(stored, !!page.withSteps)),
      matches.length,
    ]
  }

  async deleteExpired() {
    const now = this.#clock.now()
    let count = 0
    for (const [id, stored] of this.#runs) {
      const retainUntil = stored.run.retainUntil
      if (
        isFinalRunStatus(stored.run.status) &&
        retainUntil &&
        retainUntil.getTime() <= now
      ) {
        this.#deleteRunTimers(id)
        this.#runs.delete(id)
        count++
      }
    }
    return count
  }

  /**
   * Runs take their timers with them here, so only stale staged messages of
   * groups without a stored run, and dead messages past their retention, are
   * left to delete.
   */
  async deleteOrphans(opts: {
    limit: number
    outboxStaleMs?: number
    deadOutboxRetentionMs?: number
  }) {
    const now = this.#clock.now()
    const deadBefore =
      now - (opts.deadOutboxRetentionMs ?? DEFAULT_DEAD_OUTBOX_RETENTION_MS)
    const staleBefore =
      opts.outboxStaleMs === undefined ? null : now - opts.outboxStaleMs
    const liveGroups = new Set<string>()
    for (const row of this.#outbox.values()) {
      if (this.#runs.has(row.runId)) {
        liveGroups.add(row.groupId)
      }
    }

    let staged = 0
    let dead = 0
    for (const [id, row] of this.#outbox) {
      if (
        staged < opts.limit &&
        staleBefore !== null &&
        row.status === "staged" &&
        row.createdAt < staleBefore &&
        !liveGroups.has(row.groupId)
      ) {
        this.#outbox.delete(id)
        staged++
      } else if (
        dead < opts.limit &&
        row.status === "dead" &&
        row.updatedAt < deadBefore
      ) {
        this.#outbox.delete(id)
        dead++
      }
    }
    return staged + dead
  }

  async scheduleTimers(
    timers: NewTimer[],
    opts: { onlyEarlier?: boolean } = {}
  ) {
    this.#writeTimers(
      opts.onlyEarlier
        ? timers.filter((timer) => {
            const existing = this.#timers.get(timer.id)
            return !existing || timer.dueAt < existing.dueAt
          })
        : timers
    )
  }

  async claimDueTimers(
    owner: string,
    limit: number,
    known: Array<{ workflowId: string; hash: string }>,
    opts: { claimMs: number; mismatchGraceMs: number }
  ) {
    const now = this.#clock.now()
    const hashes = new Map(known.map((k) => [k.workflowId, k.hash]))
    const due = [...this.#timers.values()]
      .filter((timer) => {
        if (timer.dueAt.getTime() > now) {
          return false
        }
        if (timer.claimedUntil !== null && timer.claimedUntil >= now) {
          return false
        }
        const hash = hashes.get(timer.workflowId)
        if (hash === undefined) {
          return false
        }
        return (
          hash === timer.definitionHash ||
          timer.createdAt <= now - opts.mismatchGraceMs
        )
      })
      .sort((a, b) => a.dueAt.getTime() - b.dueAt.getTime())
      .slice(0, limit)

    for (const timer of due) {
      timer.claimedBy = owner
      timer.claimedUntil = now + opts.claimMs
    }
    return due.map((timer) => this.#exportTimer(timer))
  }

  async completeTimer(id: string, generation: number) {
    const timer = this.#timers.get(id)
    if (!timer || timer.generation !== generation) {
      return false
    }
    this.#timers.delete(id)
    return true
  }

  async deferTimer(id: string, generation: number, delayMs: number) {
    const timer = this.#timers.get(id)
    if (timer && timer.generation === generation) {
      timer.claimedBy = null
      timer.claimedUntil = null
      timer.dueAt = new Date(this.#clock.now() + delayMs)
    }
  }

  /**
   * Lets the dispatcher sleep until the next timer instead of polling. With
   * `workflowIds`, only timers of those workflows count, as others are never
   * claimed by the caller.
   */
  async nextTimerDueAt(workflowIds?: string[]) {
    const workflows = workflowIds ? new Set(workflowIds) : null
    let next: Date | null = null
    for (const timer of this.#timers.values()) {
      if (workflows && !workflows.has(timer.workflowId)) {
        continue
      }
      const due =
        timer.claimedUntil !== null
          ? new Date(Math.max(timer.dueAt.getTime(), timer.claimedUntil))
          : timer.dueAt
      if (!next || due < next) {
        next = due
      }
    }
    return next
  }

  async upsertSchedule(spec: ScheduleSpec, nextFireAt: Date | null) {
    const existing = this.#schedules.get(spec.workflowId)
    const now = new Date(this.#clock.now())
    const changed =
      !existing ||
      existing.cron !== (spec.cron ?? null) ||
      existing.intervalMs !== (spec.intervalMs ?? null) ||
      existing.numberOfExecutions !== (spec.numberOfExecutions ?? null)

    this.#schedules.set(spec.workflowId, {
      workflowId: spec.workflowId,
      cron: spec.cron ?? null,
      intervalMs: spec.intervalMs ?? null,
      concurrency: spec.concurrency,
      numberOfExecutions: spec.numberOfExecutions ?? null,
      catchUp: spec.catchUp,
      definitionHash: spec.definitionHash,
      remaining: changed
        ? spec.numberOfExecutions ?? null
        : existing!.remaining,
      nextFireAt: changed ? nextFireAt : existing!.nextFireAt,
      lastTransactionId: existing?.lastTransactionId ?? null,
      lastSeenAt: now,
      claimedBy: existing?.claimedBy ?? null,
      claimedUntil: existing?.claimedUntil ?? null,
    })
  }

  async removeSchedule(workflowId: string) {
    this.#schedules.delete(workflowId)
  }

  async claimDueSchedules(
    owner: string,
    limit: number,
    workflowIds: string[],
    claimMs: number
  ): Promise<ClaimedSchedule[]> {
    const now = this.#clock.now()
    const claimed: ClaimedSchedule[] = []
    for (const schedule of this.#schedules.values()) {
      if (claimed.length >= limit) {
        break
      }
      if (
        !workflowIds.includes(schedule.workflowId) ||
        !schedule.nextFireAt ||
        schedule.nextFireAt.getTime() > now ||
        (schedule.claimedUntil !== null && schedule.claimedUntil >= now) ||
        (schedule.remaining !== null && schedule.remaining <= 0)
      ) {
        continue
      }
      schedule.claimedBy = owner
      schedule.claimedUntil = now + claimMs
      claimed.push({
        schedule: this.#exportSchedule(schedule),
        now: new Date(now),
      })
    }
    return claimed
  }

  async advanceSchedule(
    workflowId: string,
    owner: string,
    next: {
      nextFireAt: Date | null
      remaining: number | null
      lastTransactionId: string | null
    }
  ) {
    const schedule = this.#schedules.get(workflowId)
    if (!schedule || schedule.claimedBy !== owner) {
      return false
    }
    schedule.nextFireAt = next.nextFireAt
    schedule.remaining = next.remaining
    schedule.lastTransactionId = next.lastTransactionId
    schedule.claimedBy = null
    schedule.claimedUntil = null
    return true
  }

  async touchSchedules() {}

  async deleteStaleSchedules() {
    return 0
  }

  async heartbeat(worker: WorkerInfo, opts: { liveMs: number }) {
    const now = this.#clock.now()
    this.#heartbeats.set(worker.id, { at: now, mode: worker.mode })
    const live = [...this.#heartbeats]
      .filter(
        ([, beat]) => beat.at > now - opts.liveMs && beat.mode !== "server"
      )
      .map(([id]) => id)
      .sort()
    return { reaper: live.at(0) ?? null }
  }

  async removeWorker(workerId: string) {
    this.#heartbeats.delete(workerId)
  }

  async deleteStaleWorkers(heartbeatCutoff: Date) {
    let deleted = 0
    for (const [id, beat] of this.#heartbeats) {
      if (beat.at < heartbeatCutoff.getTime()) {
        this.#heartbeats.delete(id)
        deleted++
      }
    }
    return deleted
  }

  async scheduleExpiredLeaseResumes(): Promise<string[]> {
    return []
  }

  async recoverOrphanedSteps(): Promise<string[]> {
    return []
  }

  async clearStepOwner(runId: string, stepId: string, attempt: number) {
    const step = this.#runs.get(runId)?.steps.get(stepId)
    if (step && step.status === "waiting" && step.attempt === attempt) {
      step.owner = null
    }
  }

  async stageOutbox(rows: OutboxRow[]) {
    this.#stageRows(rows)
  }

  // Commits apply their outbox changes through these, as one write does in
  // Postgres.
  #stageRows(rows: OutboxRow[]) {
    const now = this.#clock.now()
    for (const row of rows) {
      this.#outbox.set(row.id, {
        ...cloneValue(row),
        status: "staged",
        claimedBy: null,
        claimedUntil: null,
        attempts: 0,
        lastError: null,
        createdAt: now,
        updatedAt: now,
      })
    }
  }

  async deleteOutbox(filter: OutboxFilter) {
    this.#deleteRows(filter)
  }

  #deleteRows(filter: OutboxFilter) {
    // As in Postgres, an empty filter deletes nothing.
    if (Object.values(filter).every((value) => value === undefined)) {
      return
    }
    for (const [id, row] of this.#outbox) {
      const name = (row.message as { name?: string })?.name
      if (
        (filter.groupId === undefined || row.groupId === filter.groupId) &&
        (filter.runId === undefined || row.runId === filter.runId) &&
        (filter.stepId === undefined || row.stepId === filter.stepId) &&
        (filter.attempt === undefined || row.attempt === filter.attempt) &&
        (!filter.names || (!!name && filter.names.includes(name)))
      ) {
        this.#outbox.delete(id)
      }
    }
  }

  async markOutboxReady(groupId: string) {
    this.#readyGroup(groupId)
  }

  #readyGroup(groupId: string) {
    const now = this.#clock.now()
    for (const row of this.#outbox.values()) {
      if (row.groupId === groupId && row.status === "staged") {
        row.status = "ready"
        row.updatedAt = now
      }
    }
  }

  async claimOutbox(
    owner: string,
    limit: number,
    claimMs: number,
    groupId?: string
  ) {
    return this.#claimRows(owner, limit, claimMs, groupId)
  }

  #claimRows(owner: string, limit: number, claimMs: number, groupId?: string) {
    const now = this.#clock.now()
    const claimed = [...this.#outbox.values()]
      .filter(
        (row) =>
          row.status === "ready" &&
          (groupId === undefined || row.groupId === groupId) &&
          (row.claimedUntil === null || row.claimedUntil < now)
      )
      .sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0))
      .slice(0, limit)
    for (const row of claimed) {
      row.claimedBy = owner
      row.claimedUntil = now + claimMs
      row.updatedAt = now
    }
    return claimed.map((row) => this.#exportOutboxRow(row))
  }

  async deleteOutboxIds(ids: string[], owner: string) {
    for (const id of ids) {
      if (this.#outbox.get(id)?.claimedBy === owner) {
        this.#outbox.delete(id)
      }
    }
  }

  async deferOutbox(ids: string[], owner: string, delayMs: number) {
    const until = this.#clock.now() + delayMs
    for (const id of ids) {
      const row = this.#outbox.get(id)
      if (row?.claimedBy === owner) {
        row.claimedUntil = until
        row.updatedAt = this.#clock.now()
      }
    }
  }

  async failOutbox(
    failures: OutboxFailure[],
    owner: string,
    policy: OutboxRetryPolicy
  ): Promise<DeadOutboxRow[]> {
    const now = this.#clock.now()
    const dead: DeadOutboxRow[] = []
    for (const { id, error } of new Map(
      failures.map((f) => [f.id, f])
    ).values()) {
      const row = this.#outbox.get(id)
      if (!row || row.claimedBy !== owner || row.status !== "ready") {
        continue
      }
      const previous = row.attempts
      row.attempts = previous + 1
      row.lastError = cloneValue(error ?? null)
      row.updatedAt = now
      if (row.attempts >= policy.maxAttempts) {
        row.status = "dead"
        row.claimedBy = null
        row.claimedUntil = null
        dead.push({
          ...this.#exportOutboxRow(row),
          attempts: row.attempts,
          lastError: cloneValue(row.lastError),
        })
        continue
      }
      row.claimedUntil =
        now +
        Math.min(
          policy.baseDelayMs * 2 ** Math.min(previous, 40),
          policy.maxDelayMs
        )
    }
    return dead
  }

  #exportOutboxRow(row: StoredOutboxRow): OutboxRow {
    return cloneValue({
      id: row.id,
      groupId: row.groupId,
      runId: row.runId,
      stepId: row.stepId,
      attempt: row.attempt,
      message: row.message,
    })
  }

  #writeTimers(timers: NewTimer[]): number[] {
    const now = this.#clock.now()
    return timers.map((timer) => {
      const existing = this.#timers.get(timer.id)
      const stored: StoredTimer = {
        ...timer,
        dueAt:
          existing && existing.dueAt < timer.dueAt
            ? existing.dueAt
            : timer.dueAt,
        generation: (existing?.generation ?? 0) + 1,
        createdAt: existing?.createdAt ?? now,
        claimedBy: null,
        claimedUntil: null,
      }
      this.#timers.set(timer.id, stored)
      return stored.generation
    })
  }

  #exportTimer(timer: StoredTimer): TimerRecord {
    return {
      id: timer.id,
      kind: timer.kind,
      runId: timer.runId,
      stepId: timer.stepId ?? null,
      attempt: timer.attempt ?? null,
      workflowId: timer.workflowId,
      definitionHash: timer.definitionHash,
      dueAt: new Date(timer.dueAt),
      generation: timer.generation,
    }
  }

  #exportSchedule(schedule: StoredSchedule): ScheduleRecord {
    return {
      workflowId: schedule.workflowId,
      cron: schedule.cron,
      intervalMs: schedule.intervalMs,
      concurrency: schedule.concurrency,
      numberOfExecutions: schedule.numberOfExecutions,
      catchUp: schedule.catchUp,
      definitionHash: schedule.definitionHash,
      remaining: schedule.remaining,
      nextFireAt: schedule.nextFireAt,
      lastTransactionId: schedule.lastTransactionId,
      lastSeenAt: schedule.lastSeenAt,
    }
  }

  #latest(workflowId: string, transactionId: string): StoredRun | undefined {
    let latest: StoredRun | undefined
    for (const stored of this.#runs.values()) {
      const { run } = stored
      if (
        run.workflowId !== workflowId ||
        run.transactionId !== transactionId
      ) {
        continue
      }
      if (!isFinalRunStatus(run.status)) {
        return stored
      }
      if (!latest || run.createdAt >= latest.run.createdAt) {
        latest = stored
      }
    }
    return latest
  }

  #applyChanges(stored: StoredRun, changes: RunChanges) {
    const now = new Date(this.#clock.now())
    const run = stored.run

    if (changes.status) {
      run.status = changes.status
    }
    if ("result" in changes) {
      run.result = cloneValue(changes.result)
    }
    if (changes.errors) {
      run.errors = cloneValue(changes.errors)
    }
    if (changes.flags) {
      run.flags = { ...run.flags, ...changes.flags }
    }
    if (changes.context) {
      run.context = cloneValue(changes.context)
    }
    if (changes.cancelRequestedAt !== undefined) {
      run.cancelRequestedAt = changes.cancelRequestedAt
    }
    if (changes.finished) {
      run.finishedAt = now
      run.retainUntil = run.retentionMs
        ? new Date(now.getTime() + run.retentionMs)
        : null
    }
    for (const step of changes.steps ?? []) {
      stored.steps.set(step.stepId, cloneValue(step))
    }
    run.updatedAt = now
  }

  #export(stored: StoredRun, withSteps: boolean): RunRecord {
    const run = cloneValue(stored.run)
    if (withSteps) {
      run.steps = [...stored.steps.values()].map((step) => cloneValue(step))
    }
    return run
  }
}
