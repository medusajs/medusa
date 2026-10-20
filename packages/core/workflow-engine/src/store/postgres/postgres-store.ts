import { ulid } from "ulid"
import { LeaseLostError } from "../../errors"
import { FINAL_RUN_STATUSES } from "../../runtime/transitions"
import { deserialize, serialize } from "../../serialization/serializer"
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
  StepRecord,
  StepRetryOptions,
  Store,
  TimerRecord,
  WorkerInfo,
} from "../store"
import { SqlClient } from "./client"

const FINAL = [...FINAL_RUN_STATUSES]

const RUN_COLUMNS = `
  id, workflow_id, transaction_id, status, durability, definition_hash,
  input::text AS input, context::text AS context, metadata::text AS metadata,
  result::text AS result, errors::text AS errors, flags::text AS flags,
  parent_run_id, parent_step_id, idempotent, retention_ms,
  cancel_requested_at, deadline_at, retain_until, created_at, updated_at,
  finished_at`

const STEP_COLUMNS = `
  run_id, step_id, status, attempt, has_output, output::text AS output,
  compensate_input::text AS compensate_input, error::text AS error,
  skip_reason, pending_failure::text AS pending_failure, started_at,
  finished_at, owner`

const TIMER_COLUMNS = `
  id, kind, run_id, step_id, attempt, workflow_id, definition_hash, due_at,
  generation`

const SCHEDULE_COLUMNS = `
  workflow_id, cron, interval_ms, concurrency, number_of_executions,
  remaining, catch_up, definition_hash, next_fire_at, last_transaction_id,
  last_seen_at`

/**
 * Inserts the timers in a jsonb array parameter. A timer that exists keeps the
 * earlier due time, gets a new generation and loses its claim. Due times are
 * sent as delays and counted from the database clock, which claims them, so a
 * process clock that differs from it does not shift them.
 */
const upsertTimers = (param: string, from = "", onlyEarlier = false) => `
  INSERT INTO workflow_timer (
    id, kind, run_id, step_id, attempt, workflow_id, definition_hash, due_at
  )
  SELECT t.id, t.kind, t.run_id, t.step_id, t.attempt, t.workflow_id,
         t.definition_hash, now() + ${ms("round(t.delay_ms)")}
  FROM ${
    from ? `${from} CROSS JOIN ` : ""
  }jsonb_to_recordset(${param}::jsonb) AS t(
    id text, kind text, run_id text, step_id text, attempt integer,
    workflow_id text, definition_hash text, delay_ms double precision
  )
  ON CONFLICT (id) DO UPDATE SET
    due_at = LEAST(workflow_timer.due_at, excluded.due_at),
    generation = workflow_timer.generation + 1,
    claimed_by = NULL,
    claimed_until = NULL,
    updated_at = now()
  ${onlyEarlier ? "WHERE excluded.due_at < workflow_timer.due_at" : ""}
  RETURNING generation`

const ms = (value: string) => `(${value}::bigint * interval '1 millisecond')`

/**
 * Deletes the steps and timers of the runs returned by the `runs` CTE.
 */
const deleteRunChildren = (runs: string) => `
  steps AS (
    DELETE FROM workflow_step WHERE run_id IN (SELECT id FROM ${runs})
  ), timers AS (
    DELETE FROM workflow_timer WHERE run_id IN (SELECT id FROM ${runs})
  )`

/**
 * Publishes or drops an outbox group, only if the `run` CTE matched.
 */
/**
 * Writes the outbox changes of a commit: the messages staged with it, then
 * the group it publishes or drops. A statement does not see its own inserts,
 * so messages of the published group are inserted ready, and claimed with the
 * rest of the group when the commit claims it.
 */
const settleOutbox = (p: {
  stage: string
  ready: string
  discard: string
  owner: string
  claimMs: string
}) => `
  outbox_staged AS (
    INSERT INTO workflow_outbox (
      id, group_id, run_id, step_id, attempt, status, message, claimed_by,
      claimed_until
    )
    SELECT o.id, o.group_id, o.run_id, o.step_id, o.attempt,
           CASE WHEN o.group_id = ${p.ready} THEN 'ready' ELSE 'staged' END,
           o.message,
           CASE WHEN o.group_id = ${p.ready} THEN ${p.owner}::text END,
           CASE WHEN o.group_id = ${p.ready} AND ${p.owner}::text IS NOT NULL
             THEN now() + ${ms(p.claimMs)} END
    FROM run CROSS JOIN jsonb_to_recordset(${p.stage}::jsonb) AS o(
      id text, group_id text, run_id text, step_id text, attempt integer,
      message jsonb
    )
    WHERE o.group_id IS DISTINCT FROM ${p.discard}
    RETURNING id, group_id, run_id, step_id, attempt, message, claimed_by
  ), outbox_ready AS (
    UPDATE workflow_outbox SET
      status = 'ready',
      claimed_by = COALESCE(${p.owner}::text, claimed_by),
      claimed_until = CASE WHEN ${p.owner}::text IS NOT NULL
                        THEN now() + ${ms(p.claimMs)} ELSE claimed_until END,
      updated_at = now()
    WHERE group_id = ${p.ready} AND deleted_at IS NULL
      AND EXISTS (SELECT 1 FROM run)
      AND (status = 'staged' OR (
        ${p.owner}::text IS NOT NULL AND status = 'ready'
        AND (claimed_until IS NULL OR claimed_until < now())
      ))
    RETURNING id, group_id, run_id, step_id, attempt, message, claimed_by
  ), outbox_discarded AS (
    DELETE FROM workflow_outbox
    WHERE group_id = ${p.discard} AND EXISTS (SELECT 1 FROM run)
  )`

/**
 * The messages a commit claimed, as a json array.
 */
const claimedOutbox = (owner: string) => `
  (SELECT COALESCE(json_agg(json_build_object(
     'id', c.id, 'group_id', c.group_id, 'run_id', c.run_id,
     'step_id', c.step_id, 'attempt', c.attempt, 'message', c.message::text
   ) ORDER BY c.id), '[]'::json)
   FROM (SELECT * FROM outbox_staged UNION ALL SELECT * FROM outbox_ready) c
   WHERE c.claimed_by = ${owner}::text) AS claimed_outbox`

const UNIQUE_VIOLATION = "23505"
const CREATE_ATTEMPTS = 3
const DELETE_BATCH = 500
// Timers younger than this are never treated as orphans.
const ORPHAN_TIMER_GRACE_MS = 60_000

export interface PostgresStoreOptions {
  client: SqlClient
}

/**
 * Keeps runs in Postgres. Every write that needs the run's lease is a single
 * statement conditioned on the lease token, so a process that lost its lease
 * cannot write.
 */
export class PostgresStore implements Store {
  #client: SqlClient

  constructor(options: PostgresStoreOptions) {
    this.#client = options.client
  }

  async createRun(
    run: NewRun,
    policy: IdPolicy,
    lease?: LeaseRequest,
    timers: NewTimer[] = []
  ): Promise<CreateRunResult> {
    for (let attempt = 1; ; attempt++) {
      if (policy.unique) {
        const existing = await this.findRun(run.workflowId, run.transactionId, {
          steps: true,
        })
        if (existing && !FINAL_RUN_STATUSES.has(existing.status)) {
          return { kind: "running", run: existing }
        }
        if (existing && policy.idempotent) {
          return { kind: "finished", run: existing }
        }
      }

      try {
        return await this.#insertRun(run, lease, timers)
      } catch (error) {
        if ((error as { code?: string })?.code !== UNIQUE_VIOLATION) {
          throw error
        }
      }

      // The active-transaction index applies whatever the policy: another
      // active run of the workflow holds the transaction id.
      const existing = await this.findRun(run.workflowId, run.transactionId, {
        steps: true,
      })
      if (existing && !FINAL_RUN_STATUSES.has(existing.status)) {
        return { kind: "running", run: existing }
      }
      if (existing && policy.unique && policy.idempotent) {
        return { kind: "finished", run: existing }
      }
      // The run that won finished, and maybe was deleted, in the meantime.
      if (attempt >= CREATE_ATTEMPTS) {
        throw new Error(
          `Could not start workflow "${run.workflowId}" with transaction id "${run.transactionId}": it kept conflicting with runs that finished meanwhile`
        )
      }
    }
  }

  async #insertRun(
    run: NewRun,
    lease: LeaseRequest | undefined,
    timers: NewTimer[]
  ): Promise<CreateRunResult> {
    const token = lease ? ulid() : null
    const { rows } = await this.#client.query(
      `WITH run AS (
       INSERT INTO workflow_run (
         id, workflow_id, transaction_id, status, durability,
         definition_hash, input, context, metadata, errors, flags,
         parent_run_id, parent_step_id, idempotent, retention_ms,
         cancel_requested_at, deadline_at, lease_owner, lease_token,
         lease_expires_at
       ) VALUES (
         $1, $2, $3, $4, $5, $6, $7::jsonb, $8::jsonb, $9::jsonb, $10::jsonb,
         $11::jsonb, $12, $13, $14, $15, $16, $17, $18, $19,
         CASE WHEN $19::text IS NULL THEN NULL
              ELSE now() + ${ms("$20")} END
       )
       RETURNING ${RUN_COLUMNS}
       ), timers AS (${upsertTimers("$21", "run")})
       SELECT * FROM run`,
      [
        run.id,
        run.workflowId,
        run.transactionId,
        run.status,
        run.durability,
        run.definitionHash,
        this.#json(run.input),
        this.#json(run.context),
        this.#json(run.metadata),
        this.#json(run.errors),
        this.#json(run.flags),
        run.parentRunId ?? null,
        run.parentStepId ?? null,
        run.idempotent,
        run.retentionMs === null || run.retentionMs === undefined
          ? null
          : String(Math.round(run.retentionMs)),
        run.cancelRequestedAt ?? null,
        run.deadlineAt ?? null,
        lease?.owner ?? null,
        token,
        lease?.ttlMs ?? null,
        this.#timersJson(timers),
      ]
    )

    return {
      kind: "created",
      run: this.#toRun(rows[0]),
      lease:
        lease && token ? { runId: run.id, owner: lease.owner, token } : null,
    }
  }

  async loadRun(runId: string, opts: { steps?: boolean } = {}) {
    const { rows } = await this.#client.query(
      `SELECT ${RUN_COLUMNS} FROM workflow_run
       WHERE id = $1 AND deleted_at IS NULL`,
      [runId]
    )
    const [run] = await this.#toRuns(rows, opts.steps)
    return run ?? null
  }

  async findRun(
    workflowId: string,
    transactionId: string,
    opts: { steps?: boolean } = {}
  ) {
    const { rows } = await this.#client.query(
      `SELECT ${RUN_COLUMNS} FROM workflow_run
       WHERE workflow_id = $1 AND transaction_id = $2 AND deleted_at IS NULL
       ORDER BY (status <> ALL($3::text[])) DESC, created_at DESC, id DESC
       LIMIT 1`,
      [workflowId, transactionId, FINAL]
    )
    const [run] = await this.#toRuns(rows, opts.steps)
    return run ?? null
  }

  async commit(lease: Lease, changes: RunChanges): Promise<CommitResult> {
    if (changes.delete) {
      const { rows } = await this.#client.query(
        `WITH run AS (
           DELETE FROM workflow_run WHERE id = $1 AND lease_token = $2
           RETURNING id, cancel_requested_at
         ), ${deleteRunChildren("run")}, ${settleOutbox({
          stage: "$5",
          ready: "$3",
          discard: "$4",
          owner: "$6",
          claimMs: "$7",
        })}
         SELECT run.*, ${claimedOutbox("$6")} FROM run`,
        [
          lease.runId,
          lease.token,
          changes.outbox?.readyGroup ?? null,
          changes.outbox?.discardGroup ?? null,
          this.#outboxJson(changes.outbox?.stage ?? []),
          changes.outbox?.claim?.owner ?? null,
          changes.outbox?.claim?.claimMs ?? null,
        ]
      )
      if (!rows.length) {
        throw new LeaseLostError(lease.runId)
      }
      return this.#commitResult(rows[0])
    }

    const { rows } = await this.#client.query(
      `WITH run AS (
         UPDATE workflow_run SET
           status = COALESCE($3, status),
           result = CASE WHEN $4::boolean THEN $5::jsonb ELSE result END,
           errors = COALESCE($6::jsonb, errors),
           flags = COALESCE($7::jsonb, flags),
           context = COALESCE($8::jsonb, context),
           cancel_requested_at = CASE WHEN $9::boolean THEN $10::timestamptz
                                      ELSE cancel_requested_at END,
           finished_at = CASE WHEN $11::boolean THEN now() ELSE finished_at END,
           retain_until = CASE
             WHEN $11::boolean AND retention_ms IS NOT NULL
               THEN now() + ${ms("retention_ms")}
             ELSE retain_until END,
           lease_owner = CASE WHEN $13::boolean THEN NULL ELSE lease_owner END,
           lease_token = CASE WHEN $13::boolean THEN NULL ELSE lease_token END,
           lease_expires_at = CASE WHEN $13::boolean THEN NULL
                                   ELSE lease_expires_at END,
           updated_at = now()
         WHERE id = $1 AND lease_token = $2
         RETURNING id, cancel_requested_at
       ), steps AS (
         INSERT INTO workflow_step (
           run_id, step_id, status, attempt, has_output, output,
           compensate_input, error, skip_reason, pending_failure, started_at,
           finished_at, owner
         )
         SELECT run.id, s.step_id, s.status, s.attempt, s.has_output, s.output,
                s.compensate_input, s.error, s.skip_reason, s.pending_failure,
                to_timestamp(s.started_at / 1000.0),
                to_timestamp(s.finished_at / 1000.0), s.owner
         FROM run CROSS JOIN jsonb_to_recordset($12::jsonb) AS s(
           step_id text, status text, attempt integer, has_output boolean,
           output jsonb, compensate_input jsonb, error jsonb, skip_reason text,
           pending_failure jsonb, started_at double precision,
           finished_at double precision, owner text
         )
         ON CONFLICT (run_id, step_id) DO UPDATE SET
           status = excluded.status,
           attempt = excluded.attempt,
           has_output = excluded.has_output,
           output = excluded.output,
           compensate_input = excluded.compensate_input,
           error = excluded.error,
           skip_reason = excluded.skip_reason,
           pending_failure = excluded.pending_failure,
           started_at = excluded.started_at,
           finished_at = excluded.finished_at,
           owner = excluded.owner,
           updated_at = now()
       ), deleted_timers AS (
         DELETE FROM workflow_timer
         WHERE run_id IN (SELECT id FROM run)
           AND ($15::boolean OR id = ANY($16::text[]))
       ), timers AS (${upsertTimers("$14", "run")}
       ), ${settleOutbox({
         stage: "$19",
         ready: "$17",
         discard: "$18",
         owner: "$20",
         claimMs: "$21",
       })}
       SELECT run.*, ${claimedOutbox("$20")} FROM run`,
      [
        lease.runId,
        lease.token,
        changes.status ?? null,
        "result" in changes,
        this.#json(changes.result),
        changes.errors ? this.#json(changes.errors) : null,
        changes.flags ? this.#json(changes.flags) : null,
        changes.context ? this.#json(changes.context) : null,
        changes.cancelRequestedAt !== undefined,
        changes.cancelRequestedAt ?? null,
        !!changes.finished,
        serialize((changes.steps ?? []).map((step) => this.#stepRow(step))),
        !!changes.releaseLease,
        this.#timersJson(changes.timers ?? []),
        !!changes.deleteRunTimers,
        changes.deleteTimers ?? [],
        changes.outbox?.readyGroup ?? null,
        changes.outbox?.discardGroup ?? null,
        this.#outboxJson(changes.outbox?.stage ?? []),
        changes.outbox?.claim?.owner ?? null,
        changes.outbox?.claim?.claimMs ?? null,
      ]
    )

    if (!rows.length) {
      throw new LeaseLostError(lease.runId)
    }
    return this.#commitResult(rows[0])
  }

  async completeWaitingStep(
    runId: string,
    stepId: string,
    outcome: StepOutcome,
    timer?: NewTimer,
    expect: CompletionExpectation = {}
  ): Promise<CompletionResult> {
    let set: string
    let params: unknown[]
    if (outcome.kind === "output") {
      set = `status = 'succeeded', has_output = true, output = $4::jsonb,
             compensate_input = $5::jsonb, error = NULL`
      params = [this.#json(outcome.output), this.#json(outcome.compensateInput)]
    } else if (outcome.kind === "skip") {
      set = `status = 'skipped', skip_reason = 'condition'`
      params = []
    } else {
      set = `status = $4, error = $5::jsonb, pending_failure = $6::jsonb`
      params = [
        outcome.timedOut ? "timed_out" : "failed",
        this.#json(outcome.error),
        this.#json({ permanent: outcome.permanent }),
      ]
    }

    const attempt = `$${params.length + 4}`
    const owner = `$${params.length + 5}`
    return this.#updateStepWithTimer(
      `UPDATE workflow_step SET ${set}, owner = NULL, finished_at = now(),
         updated_at = now()
       WHERE run_id = $1 AND step_id = $2 AND status = 'waiting'
         AND (${attempt}::integer IS NULL OR attempt = ${attempt}::integer)
         AND (${owner}::text IS NULL OR owner = ${owner}::text)
       RETURNING status`,
      [
        runId,
        stepId,
        timer ? this.#timersJson([timer]) : "[]",
        ...params,
        expect.attempt ?? null,
        expect.owner ?? null,
      ],
      runId,
      stepId
    )
  }

  async requestStepRetry(
    runId: string,
    stepId: string,
    timer?: NewTimer,
    opts: StepRetryOptions = {}
  ): Promise<CompletionResult> {
    return this.#updateStepWithTimer(
      `UPDATE workflow_step SET status = 'pending', pending_failure = NULL,
         owner = NULL, updated_at = now()
       WHERE run_id = $1 AND step_id = $2
         AND (status = 'retry_scheduled'
           OR (NOT $4::boolean AND status = 'waiting'))
       RETURNING status`,
      [
        runId,
        stepId,
        timer ? this.#timersJson([timer]) : "[]",
        !!opts.scheduledOnly,
        opts.deleteTimers ?? [],
      ],
      runId,
      stepId,
      "$5"
    )
  }

  /**
   * Runs a conditional step update and, only if it matched, touches the run,
   * deletes the timers in `deleteTimersParam` and writes the timer, in the
   * same statement.
   */
  async #updateStepWithTimer(
    update: string,
    params: unknown[],
    runId: string,
    stepId: string,
    deleteTimersParam?: string
  ): Promise<CompletionResult> {
    const deleteTimers = deleteTimersParam
      ? `deleted_timers AS (
           DELETE FROM workflow_timer
           WHERE run_id = $1 AND id = ANY(${deleteTimersParam}::text[])
             AND EXISTS (SELECT 1 FROM step)
         ),`
      : ""
    const { rows } = await this.#client.query(
      `WITH step AS (${update}),
       touched AS (
         UPDATE workflow_run SET updated_at = now()
         WHERE id = $1 AND EXISTS (SELECT 1 FROM step)
       ), ${deleteTimers}
       timer AS (${upsertTimers("$3", "step")})
       SELECT step.status, (SELECT generation FROM timer LIMIT 1) AS generation
       FROM step`,
      params
    )
    if (rows.length) {
      return {
        ok: true,
        status: rows[0].status,
        timerGeneration: rows[0].generation ?? undefined,
      }
    }
    return { ok: false, status: await this.#stepStatus(runId, stepId) }
  }

  async requestCancel(runId: string, timer?: NewTimer) {
    await this.#client.query(
      `WITH run AS (
         UPDATE workflow_run
         SET cancel_requested_at = COALESCE(cancel_requested_at, now()),
             updated_at = now()
         WHERE id = $1
         RETURNING id
       ), timer AS (${upsertTimers("$2", "run")})
       SELECT 1`,
      [runId, timer ? this.#timersJson([timer]) : "[]"]
    )
  }

  async acquireLease(
    runId: string,
    owner: string,
    ttlMs: number,
    opts: { force?: boolean } = {}
  ): Promise<AcquireLeaseResult> {
    const token = ulid()
    const { rows } = await this.#client.query<{
      acquired: boolean
      found: boolean
    }>(
      `WITH acquired AS (
         UPDATE workflow_run
         SET lease_owner = $2, lease_token = $3,
             lease_expires_at = now() + ${ms("$4")}
         WHERE id = $1
           AND ($5::boolean OR lease_token IS NULL OR (
             lease_expires_at < now() AND NOT EXISTS (
               SELECT 1 FROM workflow_worker w
               WHERE w.id = workflow_run.lease_owner
                 AND w.heartbeat_at > now() - ${ms("$4")}
             )
           ))
         RETURNING id
       )
       SELECT EXISTS (SELECT 1 FROM acquired) AS acquired,
              EXISTS (SELECT 1 FROM workflow_run WHERE id = $1) AS found`,
      [runId, owner, token, ttlMs, !!opts.force]
    )
    if (rows[0]?.acquired) {
      return { ok: true, lease: { runId, owner, token } }
    }
    return { ok: false, reason: rows[0]?.found ? "held" : "missing" }
  }

  async releaseLeasesOf(owner: string) {
    const { rows } = await this.#client.query<{ id: string }>(
      `UPDATE workflow_run
       SET lease_owner = NULL, lease_token = NULL, lease_expires_at = NULL
       WHERE lease_owner = $1 AND deleted_at IS NULL
       RETURNING id`,
      [owner]
    )
    return rows.map((row) => row.id)
  }

  async releaseLease(lease: Lease) {
    await this.#client.query(
      `UPDATE workflow_run
       SET lease_owner = NULL, lease_token = NULL, lease_expires_at = NULL
       WHERE id = $1 AND lease_token = $2`,
      [lease.runId, lease.token]
    )
  }

  async queryRuns(
    filter: RunFilter,
    page: Page = {}
  ): Promise<[RunRecord[], number]> {
    const params: unknown[] = []
    const where: string[] = ["deleted_at IS NULL"]
    const param = (value: unknown) => {
      params.push(value)
      return `$${params.length}`
    }
    const list = (value?: string | string[]) =>
      value === undefined ? undefined : Array.isArray(value) ? value : [value]

    if (filter.ids) {
      where.push(`id = ANY(${param(filter.ids)}::text[])`)
    }
    const workflowIds = list(filter.workflowId)
    if (workflowIds) {
      where.push(`workflow_id = ANY(${param(workflowIds)}::text[])`)
    }
    const transactionIds = list(filter.transactionId)
    if (transactionIds) {
      where.push(`transaction_id = ANY(${param(transactionIds)}::text[])`)
    }
    if (filter.status) {
      where.push(`status = ANY(${param(filter.status)}::text[])`)
    }
    if (filter.statusNot) {
      where.push(`status <> ALL(${param(filter.statusNot)}::text[])`)
    }
    if (filter.parentRunId) {
      where.push(`parent_run_id = ${param(filter.parentRunId)}`)
    }
    if (filter.q) {
      const q = param(`%${filter.q}%`)
      where.push(`(workflow_id ILIKE ${q} OR transaction_id ILIKE ${q})`)
    }
    if (filter.createdAfter) {
      where.push(`created_at >= ${param(filter.createdAfter)}`)
    }
    if (filter.createdBefore) {
      where.push(`created_at <= ${param(filter.createdBefore)}`)
    }

    const whereSql = `WHERE ${where.join(" AND ")}`
    const order = page.order === "asc" ? "ASC" : "DESC"
    const orderBy = page.orderBy === "updated_at" ? "updated_at" : "created_at"

    const countParams = [...params]
    const limit = page.limit === undefined ? "" : `LIMIT ${param(page.limit)}`
    const offset = page.offset ? `OFFSET ${param(page.offset)}` : ""

    const [{ rows }, count] = await Promise.all([
      this.#client.query(
        `SELECT ${RUN_COLUMNS} FROM workflow_run ${whereSql}
         ORDER BY ${orderBy} ${order}, id ${order} ${limit} ${offset}`,
        params
      ),
      this.#client.query<{ count: number }>(
        `SELECT count(*)::int AS count FROM workflow_run ${whereSql}`,
        countParams
      ),
    ])

    const runs = await this.#toRuns(rows, page.withSteps)
    return [runs, count.rows[0]?.count ?? 0]
  }

  async deleteExpired(opts: { batchSize?: number } = {}) {
    const batchSize = opts.batchSize ?? DELETE_BATCH
    let total = 0
    for (;;) {
      const { rows } = await this.#client.query<{ count: number }>(
        `WITH runs AS (
           DELETE FROM workflow_run WHERE id IN (
             SELECT id FROM workflow_run
             WHERE retain_until <= now() AND retain_until IS NOT NULL
               AND deleted_at IS NULL AND status = ANY($1::text[])
             ORDER BY retain_until
             LIMIT $2
             FOR UPDATE SKIP LOCKED
           )
           RETURNING id
         ), ${deleteRunChildren("runs")}
         SELECT count(*)::int AS count FROM runs`,
        [FINAL, batchSize]
      )
      const count = rows[0]?.count ?? 0
      total += count
      if (count < batchSize) {
        return total
      }
    }
  }

  async deleteOrphans(opts: {
    limit: number
    outboxStaleMs: number
    deadOutboxRetentionMs?: number
  }) {
    const { rows } = await this.#client.query<{ count: number }>(
      `WITH timers AS (
         DELETE FROM workflow_timer WHERE id IN (
           SELECT t.id FROM workflow_timer t
           WHERE t.created_at < now() - ${ms("$3")}
             AND NOT EXISTS (SELECT 1 FROM workflow_run r WHERE r.id = t.run_id)
           LIMIT $1
           FOR UPDATE OF t SKIP LOCKED
         )
         RETURNING id
       ), outbox AS (
         DELETE FROM workflow_outbox WHERE id IN (
           SELECT o.id FROM workflow_outbox o
           WHERE o.status = 'staged' AND o.deleted_at IS NULL
             AND o.created_at < now() - ${ms("$2")}
             AND NOT EXISTS (
               SELECT 1 FROM workflow_outbox g
               JOIN workflow_run r ON r.id = g.run_id
               WHERE g.group_id = o.group_id
             )
           LIMIT $1
           FOR UPDATE OF o SKIP LOCKED
         )
         RETURNING id
       ), dead AS (
         DELETE FROM workflow_outbox WHERE id IN (
           SELECT id FROM workflow_outbox
           WHERE status = 'dead' AND deleted_at IS NULL
             AND updated_at < now() - ${ms("$4")}
           LIMIT $1
           FOR UPDATE SKIP LOCKED
         )
         RETURNING id
       )
       SELECT ((SELECT count(*) FROM timers) + (SELECT count(*) FROM outbox)
         + (SELECT count(*) FROM dead))::int AS count`,
      [
        opts.limit,
        opts.outboxStaleMs,
        ORPHAN_TIMER_GRACE_MS,
        opts.deadOutboxRetentionMs ?? DEFAULT_DEAD_OUTBOX_RETENTION_MS,
      ]
    )
    return rows[0]?.count ?? 0
  }

  async now() {
    const { rows } = await this.#client.query<{ now: Date }>(
      `SELECT now() AS now`
    )
    return rows[0].now
  }

  async scheduleTimers(
    timers: NewTimer[],
    opts: { onlyEarlier?: boolean } = {}
  ) {
    if (!timers.length) {
      return
    }
    await this.#client.query(upsertTimers("$1", "", !!opts.onlyEarlier), [
      this.#timersJson(timers),
    ])
  }

  async claimDueTimers(
    owner: string,
    limit: number,
    known: Array<{ workflowId: string; hash: string }>,
    opts: { claimMs: number; mismatchGraceMs: number }
  ): Promise<TimerRecord[]> {
    if (!known.length || limit <= 0) {
      return []
    }
    const { rows } = await this.#client.query(
      `UPDATE workflow_timer
       SET claimed_by = $1,
           claimed_until = now() + ${ms("$2")},
           updated_at = now()
       WHERE id IN (
         SELECT t.id FROM workflow_timer t
         JOIN unnest($3::text[], $4::text[]) AS k(workflow_id, hash)
           ON k.workflow_id = t.workflow_id
         WHERE t.due_at <= now()
           AND (t.claimed_until IS NULL OR t.claimed_until < now())
           AND (t.definition_hash = k.hash
             OR t.created_at <= now() - ${ms("$5")})
         ORDER BY t.due_at
         LIMIT $6
         FOR UPDATE OF t SKIP LOCKED
       )
       RETURNING ${TIMER_COLUMNS}`,
      [
        owner,
        opts.claimMs,
        known.map((k) => k.workflowId),
        known.map((k) => k.hash),
        opts.mismatchGraceMs,
        limit,
      ]
    )
    return rows.map((row) => this.#toTimer(row))
  }

  async completeTimer(id: string, generation: number) {
    const { rowCount } = await this.#client.query(
      `DELETE FROM workflow_timer WHERE id = $1 AND generation = $2`,
      [id, generation]
    )
    return rowCount > 0
  }

  async deferTimer(id: string, generation: number, delayMs: number) {
    await this.#client.query(
      `UPDATE workflow_timer
       SET claimed_by = NULL, claimed_until = NULL,
           due_at = now() + ${ms("$3")},
           updated_at = now()
       WHERE id = $1 AND generation = $2`,
      [id, generation, delayMs]
    )
  }

  async upsertSchedule(spec: ScheduleSpec, nextFireAt: Date | null) {
    await this.#client.query(
      `INSERT INTO workflow_schedule (
         workflow_id, cron, interval_ms, concurrency, number_of_executions,
         remaining, catch_up, definition_hash, next_fire_at, last_seen_at
       ) VALUES ($1, $2, $3, $4, $5, $5, $6, $7, $8, now())
       ON CONFLICT (workflow_id) DO UPDATE SET
         concurrency = excluded.concurrency,
         catch_up = excluded.catch_up,
         definition_hash = excluded.definition_hash,
         last_seen_at = now(),
         updated_at = now(),
         remaining = CASE
           WHEN workflow_schedule.number_of_executions IS DISTINCT FROM excluded.number_of_executions
             OR workflow_schedule.cron IS DISTINCT FROM excluded.cron
             OR workflow_schedule.interval_ms IS DISTINCT FROM excluded.interval_ms
           THEN excluded.remaining ELSE workflow_schedule.remaining END,
         next_fire_at = CASE
           WHEN workflow_schedule.number_of_executions IS DISTINCT FROM excluded.number_of_executions
             OR workflow_schedule.cron IS DISTINCT FROM excluded.cron
             OR workflow_schedule.interval_ms IS DISTINCT FROM excluded.interval_ms
           THEN excluded.next_fire_at ELSE workflow_schedule.next_fire_at END,
         number_of_executions = excluded.number_of_executions,
         cron = excluded.cron,
         interval_ms = excluded.interval_ms`,
      [
        spec.workflowId,
        spec.cron ?? null,
        spec.intervalMs === null || spec.intervalMs === undefined
          ? null
          : String(Math.round(spec.intervalMs)),
        spec.concurrency,
        spec.numberOfExecutions ?? null,
        spec.catchUp,
        spec.definitionHash,
        nextFireAt,
      ]
    )
  }

  async removeSchedule(workflowId: string) {
    await this.#client.query(
      `DELETE FROM workflow_schedule WHERE workflow_id = $1`,
      [workflowId]
    )
  }

  async claimDueSchedules(
    owner: string,
    limit: number,
    workflowIds: string[],
    claimMs: number
  ): Promise<ClaimedSchedule[]> {
    if (!workflowIds.length || limit <= 0) {
      return []
    }
    const { rows } = await this.#client.query(
      `UPDATE workflow_schedule
       SET claimed_by = $1,
           claimed_until = now() + ${ms("$2")},
           updated_at = now()
       WHERE workflow_id IN (
         SELECT workflow_id FROM workflow_schedule
         WHERE workflow_id = ANY($3::text[])
           AND next_fire_at <= now() AND next_fire_at IS NOT NULL
           AND deleted_at IS NULL
           AND (claimed_until IS NULL OR claimed_until < now())
           AND (remaining IS NULL OR remaining > 0)
         ORDER BY next_fire_at
         LIMIT $4
         FOR UPDATE SKIP LOCKED
       )
       RETURNING ${SCHEDULE_COLUMNS}, now() AS db_now`,
      [owner, claimMs, workflowIds, limit]
    )
    return rows.map((row) => ({
      schedule: this.#toSchedule(row),
      now: row.db_now,
    }))
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
    const { rowCount } = await this.#client.query(
      `UPDATE workflow_schedule
       SET next_fire_at = $3, remaining = $4, last_transaction_id = $5,
           claimed_by = NULL, claimed_until = NULL, updated_at = now()
       WHERE workflow_id = $1 AND claimed_by = $2`,
      [
        workflowId,
        owner,
        next.nextFireAt,
        next.remaining,
        next.lastTransactionId,
      ]
    )
    return rowCount > 0
  }

  async touchSchedules(workflowIds: string[]) {
    if (!workflowIds.length) {
      return
    }
    await this.#client.query(
      `UPDATE workflow_schedule SET last_seen_at = now(), updated_at = now()
       WHERE workflow_id = ANY($1::text[])`,
      [workflowIds]
    )
  }

  async deleteStaleSchedules(olderThan: Date) {
    const { rowCount } = await this.#client.query(
      `DELETE FROM workflow_schedule WHERE last_seen_at < $1`,
      [olderThan]
    )
    return rowCount
  }

  async heartbeat(worker: WorkerInfo, opts: { liveMs: number }) {
    // The statement does not see its own insert, so this worker is added to
    // the live ones by hand.
    const { rows } = await this.#client.query<{ reaper: string | null }>(
      `WITH beat AS (
         INSERT INTO workflow_worker (id, mode, started_at, heartbeat_at)
         VALUES ($1, $2, now(), now())
         ON CONFLICT (id) DO UPDATE SET
           heartbeat_at = now(), mode = excluded.mode, updated_at = now()
         RETURNING id, mode
       )
       SELECT min(id) AS reaper FROM (
         SELECT id FROM workflow_worker
         WHERE heartbeat_at > now() - ${ms("$3")} AND mode <> 'server'
         UNION
         SELECT id FROM beat WHERE mode <> 'server'
       ) live`,
      [worker.id, worker.mode, opts.liveMs]
    )
    return { reaper: rows[0]?.reaper ?? null }
  }

  async removeWorker(workerId: string) {
    await this.#client.query(`DELETE FROM workflow_worker WHERE id = $1`, [
      workerId,
    ])
  }

  async deleteStaleWorkers(heartbeatCutoff: Date) {
    const { rowCount } = await this.#client.query(
      `DELETE FROM workflow_worker WHERE heartbeat_at < $1`,
      [heartbeatCutoff]
    )
    return rowCount
  }

  async scheduleExpiredLeaseResumes(limit: number, liveMs: number) {
    // Locking the runs makes concurrent reapers skip each other's runs until
    // the resume timers exist.
    const { rows } = await this.#client.query<{ run_id: string }>(
      `WITH expired AS (
         SELECT r.id, r.workflow_id, r.definition_hash FROM workflow_run r
         WHERE r.status IN ('running', 'compensating') AND r.deleted_at IS NULL
           AND (r.lease_token IS NULL OR (
             r.lease_expires_at < now() AND NOT EXISTS (
               SELECT 1 FROM workflow_worker w
               WHERE w.id = r.lease_owner
                 AND w.heartbeat_at > now() - ${ms("$2")}
             )
           ))
           AND NOT EXISTS (
             SELECT 1 FROM workflow_timer t
             WHERE t.run_id = r.id AND t.kind = 'resume'
           )
         ORDER BY r.lease_expires_at NULLS FIRST, r.id
         LIMIT $1
         FOR UPDATE OF r SKIP LOCKED
       )
       INSERT INTO workflow_timer (
         id, kind, run_id, workflow_id, definition_hash, due_at
       )
       SELECT 'resume:' || id, 'resume', id, workflow_id, definition_hash,
              now()
       FROM expired
       ON CONFLICT (id) DO NOTHING
       RETURNING run_id`,
      [limit, liveMs]
    )
    return rows.map((row) => row.run_id)
  }

  async recoverOrphanedSteps(heartbeatCutoff: Date) {
    const { rows } = await this.#client.query<{ run_id: string }>(
      `UPDATE workflow_step SET status = 'pending', owner = NULL,
         updated_at = now()
       WHERE status = 'waiting' AND owner IS NOT NULL AND deleted_at IS NULL
         AND owner NOT IN (
           SELECT id FROM workflow_worker WHERE heartbeat_at > $1
         )
       RETURNING run_id`,
      [heartbeatCutoff]
    )
    return [...new Set(rows.map((row) => row.run_id))]
  }

  async clearStepOwner(runId: string, stepId: string, attempt: number) {
    await this.#client.query(
      `UPDATE workflow_step SET owner = NULL, updated_at = now()
       WHERE run_id = $1 AND step_id = $2 AND status = 'waiting'
         AND attempt = $3`,
      [runId, stepId, attempt]
    )
  }

  async stageOutbox(rows: OutboxRow[]) {
    if (!rows.length) {
      return
    }
    await this.#client.query(
      `INSERT INTO workflow_outbox (
         id, group_id, run_id, step_id, attempt, status, message
       )
       SELECT r.id, r.group_id, r.run_id, r.step_id, r.attempt, 'staged',
              r.message
       FROM jsonb_to_recordset($1::jsonb) AS r(
         id text, group_id text, run_id text, step_id text, attempt integer,
         message jsonb
       )`,
      [this.#outboxJson(rows)]
    )
  }

  async deleteOutbox(filter: OutboxFilter) {
    const params: unknown[] = []
    const where: string[] = []
    const add = (sql: string, value: unknown) => {
      params.push(value)
      where.push(sql.replace("?", `$${params.length}`))
    }
    if (filter.groupId !== undefined) add("group_id = ?", filter.groupId)
    if (filter.runId !== undefined) add("run_id = ?", filter.runId)
    if (filter.stepId !== undefined) add("step_id = ?", filter.stepId)
    if (filter.attempt !== undefined) add("attempt = ?", filter.attempt)
    if (filter.names) add("message->>'name' = ANY(?::text[])", filter.names)
    if (!where.length) {
      return
    }
    await this.#client.query(
      `DELETE FROM workflow_outbox WHERE ${where.join(" AND ")}`,
      params
    )
  }

  async markOutboxReady(groupId: string) {
    await this.#client.query(
      `UPDATE workflow_outbox SET status = 'ready', updated_at = now()
       WHERE group_id = $1 AND status = 'staged'`,
      [groupId]
    )
  }

  async claimOutbox(
    owner: string,
    limit: number,
    claimMs: number,
    groupId?: string
  ): Promise<OutboxRow[]> {
    const { rows } = await this.#client.query(
      `UPDATE workflow_outbox
       SET claimed_by = $1,
           claimed_until = now() + ${ms("$2")},
           updated_at = now()
       WHERE id IN (
         SELECT id FROM workflow_outbox
         WHERE status = 'ready' AND deleted_at IS NULL
           AND ($4::text IS NULL OR group_id = $4)
           AND (claimed_until IS NULL OR claimed_until < now())
         ORDER BY id
         LIMIT $3
         FOR UPDATE SKIP LOCKED
       )
       RETURNING id, group_id, run_id, step_id, attempt, message::text AS message`,
      [owner, claimMs, limit, groupId ?? null]
    )
    return rows
      .map((row) => this.#toOutboxRow(row))
      .sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0))
  }

  async deleteOutboxIds(ids: string[], owner: string) {
    if (!ids.length) {
      return
    }
    await this.#client.query(
      `DELETE FROM workflow_outbox
       WHERE id = ANY($1::text[]) AND claimed_by = $2`,
      [ids, owner]
    )
  }

  async deferOutbox(ids: string[], owner: string, delayMs: number) {
    if (!ids.length) {
      return
    }
    await this.#client.query(
      `UPDATE workflow_outbox
       SET claimed_until = now() + ${ms("$3")},
           updated_at = now()
       WHERE id = ANY($1::text[]) AND claimed_by = $2`,
      [ids, owner, Math.round(delayMs)]
    )
  }

  async failOutbox(
    failures: OutboxFailure[],
    owner: string,
    policy: OutboxRetryPolicy
  ): Promise<DeadOutboxRow[]> {
    if (!failures.length) {
      return []
    }
    // SET expressions read the attempts before the increment.
    const { rows } = await this.#client.query(
      `UPDATE workflow_outbox o SET
         attempts = o.attempts + 1,
         last_error = f.error,
         status = CASE WHEN o.attempts + 1 >= $3 THEN 'dead' ELSE o.status END,
         claimed_by = CASE WHEN o.attempts + 1 >= $3 THEN NULL
                           ELSE o.claimed_by END,
         claimed_until = CASE WHEN o.attempts + 1 >= $3 THEN NULL
           ELSE now() + LEAST(
             $4::double precision * power(2, LEAST(o.attempts, 40)),
             $5::double precision
           ) * interval '1 millisecond' END,
         updated_at = now()
       FROM jsonb_to_recordset($1::jsonb) AS f(id text, error jsonb)
       WHERE o.id = f.id AND o.claimed_by = $2 AND o.status = 'ready'
       RETURNING o.id, o.group_id, o.run_id, o.step_id, o.attempt,
         o.message::text AS message, o.status, o.attempts,
         o.last_error::text AS last_error`,
      [
        serialize(
          [...new Map(failures.map((f) => [f.id, f])).values()].map((f) => ({
            id: f.id,
            error: f.error ?? null,
          }))
        ),
        owner,
        policy.maxAttempts,
        policy.baseDelayMs,
        policy.maxDelayMs,
      ]
    )
    return rows
      .filter((row) => row.status === "dead")
      .map((row) => ({
        ...this.#toOutboxRow(row),
        attempts: row.attempts,
        lastError: this.#parse(row.last_error) ?? null,
      }))
  }

  #outboxJson(rows: OutboxRow[]): string {
    return serialize(
      rows.map((row) => ({
        id: row.id,
        group_id: row.groupId,
        run_id: row.runId,
        step_id: row.stepId ?? null,
        attempt: row.attempt ?? null,
        message: row.message,
      }))
    )
  }

  #commitResult(row: Record<string, any>): CommitResult {
    const claimed = (row.claimed_outbox ?? []) as Record<string, any>[]
    return {
      cancelRequested: !!row.cancel_requested_at,
      ...(claimed.length
        ? { claimedOutbox: claimed.map((c) => this.#toOutboxRow(c)) }
        : {}),
    }
  }

  #toOutboxRow(row: Record<string, any>): OutboxRow {
    return {
      id: row.id,
      groupId: row.group_id,
      runId: row.run_id,
      stepId: row.step_id,
      attempt: row.attempt,
      message: this.#parse(row.message),
    }
  }

  #timersJson(timers: NewTimer[]): string {
    // One statement cannot write the same timer twice.
    const unique = [...new Map(timers.map((t) => [t.id, t])).values()]
    const now = Date.now()
    return JSON.stringify(
      unique.map((timer) => ({
        id: timer.id,
        kind: timer.kind,
        run_id: timer.runId,
        step_id: timer.stepId ?? null,
        attempt: timer.attempt ?? null,
        workflow_id: timer.workflowId,
        definition_hash: timer.definitionHash,
        delay_ms: new Date(timer.dueAt).getTime() - now,
      }))
    )
  }

  #toTimer(row: Record<string, any>): TimerRecord {
    return {
      id: row.id,
      kind: row.kind,
      runId: row.run_id,
      stepId: row.step_id,
      attempt: row.attempt,
      workflowId: row.workflow_id,
      definitionHash: row.definition_hash,
      dueAt: row.due_at,
      generation: row.generation,
    }
  }

  #toSchedule(row: Record<string, any>): ScheduleRecord {
    return {
      workflowId: row.workflow_id,
      cron: row.cron,
      intervalMs: row.interval_ms === null ? null : Number(row.interval_ms),
      concurrency: row.concurrency,
      numberOfExecutions: row.number_of_executions,
      remaining: row.remaining,
      catchUp: row.catch_up,
      definitionHash: row.definition_hash,
      nextFireAt: row.next_fire_at,
      lastTransactionId: row.last_transaction_id,
      lastSeenAt: row.last_seen_at,
    }
  }

  /**
   * Maps run rows, loading their steps in one query when asked.
   */
  async #toRuns(rows: Record<string, any>[], withSteps?: boolean) {
    const runs = rows.map((row) => this.#toRun(row))
    if (!withSteps || !runs.length) {
      return runs
    }
    const { rows: stepRows } = await this.#client.query(
      `SELECT ${STEP_COLUMNS} FROM workflow_step WHERE run_id = ANY($1::text[])`,
      [runs.map((run) => run.id)]
    )
    const byRun = new Map(runs.map((run) => [run.id, run]))
    for (const run of runs) {
      run.steps = []
    }
    for (const row of stepRows) {
      byRun.get(row.run_id)!.steps!.push(this.#toStep(row))
    }
    return runs
  }

  async #stepStatus(runId: string, stepId: string) {
    const { rows } = await this.#client.query<{ status: StepRecord["status"] }>(
      `SELECT status FROM workflow_step WHERE run_id = $1 AND step_id = $2`,
      [runId, stepId]
    )
    return rows[0]?.status
  }

  #json(value: unknown): string | null {
    if (value === undefined) {
      return null
    }
    return serialize(value) ?? null
  }

  #parse<T>(text: string | null): T | undefined {
    return text === null || text === undefined
      ? undefined
      : deserialize<T>(text)
  }

  #stepRow(step: StepRecord) {
    const hasOutput = "output" in step || "compensateInput" in step
    return {
      step_id: step.stepId,
      status: step.status,
      attempt: step.attempt,
      has_output: hasOutput,
      output: hasOutput ? step.output ?? null : null,
      compensate_input: hasOutput ? step.compensateInput ?? null : null,
      error: step.error ?? null,
      skip_reason: step.skipReason ?? null,
      pending_failure: step.pendingFailure ?? null,
      started_at: step.startedAt ? new Date(step.startedAt).getTime() : null,
      finished_at: step.finishedAt ? new Date(step.finishedAt).getTime() : null,
      owner: step.owner ?? null,
    }
  }

  #toRun(row: Record<string, any>): RunRecord {
    return {
      id: row.id,
      workflowId: row.workflow_id,
      transactionId: row.transaction_id,
      status: row.status,
      durability: row.durability,
      definitionHash: row.definition_hash,
      input: this.#parse(row.input),
      context: this.#parse(row.context) ?? {},
      metadata: this.#parse(row.metadata) ?? {},
      result: this.#parse(row.result),
      errors: this.#parse(row.errors) ?? [],
      flags: this.#parse(row.flags) ?? {},
      parentRunId: row.parent_run_id,
      parentStepId: row.parent_step_id,
      idempotent: row.idempotent,
      retentionMs:
        row.retention_ms === null || row.retention_ms === undefined
          ? null
          : Number(row.retention_ms),
      cancelRequestedAt: row.cancel_requested_at,
      deadlineAt: row.deadline_at,
      retainUntil: row.retain_until,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      finishedAt: row.finished_at,
    }
  }

  #toStep(row: Record<string, any>): StepRecord {
    const step: StepRecord = {
      stepId: row.step_id,
      status: row.status,
      attempt: row.attempt,
      error: this.#parse(row.error) ?? null,
      skipReason: row.skip_reason,
      pendingFailure: this.#parse(row.pending_failure) ?? null,
      startedAt: row.started_at,
      finishedAt: row.finished_at,
      owner: row.owner,
    }
    if (row.has_output) {
      step.output = this.#parse(row.output)
      step.compensateInput = this.#parse(row.compensate_input)
    }
    return step
  }
}
